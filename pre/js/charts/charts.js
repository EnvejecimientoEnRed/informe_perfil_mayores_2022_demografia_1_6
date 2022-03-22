//Desarrollo de las visualizaciones
import * as d3 from 'd3';
import { numberWithCommas2 } from '../helpers';
//import { getInTooltip, getOutTooltip, positionTooltip } from './modules/tooltip';
import { setChartHeight } from '../modules/height';
import { setChartCanvas, setChartCanvasImage, setCustomCanvas, setChartCustomCanvasImage } from '../modules/canvas-image';
import { setRRSSLinks } from '../modules/rrss';
import { setFixedIframeUrl } from './chart_helpers';

//Colores fijos
const COLOR_PRIMARY_1 = '#F8B05C', 
COLOR_PRIMARY_2 = '#E37A42', 
COLOR_ANAG_1 = '#D1834F', 
COLOR_ANAG_2 = '#BF2727', 
COLOR_COMP_1 = '#528FAD', 
COLOR_COMP_2 = '#AADCE0', 
COLOR_GREY_1 = '#B5ABA4', 
COLOR_GREY_2 = '#64605A', 
COLOR_OTHER_1 = '#B58753', 
COLOR_OTHER_2 = '#731854';

export function initChart(iframe) {
    //Lectura de datos
    d3.csv('https://raw.githubusercontent.com/CarlosMunozDiazCSIC/informe_perfil_mayores_2022_demografia_1_7/main/data/poblacion_anciana_ccaa.csv', function(error,data) {
        if (error) throw error;

        data.sort(function(x, y){
            return d3.descending(+x.porc_total_grupo, +y.porc_total_grupo);
        });

        let margin = {top: 20, right: 30, bottom: 40, left: 90},
            width = document.getElementById('chart').clientWidth - margin.left - margin.right,
            height = document.getElementById('chart').clientHeight - margin.top - margin.bottom;

        let svg = d3.select("#chart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let x = d3.scaleLinear()
            .domain([0, 30])
            .range([ 0, width]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        let y = d3.scaleBand()
                .range([ 0, height ])
                .domain(data.map(function(d) { return d.NOMAUTO_2; }))
                .padding(.1);

        svg.append("g")
            .call(d3.axisLeft(y));

        function init() {
            svg.selectAll("bars")
                .data(data)
                .enter()
                .append("rect")
                .attr('class','bars')
                .attr("x", x(0) )
                .attr("y", function(d) { return y(d.NOMAUTO_2); })
                .attr("width", function(d) { return x(0); })
                .attr("height", y.bandwidth() )
                .attr("fill", function(d) {
                    if (d.CODAUTO != 20) {
                        return '#F8B05C';
                    } else {
                        return '#BF2727';
                    }
                })
                .transition()
                .duration(1500)
                .attr("width", function(d) { return x(d.porc_total_grupo); })

        }

        function animateChart() {
            svg.selectAll(".bars")
                .attr("width", function(d) { return x(0); })
                .transition()
                .duration(1500)
                .attr("width", function(d) { return x(d.porc_total_grupo); })
        }

        /////
        /////
        // Resto - Chart
        /////
        /////
        init();

        //Animación del gráfico
        document.getElementById('replay').addEventListener('click', function() {
            animateChart();
        });

        /////
        /////
        // Resto
        /////
        /////

        //Iframe
        setFixedIframeUrl('informe_perfil_mayores_2022_demografia_1_7', 'porc_personas_mayores_espana');

        //Redes sociales > Antes tenemos que indicar cuál sería el texto a enviar
        setRRSSLinks('porc_personas_mayores_espana');

        //Captura de pantalla de la visualización
        //setChartCanvas();
        setCustomCanvas();

        let pngDownload = document.getElementById('pngImage');

        pngDownload.addEventListener('click', function(){
            //setChartCanvasImage('porc_personas_mayores_espana');
            setChartCustomCanvasImage('porc_personas_mayores_espana');
        });

        //Altura del frame
        setChartHeight(iframe);
    });    
}
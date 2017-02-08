var d3 = require('d3');
import _ from 'lodash';
import './style/style.sass';

let url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
let tooltip = d3.select("body")
    .append("div")
    .attr("class" , "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("no data");

    // load the data
let Doped = "blue";

d3.json(url, (jsonData) => {

    let data = jsonData;

        //loop to extract data year and month from fields
    for (let i = 0; i < data.length; i++) {
      let minutesSeconds = '';
      minutesSeconds = data[i].Time;

      let a = minutesSeconds.split(':'); // split it at the colons
      let seconds = (+a[0]) * 60 + (+a[1]);

      if (data[i].Doping !== "") {
          data[i].Doped = "doped";
      } else {
          data[i].Doped = "clean";
          data[i].Doping = "No Doping Allegations";
      }
      data[i].Seconds = seconds;
    }

      // set the dimensions of the canvas
    let margin = {top: 70, right: 70, bottom: 70, left: 40},
      width = 600 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

      // set the ranges
    let x = d3.scaleLinear().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);


    let timeFormatter = function(timeInSeconds) {
        let minutes = Math.floor(timeInSeconds/60)
        let seconds = timeInSeconds % 60;
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return minutes + ":" + seconds;
    };

      //d3.axis* Displays automatic reference lines for scales.
      // define the x axis
    let xAxis = d3.axisBottom()
        .scale(x)

        .tickFormat(timeFormatter)
        .tickSize(8)

        // define the y axis
    let yAxis = d3.axisLeft()
        .scale(y);

        // add the SVG element
    let svg = d3.select("body").append("svg")

        .attr("id", "svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        //.append("g") appends a 'g' element to the SVG. g element is used to group SVG shapes together, so no it's not d3 specific.
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // scale the range of the data
    let minSeconds = data[0].Seconds;
    let maxSeconds = data[data.length-1].Seconds;
    let difSeconds = maxSeconds - minSeconds;
    x.domain([difSeconds, 0]);

        //An optional accessor function may be specified, which is equivalent to calling array.map(accessor) before computing the maximum value.
    y.domain([d3.max(data, function(d) { return d.Place + 1; }), 1]);

      //title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top/1.5))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "none")
        .text("Doping in Professional Bicycle Racing");
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top/3))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "none")
        .html("35 fastest times ascending <a href='https://en.wikipedia.org/wiki/Alpe_dHuez'>Alpe d'Huez</a>");
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top/9))
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("text-decoration", "none")
        .text("Distance normalized to 13.8 km");

        //Left Side Credits
    svg.append("text")
        .attr("x", -120)
        .attr("y", -30)
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "14px")
        .style("text-decoration", "none")
        .html("Ranking");

        //Bottom of the page credits
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("text-decoration", "none")
        .html("Time trailing the record");

        // add x axis
        //The ‘g’ element is a container element for grouping together related graphics elements.
    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis)
        .attr("transform", "translate(0," + height + ")")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr(    "dx", "1em")
        .attr("dy", "1em")

        // add y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Ranking")



    let node = svg.selectAll(".dot")
        .data(data)
        .enter()
      .append("g")
            .attr("class", "node")

    node.append("circle")
        .attr("class", function(d) {return d.Doped;})
        .attr("r", 3.5)
        .attr("cx", function(d) {return (x(d.Seconds - minSeconds));})
        .attr("cy", function (d) {return y(d.Place); })
        .style("background-color", Doped)
        .on("mouseover", function(d){
            d3.select(this).attr("class", "dotSelected")
                .attr("r", 4.5);
            tooltip.style("visibility", "visible")
                .style("top", (d3.event.pageY + 10) + "px")
                .style("left", (d3.event.pageX) + "px")
                .html(d.Name + "<br/>" +
                    d.Nationality + "<br/>" +
                    "Time: "+d.Time + "<br/> Year: "+ d.Year + "<br/>" +
                    " " + d.Doping);
        })
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(){
            d3.select(this).attr("r", 3.5).attr("class", function(d) {return d.Doped;});
            tooltip.style("visibility", "hidden");
        })
    node.append("text")
            .attr("x", function(d) {return (x(d.Seconds - minSeconds))+5;})
            .attr("y", function (d) {return y(d.Place) + 3; })
            .style("font-size", "10px")
            .style("text-decoration", "none")
            .text(function(d) {return d.Name;})

});
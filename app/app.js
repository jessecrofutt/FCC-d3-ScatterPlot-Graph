    //import * as d3 from 'd3';
var d3 = require('d3');
import _ from 'lodash';
import './style/style.sass';

let years = [];
let url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let tooltip = d3.select("body")
    .append("div")
    .attr("class" , "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("no data");
    // load the data

d3.json(url, (jsonData) => {

  let data = jsonData.data;

      //loop to extract data year and month from fields
  for (let i = 0; i < data.length; i++) {

    data[i].push(i);
    let yearRx = /\d+/;
    let monthRx = /\d{4}-(\d{2})-\d{2}/;

        //data[i][3] is the year
    data[i].push(data[i][0].match(yearRx));
    years.push(data[i][0].match(yearRx));

        //data[i][4] is the month.
    let month = data[i][0].match(monthRx, '$2');
    let alphaMonth = "";

    switch(month[1]) {
      case "01":
          alphaMonth = "Jan";
          break;
      case "04":
          alphaMonth = "Apr";
          break;
      case "07":
          alphaMonth = "Jul";
          break;
      case "10":
          alphaMonth = "Sep";
          break;

    }
    data[i].push(alphaMonth);
  }

  console.log("data[0] " + data[0][0]);
  console.log("data[1] " + data[0][1]);
  console.log("data[2] " + data[0][2]);
  console.log("data[3] " + data[0][3]);
  console.log("data[4] " + data[0][4]);

      // set the dimensions of the canvas
  var margin = {top: 70, right: 20, bottom: 70, left: 40},
      width = 600 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

      // set the ranges
      //range ([start, ]stop[, step]) looks like ([start,stop], step) maybe
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

      //d3.axis* Displays automatic reference lines for scales.
      // define the x axis
  var xAxis = d3.axisBottom()
      .scale(x)
          //d3.format("d") removes the comma from the year
      .tickFormat(d3.format("d"))
      .tickSize(8)
      .ticks(25);

    // define the y axis
  var yAxis = d3.axisLeft()
      .scale(y);

    // add the SVG element
  var svg = d3.select("body").append("svg")
      .attr("id", "svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

          //.append("g") appends a 'g' element to the SVG. g element is used to group SVG shapes together, so no it's not d3 specific.
      .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // scale the range of the data
    //x.domain([d3.min(data, function(d) { return d[3]; }), d3.max(data, function(d) { return d[3]; })]);
    //d3.extent(years) returns an array containing the beginning and end of a specified array
  x.domain(d3.extent(years));
    //An optional accessor function may be specified, which is equivalent to calling array.map(accessor) before computing the maximum value.
  y.domain([0, d3.max(data, function(d) { return d[1]; })]);
      //title
  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top/2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("text-decoration", "none")
      .text("US Gross Domestic Product 1947-2015");
  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top/4))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "none")
      .text("In Billions USD");


      //bottom of the page credits
  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", height + 60)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("text-decoration", "none")
      .html(jsonData.source_name);
   svg.append("text")
      .attr("x", (width / 2))
      .attr("y", height + 70)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("text-decoration", "none")
      .html(jsonData.display_url);

    // add x axis
    //The ‘g’ element is a container element for grouping together related graphics elements.
  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis)
      .attr("transform", "translate(0," + height + ")")
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-1em")
      .attr("transform", "rotate(-90)" );

    // add y axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", ".71em")
      .style("text-anchor", "end");



  svg.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("GDP", function (d) {return  d[1]})
      .attr("x", function(d) { return (d[2] * 1.96); })
      .attr("width", width/data.length)
      .attr("y", function (d) {return  (y(d[1]))})
      .attr("height", function(d) { return (height - y(d[1])); })
      .on("mouseover", function(d){
          d3.select(this).attr("class", "barSelected");
          tooltip.style("visibility", "visible").html(d[4]+" "+ d[3] +"<br/>" + "GDP: "+d[1] );

      })
      .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
      .on("mouseout", function(){
          d3.select(this).attr("class", "bar");
          tooltip.style("visibility", "hidden");
      });
});
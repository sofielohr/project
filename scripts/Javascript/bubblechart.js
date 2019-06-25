// Sofie Löhr, 11038926

function process(tourism_data, climate_data) {
  
  var data = {}
  var temperature = {}
  var years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'];
  // var years = ['2010'];

  // make objects for all the years
  for (index in years){
    var Year = years[index]
    data[Year] = {};
    tourism = []

    // go over all the countries
    Object.values(tourism_data).forEach(function(d){

      // check if right year and make objects
      if (d["Year"] == Year){
          
          countries = {}
          countries.name = d.GEO
          countries.size = d.Average
          tourism.push(countries)
        }
    })


    data[Year] = {'children':tourism}
  }

  // add climate data
  Object.values(climate_data).forEach(function(d){
    if (d.Year < 2019){
      data[d.Year].children.forEach(function(e){
        if (e.name == d.Name){

                        // // calculate the fill category datamap
                        // if (d.Average < 1){
                        //   e.fillKey = "lowest"
                        // }
                        // else if (d.Average >= 1 && d.Average < 4){
                        //   e.fillKey = "low"
                        // }
                        // else if (d.Average >= 4 && d.Average < 6){
                        //   e.fillKey = "medium"
                        // }
                        // else if (d.Average >= 6 && d.Average < 8){
                        //   e.fillKey = "high"
                        // }
                        // else if (d.Average >= 8 && d.Average < 10){
                        //   e.fillKey = "higher"
                        // }
                        // else if (d.Average >= 8 && d.Average < 10){
                        //   e.fillKey = "super high"
                        // }
                        // else if (d.Average >= 8 && d.Average < 10){
                        //   e.fillKey = "super high"
                        // }
                        // else if (d.Average >= 9){
                        //   e.fillKey = "ultra high"
                        // }
          e.temperature = d.Average
        }
      })
    }
  })

  return data
}

// function bubble(data){

//   // var diameter = data['2010'].reduce(function(d){ return d.Average})
//   var diameter = 600
//       // format = d3v5.format(",d"),
//   var color = d3v5.scaleThreshold()
//     .domain([1, 4, 6, 8, 10, 12, 14, 16])
//     .range(d3v5.schemeRdBu[9]);
//   // var color = d3v5.scaleOrdinal(data.map(d => d.), d3v5.schemeCategory10)

//   // var simulation = d3v5.forceSimulation()
//   //   .force('name', definetheforce)

//   var bubble = d3v5.pack(data)
//       .size([diameter, diameter])
//       .padding(1.5);

//   var svg = d3v5.select("#bubble")
//       .append("svg")
//       .attr("width", diameter)
//       .attr("height", diameter)
//       .attr("class", "bubble");

//   // hierarchy
//   var nodes = d3v5.hierarchy(data)
//       .sum(function(d){ return d.size; })

//   // JOIN
//   var node = svg.selectAll(".node")
//       .data(bubble(nodes).descendants())
//       .enter()
//       .filter(function(d){
//         return !d.children;
//       })
//       .append("g")
//       .attr("class", "node")
//       .attr("transform", function(d){ return "translate(" + d.x + "," + d.y + ")" })

//   node.append("title")
//       .text(function(d){ return d.Country; })

//   node.append("circle")
//       .attr("r", function(d){ return d.r})
//       .style("fill", function(d){ return color(d.temperature) })

//   d3v5.select(self.frameElement)
//       .style("height", diameter + "px")

// }

function bubble_update_internet(data, year, data_line, data_pie){
  
  var diameter = 600

  var svg = d3v5.select("#bubble").append("svg").attr("id", "bubbles").attr("width", diameter).attr("height", diameter).attr("class", "bubble");

  temp = []
  data[year]["children"].forEach(function(d){
    if (d.temperature != null){
      temp.push(d.temperature)
    }
  })

  var min_temp = Math.min(...temp)
  var max_temp = Math.max(...temp)

  redraw(data, data_line, data_pie, year);
    
  // Add legend
  var svg = d3v5.select("#bubble-color-legend").append("svg")
      .attr("transform", "translate(600,550)")
      .call(color_legend)


function color_legend(g){
 
  var color = d3v5.scaleThreshold()
      .domain([1, 4, 6, 8, 10, 12, 14, 16])
      .range(d3v5.schemeRdBu[9].reverse());

  var width = 280;
  const length = color.range().length;

  const x = d3v5.scaleLinear()
    .domain([1, length - 1])
    .rangeRound([width / length, width * (length - 1) / length]);

  var g1 = g.append("g")
    .attr("transform", "translate(0,20)")

  g1.selectAll("rect")
    .data(color.range())
    .join("rect")
    .attr("height", 8)
    .attr("x", function(d, i){return x(length - 1 - i) ;})
    .attr("width", function(d, i) {return (x(i + 1) - x(i)); })
    .attr("fill", function(d){return d;});

  g.append("text")
    .attr("x", 0)
    .attr("y", 10)
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .text("Temperature");

  g1.call(d3v5.axisBottom(x)
    .tickSize(13)
    .tickFormat(function(i) {return Math.round(color.domain()[i - 1])} )
    .tickValues(d3v5.range(1, length)))
    .select(".domain")
    .remove();

}
}

function slider(data, data_line, data_pie){

  // Set years
  var dataTime = d3v5.range(0, 8).map(function(d) {
      return new Date(2010 + d, 10, 3);
  });

  // Set slider
  var sliderTime = d3v5.sliderBottom()
     .min(d3v5.min(dataTime))
     .max(d3v5.max(dataTime))
     .step(1000 * 60 * 60 * 24 * 365)
     .width(300)
     .tickFormat(d3v5.timeFormat('%Y'))
     .tickValues(dataTime)
     .default(new Date(2010, 10, 3))
     .on('onchange', val => {
         var year = val.getFullYear()
         
         // Create new
         redraw(data, data_line, data_pie, year)
         d3v5.select('p#value-time').text(d3v5.timeFormat('%Y')(val));
     })

  // Add slider to svg
  var gTime = d3v5.select('div#slider-time')
      .append('svg')
      .attr('width', 500)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(20,30)');

  // Call the slider
  gTime.call(sliderTime);

  d3v5.select('p#value-time').text(d3v5.timeFormat('%Y')(sliderTime.value()));

  var default_year = 2010

  // Set bubble chart
  bubble_update_internet(data, default_year, data_line, data_pie)

}

function circle_legend(){

  // append the svg object to the body of the page
  var height = 280
  var width = 280
  var svg = d3v5.select("#bubble-circle-legend")
    .append("svg")
    .attr("id", "bubble-circle-legend")
      .attr("width", width)
      .attr("height", height)

  // The scale you use for bubble size
  var size = d3v5.scaleSqrt()
    .domain([1, 100])  // What's in the data, let's say it is percentage
    .range([1, 100])  // Size in pixel

  // Add legend: circles
  var valuesToShow = [10, 50, 100]
  var xCircle = 110
  var xLabel = 250
  var yCircle = 210
  
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("circle")
      .attr("cx", xCircle)
      .attr("cy", function(d){ return yCircle - size(d) } )
      .attr("r", function(d){ return size(d) })
      .style("fill", "none")
      .attr("stroke", "black")

  // Add legend: segments
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("line")
      .attr('x1', function(d){ return xCircle + size(d) } )
      .attr('x2', xLabel)
      .attr('y1', function(d){ return yCircle - size(d) } )
      .attr('y2', function(d){ return yCircle - size(d) } )
      .attr('stroke', 'black')
      .style('stroke-dasharray', ('2,2'))

  // Add legend: labels
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("text")
      .attr('x', xLabel)
      .attr('y', function(d){ return yCircle - size(d) } )
      .text( function(d){ return d } )
      .style("font-size", 10)
      .attr('alignment-baseline', 'middle')

  svg.append("text")
    .attr("x", 0)
    .attr("y", 10)
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .text("Tourism");
}

function redraw(data, data_line, data_pie, year){

    var svg = d3v5.select("#bubbles")

    var diameter = 600

    var bubble = d3v5.pack(data[year])
      .size([diameter, diameter])
      .padding(1.5);

    var color = d3v5.scaleThreshold()
      .domain([1, 4, 6, 8, 10, 12, 14, 16])
      .range(d3v5.schemeRdBu[9].reverse());

    data = data[year]

    // transition
    var t = d3v5.transition()
        .duration(700);

    // hierarchy
    var nodes = d3v5.hierarchy(data)
        .sum(function(d) { return d.size; })

    //JOIN
    var circle = svg.selectAll("circle")
        .data(bubble(nodes).leaves(), function(d){ return d.data.name; })

    //EXIT
    circle.exit()
        .style("fill", "none")
      .transition(t)
        .attr("r", 1e-6)
        .remove();

    //UPDATE
    circle
      .transition(t)
        .style("fill", function(d){
          if (d.data.temperature == null){
            return "#383645"
          }
          else {
            console.log(color(d.data.temperature))
            return color(d.data.temperature)
          }
        })
        .attr("r", function(d){ return d.r })
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })

    //ENTER
    circle.enter()
        .filter(function(d){
          return !d.children;
        })
        .append("circle")
        .on("click", function(d){

          country = d.data.name
          var year = $('.slider .parameter-value text').html()

          update_line(data_line, year, country)
          update_pie(data_pie, year, country)
        })
        .attr("r", 1e-6)
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .on("mouseover", function(d, i) {

          tooltip.style("display", null);

          d3v5.select(this)
            .attr("stroke", '#383645')
            .attr("stroke-width", 3 )
            .attr("r", function(d){
              return d.r
            })})
        .on("mousemove", function(d){
          var x_pos = d3v5.mouse(this)[0] - 25
          var y_pos = d3v5.mouse(this)[1] - 15
          tooltip.attr("transform", "translate(" + x_pos + "," + y_pos + ")")
          tooltip
          // .select("text")
            // .text(d.data.name)
            .html("<span> Country: <br>" + ": " + d.country + "<br> Temperature: " +  d.temperature + "<br> Tourism: " + d.tourism + "</span>")
        })
        .on("mouseout", function(d, i) {

          tooltip.style("display", "none");

          d3v5.select(this).attr("stroke", "none")
           .attr("r", function(d){
             return d.r
            })
        })
        .transition(t)
        .style("fill", function(d){
          if (d.data.temperature == null){
            return "#383645"
          }
          else {
            return color(d.data.temperature)
          }
        })
        .attr("r", function(d){ return d.r });


    // Add Tooltip
    var tooltip = svg.append("g")

    tooltip.append("text")
        .style("class", "tooltip")

}


// Sofie Löhr, 11038926

function process(tourism_data, climate_data) {

  // make data object and keys
  var data = {};
  var temperature = {};
  var years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'];

  // make objects for all the years
  for (index in years){
    var year = years[index];
    data[year] = {};
    tourism = [];

    // go over all the countries
    Object.values(tourism_data).forEach(function(d){

      // check if right year and make objects
      if (d["Year"] == year){
          
          countries = {};
          countries.name = d.GEO;
          countries.size = d.Average;
          tourism.push(countries);
        }
    })

    // add objects for 
    data[year] = {'children':tourism};
  }

  // add climate data in the same way
  Object.values(climate_data).forEach(function(d){
    if (d.Year < 2019){
      data[d.Year].children.forEach(function(e){
        if (e.name == d.Name){
          e.temperature = d.Average;
        }
      })
    }
  })

  return data;
}

function bubble(data, year, data_line, data_pie){
  
  var diameter = 600;

  var svg = d3v5.select("#bubble")
    .append("svg").attr("id", "bubbles")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

  // to calculate min and max values, set values in array
  temp = [];
  data[year]["children"].forEach(function(d){
    if (d.temperature != null){
      temp.push(d.temperature);
    }
  })

  var min_temp = Math.min(...temp);
  var max_temp = Math.max(...temp);

  // draw the bubblechart first time
  redraw(data, data_line, data_pie, year);
    
  // add legend
  var svg = d3v5.select("#bubble-color-legend")
    .append("svg")
    .attr("transform", "translate(600,550)")
    .call(color_legend);

  function color_legend(g){
   
    var cScheme = ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"];
    
    var color = d3v5.scaleThreshold()
        .domain([1, 4, 6, 8, 10, 12, 14, 16])
        .range(cScheme);

    var width = 280;

    var length = color.range().length;

    // scale x
    var x = d3v5.scaleLinear()
      .domain([1, length - 1])
      .rangeRound([width / length, width * (length - 1) / length]);

    // make new g element for the legend
    var g1 = g.append("g")
      .attr("transform", "translate(0,20)");

    // add rects, texts and ticks
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
      .tickFormat(function(i) {return Math.round(color.domain()[i - 1]);} )
      .tickValues(d3v5.range(1, length)))
      .select(".domain")
      .remove();
  }
}

function slider(data, data_line, data_pie){

  // set years to use
  var dataTime = d3v5.range(0, 8)
  .map(function(d) {
    return new Date(2010 + d, 10, 3);
  });

  // set slider
  var sliderTime = d3v5.sliderBottom()
     .min(d3v5.min(dataTime))
     .max(d3v5.max(dataTime))
     .step(1000 * 60 * 60 * 24 * 365)
     .width(300)
     .tickFormat(d3v5.timeFormat('%Y'))
     .tickValues(dataTime)
     .default(new Date(2010, 10, 3))
     .on('onchange', val => {
         var year = val.getFullYear();
         
         // Create new
         redraw(data, data_line, data_pie, year);
         d3v5.select('p#value-time').text(d3v5.timeFormat('%Y')(val));
     });

  // add slider to svg
  var gTime = d3v5.select('div#slider-time')
      .append('svg')
      .attr('width', 500)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(20,30)');

  // call the slider
  gTime.call(sliderTime);

  d3v5.select('p#value-time').text(d3v5.timeFormat('%Y')(sliderTime.value()));

  // make bubble chart
  var default_year = 2010;
  bubble(data, default_year, data_line, data_pie);
}

function circle_legend(){

  // append the svg object to the body of the page
  var height = 280;
  var width = 280;
  var svg = d3v5.select("#bubble-circle-legend")
    .append("svg")
    .attr("id", "bubble-circle-legend")
      .attr("width", width)
      .attr("height", height);

  // scale the bubble size
  var size = d3v5.scaleSqrt()
    .domain([1, 120000])  
    .range([1, 100]);

  // add legend: circles
  var valuesToShow = [8000, 70000, 120000];
  var xCircle = 110;
  var xLabel = 230;
  var yCircle = 210;
  
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("circle")
      .attr("cx", xCircle)
      .attr("cy", function(d){ return yCircle - size(d); } )
      .attr("r", function(d){ return size(d); })
      .style("fill", "none")
      .attr("stroke", "black");

  // add legend: segments
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("line")
      .attr('x1', function(d){ return xCircle + size(d); } )
      .attr('x2', xLabel)
      .attr('y1', function(d){ return yCircle - size(d); } )
      .attr('y2', function(d){ return yCircle - size(d); } )
      .attr('stroke', 'black')
      .style('stroke-dasharray', ('2,2'));

  // add legend: labels
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("text")
      .attr('x', xLabel)
      .attr('y', function(d){ return yCircle - size(d); } )
      .text( function(d){ return d; } )
      .style("font-size", 10)
      .attr('alignment-baseline', 'middle');

  svg.append("text")
    .attr("x", 0)
    .attr("y", 10)
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .text("Tourism");
}

function redraw(data, data_line, data_pie, year){

    var svg = d3v5.select("#bubbles");

    var diameter = 600;

    var bubble = d3v5.pack(data[year])
      .size([diameter, diameter])
      .padding(1.5);

    var cScheme = ["#2166ac", "#4393c3", "#92c5de", "#d1e5f0", "#f7f7f7", "#fddbc7", "#f4a582", "#d6604d", "#b2182b"];

    var color = d3v5.scaleThreshold()
      .domain([1, 4, 6, 8, 10, 12, 14, 16])
      .range(cScheme);

    // set data to right year
    data = data[year];

    // transition
    var t = d3v5.transition()
        .duration(700);

    // hierarchy
    var nodes = d3v5.hierarchy(data)
        .sum(function(d) { return d.size; });

    //join data
    var circle = svg.selectAll("circle")
        .data(bubble(nodes).leaves(), function(d){ return d.data.name; });

    // exit old bubbles
    circle.exit()
        .style("fill", "none")
      .transition(t)
        .attr("r", 1e-6)
        .remove();

    // update
    circle
      .transition(t)
        .style("fill", function(d){
          if (d.data.temperature == null){
            return "#cccccc";
          }
          else {
            return color(d.data.temperature);
          }
        })
        .attr("r", function(d){ return d.r; })
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; });

    // enter
    circle.enter()
      .filter(function(d){
        return !d.children;
      })
      .append("circle")
      .on("click", function(d){

        // on click, update all the functions
        country = d.data.name;
        var year = $('.slider .parameter-value text').html();

        update_line(data_line, year, country);
        update_pie(data_pie, year, country);
      })
      .attr("r", 1e-6)
      .attr("cx", function(d){ return d.x; })
      .attr("cy", function(d){ return d.y; })
      .on("mouseover", function(d, i) {

        tooltip.style("display", null);

        // set stroke
        d3v5.select(this)
          .attr("stroke", '#363942')
          .attr("stroke-width", 3 )
          .attr("r", function(d){
            return d.r;
      })})
      .on("mousemove", function(d){

        var temperature = Math.round(d.data.temperature * 10)/10;
        var tourism = Math.round(d.data.size);
          
        var x_pos = d3v5.mouse(this)[0] - 61;
        var y_pos = d3v5.mouse(this)[1] - 70;
        var html = "<span><b>" + d.data.name + "</b><br> Temperature: " +  temperature + "<br> Tourism: " + tourism + "</span>";
        
        tooltip
          .attr("transform", "translate(" + x_pos + "," + y_pos + ")")
          .html(html)
          .style("font-size", "10px");
          
      })
      .on("mouseout", function(d, i) {

        tooltip.style("display", "none");

        d3v5.select(this).attr("stroke", "none")
         .attr("r", function(d){
            return d.r;
          });
      })
      .transition(t)
      .style("fill", function(d){
        if (d.data.temperature == null){
          return "#cccccc";
        }
        else {
          return color(d.data.temperature);
        }
      })
      .attr("r", function(d){ return d.r; });

    // add Tooltip
    var tooltip = svg.append("foreignObject")
      .attr("width", 200)
      .attr("height", 60)
      .style("class", "tooltip");

}


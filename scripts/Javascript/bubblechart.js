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
          e.temperature = d.Average
        }
      })
    }
  })
  console.log(data)

  return data
}

function bubble(data){

  // var diameter = data['2010'].reduce(function(d){ return d.Average})
  var diameter = 600
      // format = d3v5.format(",d"),
  var color = d3v5.scaleOrdinal(['#e5f5f9','#99d8c9','#2ca25f']);
  // var color = d3v5.scaleOrdinal(data.map(d => d.), d3v5.schemeCategory10)
  
  // var simulation = d3v5.forceSimulation()
  //   .force('name', definetheforce)

  var bubble = d3v5.pack(data)
      .size([diameter, diameter])
      .padding(1.5);

  var svg = d3v5.select("#bubble")
      .append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");

  // hierarchy
  var nodes = d3v5.hierarchy(data)
      .sum(function(d){ return d.size; })

  // JOIN
  var node = svg.selectAll(".node")
      .data(bubble(nodes).descendants())
      .enter()
      .filter(function(d){
        return !d.children;
      })
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d){ return "translate(" + d.x + "," + d.y + ")" })

  node.append("title")
      .text(function(d){ return d.Country; })

  node.append("circle")
      .attr("r", function(d){ return d.r})
      .style("fill", function(d){ return color(d.temperature) })

  d3v5.select(self.frameElement)
      .style("height", diameter + "px")

}

function bubble_update_internet(data){

  var diameter = 600

  var svg = d3v5.select("#bubble").append("svg").attr("width", diameter).attr("height", diameter).attr("class", "bubble");

  var bubble = d3v5.pack(data)
      .size([diameter, diameter])
      .padding(1.5);

  redraw(data);

  function redraw(data){

    // transition
    var t = d3v5.transition()
        .duration(700);

    // hierarchy
    var nodes = d3v5.hierarchy(data)
        .sum(function(d) { return d.size; })

    //JOIN
    var circle = svg.selectAll(".node")
        .data(bubble(nodes).leaves(), function(d){ return d.data.name; })

    var text = svg.selectAll("text")
        .data(bubble(nodes).leaves(), function(d){ return d.data.name; });

    //EXIT
    circle.exit()
        .style("fill", "#b26745")
      .transition(t)
        .attr("r", 1e-6)
        .remove();

    text.exit()
      .transition(t)
        .attr("opacity", 1e-6)
        .remove();

    //UPDATE
    circle
      .transition(t)
        .style("fill", "#3a403d")
        .attr("r", function(d){ return d.r })
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })

    text
      .transition(t)
        .attr("x", function(d){ return d.x; })
        .attr("y", function(d){ return d.y; });

    //ENTER
    circle.enter()
        .filter(function(d){
          return !d.children;
        })
        .append("circle")
        .attr("r", 1e-6)
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .style("fill", "#fff")
         .on("click", function(d){ update_line(d)})
      .transition(t)
        .style("fill", "#45b29d")
        .attr("r", function(d){ return d.r })
       

    text.enter().append("text")
        .attr("opacity", 1e-6)
        .attr("x", function(d){ return d.x; })
        .attr("y", function(d){ return d.y; })
        .text(function(d){ return d.data.name; })
      .transition(t)
        .attr("opacity", 1);
  }
}

function slider(data){

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
         // Remove old
         $('#bubble').empty();
         // Create new
         bubble_update_internet(data[val.getFullYear()]);
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
}


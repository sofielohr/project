// Sofie Löhr, 11038926

function process(tourism_data) {
  
  var data = {}
  var years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'];
  var years = ['2010'];

  // make objects for all the years
  for (index in years){
    var Year = years[index]
    data[Year] = {};

    // go over all the countries
    Object.values(tourism_data).forEach(function(d){

      // check if right year and make objects
      if (d["Year"] == Year){
        var country_variables = {}
        country_variables.tourism = d.Average
        country_variables.country = d.GEO

        // add to the dataframe
        data[Year][d.GEO] = country_variables          
      }
    })
  }
  console.log(data)
  return data
}


function process_bubble(data){

  var total = {}
  var tourism = []

  Object.values(data).forEach(function(jaar){
    Object.values(jaar).forEach(function(land){
      countries = {}
      countries.name = land.country
      countries.size = land.tourism
      tourism.push(countries)
    })
  })

  var data = {'children':tourism}
  return data
}

function bubble(data){

  // var diameter = data['2010'].reduce(function(d){ return d.Average})
  var diameter = 600
      // format = d3v5.format(",d"),
  var color = d3v5.scaleOrdinal(['#e5f5f9','#99d8c9','#2ca25f'])

  var bubble = d3v5.pack(data)
      .size([diameter, diameter])
      .padding(1.5);

  var svg = d3v5.select("#bubble")
      .append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");

  var nodes = d3v5.hierarchy(data)
      .sum(function(d){ return d.size; })

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
      .style("fill", function(d, i){ return color(i) })

  d3v5.select(self.frameElement)
      .style("height", diameter + "px")


}

function slider(data){
  console.log('hoi')

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
         bubble(data[val.getFullYear()]);
         d3v5.select('p#value-time').text(d3v5.timeFormat('%Y')(val));
     });

  // Add slider to svg
  var gTime = d3v5.select('div#slider-time')
      .append('svg')
      .attr('width', 500)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(250,30)');

  // Call the slider
  gTime.call(sliderTime);

  d3v5.select('p#value-time').text(d3v5.timeFormat('%Y')(sliderTime.value()));
}










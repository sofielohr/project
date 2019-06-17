// Sofie Löhr, 11038926

window.onload = function() {

  var requests = [d3v5.json("tourism_year_data.json"),d3v5.json("tourism_data.json"),d3v5.json("climate_year_data.json"),d3v5.json("climate_data.json")];
  Promise.all(requests).then(function(response) {
  
  	// process tourism data
    var tourism_data = process(response[0]);
    var bubble_data = process_bubble(tourism_data);

    // create bubble chart & slider
    bubble(bubble_data)
    slider(bubble_data)

    // line chart
    country = "France"
    year = 2011
    var data_linegraph = line_data(response[1], response[3])
    line(data_linegraph, country, year)

    var data_piechart = piechart()
  
  // }).catch(function(e){
  //   throw(e);
  })


}














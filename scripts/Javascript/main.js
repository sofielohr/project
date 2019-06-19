// Sofie Löhr, 11038926

window.onload = function() {

  var requests = [d3v5.json("tourism_year_data.json"),d3v5.json("tourism_data.json"),d3v5.json("climate_year_data.json"),d3v5.json("climate_data.json"), d3v5.json("pie_data.json"), d3v5.json("tourism_year_data_pie.json")];
  Promise.all(requests).then(function(response) {
  
    country = "France"
    year = 2014

  	// process tourism data
    var tourism_data = process(response[0], response[2]);
    // var bubble_data = process_bubble(tourism_data);

    // create bubble chart & slider
    // bubble(tourism_data[year])
    slider(tourism_data)

    bubble_update_internet(tourism_data[year])

    // line chart
    var data_linegraph = line_data(response[1], response[3])
    line(data_linegraph, country, year)

    var data_piechart = piechart_data(response[4], response[5])
    piechart(data_piechart, country, year)
  
  // }).catch(function(e){
  //   throw(e);
  })


}














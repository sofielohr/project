// Sofie Löhr, 11038926

window.onload = function() {

  var requests = [d3v5.json("data/tourism_year_data.json"),d3v5.json("data/tourism_data.json"),d3v5.json("data/climate_year_data.json"),d3v5.json("data/climate_data.json"), d3v5.json("data/pie_data.json"), d3v5.json("data/tourism_year_data_pie.json")];
  Promise.all(requests).then(function(response) {
   
    country = "United Kingdom";
    year = 2010;

  	// process tourism data
    var tourism_data = process(response[0], response[2]);
    var data_linegraph = line_data(response[1], response[3]);
    var data_piechart = piechart_data(response[4], response[5]);

    slider(tourism_data, data_linegraph, data_piechart);
    circle_legend();

    // line and pie chart
    line(data_linegraph, country, year);
    piechart(data_piechart, country, year);
  
  }).catch(function(e){
    throw(e);
  })


}














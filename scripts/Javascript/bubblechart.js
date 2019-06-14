// Sofie Löhr, 11038926

// loading data
window.onload = function() {
	console.log("hoi")
	var requests = [d3v5.json("../../data/tourism_data.json")];

	Promise.all(requests).then(function(response) {
		console.log("hoi")
		
		// process tourism data
		var tourism_data = process(response[0]);
		
		
		
	}).catch(function(e){
		throw(e);
	});


	function process(tourism_data) {

		var data = {}
		var years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
		
		console.log(tourism_data)


		// for (year in years){
  //           var YEAR = years[year];
  //           dataset[YEAR] = {};
  //       }

  //       // Set dataset
  //       for (year in years){
  //           var YEAR = years[year];
  //           Object.values(data).forEach(function(d){
  //               // dataset[YEAR] = {};
  //               // dataset_year = {};
  //               // console.log(dataset);
  //               if (d["TIME"] == YEAR){
  //                   // checken of land al in de dictionairy staat dan dit doen
  //                   if (!(d["LOCATION"] in dataset[YEAR])){
  //                       var variables = {};
  //                       variables.country = d["LOCATION"];
  //                       variables.year = d["TIME"];
  //                       variables[d["SUBJECT"]] = d["Value"];

  //                       dataset[YEAR][d["LOCATION"]] = variables;
  //                   }
  //                   else {
  //                       dataset[YEAR][d["LOCATION"]][d["SUBJECT"]] = d["Value"];
  //                   };

  //               };
  //           });
	// }





















}

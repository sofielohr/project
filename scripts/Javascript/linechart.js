// Sofie Löhr, 11038926

function line_data(tourism, climate){

	var data = {}
	var years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'];

	// go over all the countries
	Object.values(tourism).forEach(function(d){

		// check if right year and make objects
		if (!(d.Year in data)){

			data[d.Year] = {}
		}
		
		if (d.GEO in data[d.Year]){

			var country_variables = {}
			country_variables.month = d.Month
			country_variables.tourism = d.Value
			country_variables.country = d.GEO
			if (d.Month < 10) {
				country_variables.date = "0" + d.Month + "-" + d.Year
			}
			else {
				country_variables.date = d.Month + "-" + d.Year
			}

			// add to the dataframe
			data[d.Year][d.GEO][d.Month] = country_variables

		}
		else {

			data[d.Year][d.GEO] = {}

			var country_variables = {}
			country_variables.month = d.Month
			country_variables.tourism = d.Value
			country_variables.country = d.GEO
			if (d.Month < 10) {
				country_variables.date = "0" + d.Month + "-" + d.Year
			}
			else {
				country_variables.date = d.Month + "-" + d.Year
			}

			// add to the dataframe
			data[d.Year][d.GEO][d.Month] = country_variables
		}      
	})

	// // make objects for all the years
	// for (index in years){
	// 	var Year = years[index]
	// 	data[Year] = {};

	// 	// go over all the countries
	// 	Object.values(tourism).forEach(function(d){

	// 		// check if right year and make objects
	// 		if (d["Year"] == Year){

	// 			if (d["GEO"] in data[Year]){

	// 				var country_variables = {}
	// 				country_variables.month = d.Month
	// 				country_variables.tourism = d.Average
	// 				country_variables.country = d.GEO
	// 				country_variables.date = d.Month + "-" + d.Year

	// 				// add to the dataframe
	// 				data[Year][d.GEO][d.Month] = country_variables

	// 			}
	// 			else {

	// 				data[Year][d.GEO] = {}

	// 				var country_variables = {}
	// 				country_variables.month = d.Month
	// 				country_variables.tourism = d.Average
	// 				country_variables.country = d.GEO
	// 				if (d.Month < 10){
	// 					country_variables.date = "0" + d.Month + "-" + d.Year
	// 				}
	// 				else{
	// 					country_variables.date = d.Month + "-" + d.Year
	// 				}

	// 				// add to the dataframe
	// 				data[Year][d.GEO][d.Month] = country_variables
	// 			}      
	// 		}
	// 	})
	// }

	// add climate data
	Object.values(climate).forEach(function(d){
		
		if (d.Year < 2019){
			if (d.Name in data[d.Year]){
			data[d.Year][d.Name][d.Month]["temperature"] = d.Average
			}
		}
	})

	console.log(data)
	return data
}

function line(data, country, year){

	var margin = {top: 20, right: 40, bottom: 30, left: 50},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	// parse the date / time
	var parseTime = d3v5.timeParse("%m-%Y");
	// var parseTime = d3v5.timeParse("%d-%b-%y");

	// set the ranges
	var x = d3v5.scaleTime().range([0, width]);
	var y0 = d3v5.scaleLinear().range([height, 0]);
	var y1 = d3v5.scaleLinear().range([height, 0]);

	// define the 1st line
	var valueline = d3v5.line()
		.x(function(d) { return x(parseTime(d.date)); })
		.y(function(d) { return y0(d.tourism); });


	// define the 2nd line
	var valueline2 = d3v5.line()
		.x(function(d) { return x(parseTime(d.date)); })
		.y(function(d) { return y1(d.temperature); });

	// append the svg obgect to the body of the page
	// appends a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3v5.select("#line").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	data = data[year][country]
	// change data structure
	data_line = []
	for (m in data){
		data_line.push(data[m])
	}
	console.log(data_line)

	// Scale the range of the data
	x.domain(d3v5.extent(data_line, function(d) {return parseTime(d.date); }));
	y0.domain([0, d3v5.max(data_line, function(d) {return Math.max(d.tourism);})]);
	y1.domain([0, d3v5.max(data_line, function(d) {return Math.max(d.temperature); })]);

	// Add the valueline path.
	svg.append("path")
		.data([data_line])
		.attr("class", "line")
		.style("stroke", "steelblue")
		.style("fill", "none")
		.attr("d", valueline);

	// Add the valueline2 path.
	svg.append("path")
		.data([data_line])
		.attr("class", "line")
		.style("stroke", "red")
		.style("fill", "none")
		.attr("d", valueline2);

	// Add the X Axis
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3v5.axisBottom(x));

	// Add the Y0 Axis
	svg.append("g")
		.attr("class", "axisSteelBlue")
		.call(d3v5.axisLeft(y0));

	// Add the Y1 Axis
	svg.append("g")
		.attr("class", "axisRed")
		.attr("transform", "translate( " + width + ", 0 )")
		.call(d3v5.axisRight(y1));

};










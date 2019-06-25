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

	// add climate data
	Object.values(climate).forEach(function(d){
		
		if (d.Year < 2019){
			if (d.Name in data[d.Year]){
			data[d.Year][d.Name][d.Month]["temperature"] = d.Average
			}
		}
	})

	return data
}

function line(data, country, year){

	var margin = {top: 35, right: 50, bottom: 35, left: 50},
		width = 600 - margin.left - margin.right,
		height = 350 - margin.top - margin.bottom;

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
	var svg = d3v5.select("#line-area").append("svg")
		.attr("id", "line")
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

	// Scale the range of the data
	x.domain(d3v5.extent(data_line, function(d) {return parseTime(d.date); }));
	y0.domain([0, d3v5.max(data_line, function(d) {return Math.max(d.tourism);})]);
	y1.domain([d3v5.min(data_line, function(d) {return Math.min(d.temperature); }), d3v5.max(data_line, function(d) {return Math.max(d.temperature); })]);

	// Add the valueline path.
	svg.append("path")
		.data([data_line])
		.attr("class", "line_tourism")
		.style("stroke", "#708090")
		.style("stroke-width", 3)
		.style("fill", "none")
		.attr("d", valueline);

	// Add the valueline2 path.
	svg.append("path")
		.data([data_line])
		.attr("class", "line_temp")
		.style("stroke", "#800000")
		.style("stroke-width", 3)
		.style("fill", "none")
		.attr("d", valueline2);

	// Add the X Axis
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3v5.axisBottom(x));

	// Add the Y0 Axis
	svg.append("g")
		.attr("class", "y_axis_tourism")
		.call(d3v5.axisLeft(y0));

	// Add the Y1 Axis
	svg.append("g")
		.attr("class", "y_axis_temp")
		.attr("transform", "translate( " + width + ", 0 )")
		.call(d3v5.axisRight(y1));


	// Add x label
    svg.append('text')
       .attr('class', 'x_label')
       .attr("font-weight", "bold")
       .attr('x', width / 2)
       .attr('y', height + margin.bottom)
       .attr('text-anchor', 'middle')
       .text('Month');

    // Add y labels
    svg.append('g').attr("class", "y_label_tourism")
       .append('text')
       .attr("font-weight", "bold")
       .attr("transform", "rotate(-90)")
       .attr('x', - (height / 2))
       .attr('y', - margin.left + 10)
       .attr('text-anchor', 'middle')
       .style("fill", "#708090")
       .text("Tourism");

   svg.append('g').attr("class", "y_label_temp")
       .append('text')
       .attr("font-weight", "bold")
       .attr("transform", "rotate(-90)")
       .attr('x', - (height / 2))
       .attr('y', width + margin.right - 10)
       .attr('text-anchor', 'middle')
       .style("fill", "#800000")
       .text("Temperature");

    // Add title
    svg.append('text')
       .attr('class', 'title')
       .attr("font-size", "14px")
       .attr("font-weight", "bold")
       .attr('x', width / 2)
       .attr('y', -10)
       .attr('text-anchor', 'middle')
       .text('Average temperature and tourism');

   // Add scale tourism axis
    svg.append('text')
       .attr('class', 'y_addition')
       .attr("font-size", "10px")
       .attr('x', 10)
       .attr('y', -5)
       .attr('text-anchor', 'middle')
       .text('x mln.');


};

function update_line(data, year, country) {

	var margin = {top: 35, right: 50, bottom: 35, left: 50},
	width = 600 - margin.left - margin.right,
	height = 350 - margin.top - margin.bottom;

	data = data[year][country]
	console.log(data)

	// change data structure
	data_line = []
	for (m in data){
		data_line.push(data[m])
	}

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
    
    // Scale the range of the data
	x.domain(d3v5.extent(data_line, function(d) {return parseTime(d.date); }));
	y0.domain([0, d3v5.max(data_line, function(d) {return Math.max(d.tourism);})]);
	y1.domain([d3v5.min(data_line, function(d) {return Math.min(d.temperature); }), d3v5.max(data_line, function(d) {return Math.max(d.temperature); })]);
  
	
	var svg = d3v5.select("#line")

	var t = d3v5.transition().duration(750)

	// JOIN
	var line_tourism = svg.selectAll(".line_tourism")
		.data([data_line])

	var line_temp = svg.selectAll(".line_temp")
		.data([data_line])

	var x_axis = svg.selectAll(".x_axis")
		.transition(t)
		.call(d3v5.axisBottom(x))

	var y_axis_tourism = svg.selectAll(".y_axis_tourism")
		.transition(t)
		.call(d3v5.axisLeft(y0))

	var y_axis_tourism = svg.selectAll(".y_axis_temp")
		.transition(t)
		.call(d3v5.axisRight(y1))


	// ENTER
	line_tourism.enter().append("path")
		.attr("class", "line_tourism")
		.style("stroke", "#708090")
		.style("stroke-width", 3)
		.style("fill", "none")
		.merge(line_tourism)
		.transition(t)
		.attr("d", valueline);
    
    line_temp.enter().append("path")
		.attr("class", "line_temp")
		.style("stroke", "#708090")
		.style("stroke-width", 3)
		.style("fill", "none")
		.merge(line_temp)
		.transition(t)
		.attr("d", valueline2);
}

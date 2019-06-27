// Sofie Löhr, 11038926

function line_data(tourism, climate){

	// create data object and main keys
	var data = {};
	var years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"];

	// go over all the countries
	Object.values(tourism).forEach(function(d){

		// make new year object if not in data
		if (!(d.Year in data)){

			data[d.Year] = {};
		}
		
		// check if country already in object
		if (d.GEO in data[d.Year]){

			var country_variables = {};
			country_variables.month = d.Month;
			country_variables.tourism = d.Value;
			country_variables.country = d.GEO;

			// set the dates to format "%m-%Y"
			if (d.Month < 10) {
				country_variables.date = "0" + d.Month + "-" + d.Year;
			}
			else {
				country_variables.date = d.Month + "-" + d.Year;
			}

			// add to the dataframe
			data[d.Year][d.GEO][d.Month] = country_variables;

		}
		// if country not in object, make a new country object
		else {

			data[d.Year][d.GEO] = {};

			var country_variables = {};
			country_variables.month = d.Month;
			country_variables.tourism = d.Value;
			country_variables.country = d.GEO;

			// set the dates to format "%m-%Y"
			if (d.Month < 10) {
				country_variables.date = "0" + d.Month + "-" + d.Year;
			}
			else {
				country_variables.date = d.Month + "-" + d.Year;
			}

			// add to the dataframe
			data[d.Year][d.GEO][d.Month] = country_variables;
		}      
	})

	// add climate data the same way
	Object.values(climate).forEach(function(d){
		
		if (d.Year < 2019){
			if (d.Name in data[d.Year]){
			data[d.Year][d.Name][d.Month]["temperature"] = d.Average;
			}
		}
	})

	return data;
}

function line(data, country, year){

	// set margins and size
	var margin = {top: 50, right: 50, bottom: 35, left: 70},
		width = 600 - margin.left - margin.right,
		height = 350 - margin.top - margin.bottom;

	// parse the date / time
	var parseTime = d3v5.timeParse("%m-%Y");

	// set the ranges
	var x = d3v5.scaleTime()
		.range([0, width]);
	var y0 = d3v5.scaleLinear()
		.range([height, 0]);
	var y1 = d3v5.scaleLinear()
		.range([height, 0]);

	// define the 1st line
	var valueline_tourism = d3v5.line()
		.x(function(d) { return x(parseTime(d.date)); })
		.y(function(d) { return y0(d.tourism); });

	// define the 2nd line
	var valueline_temp = d3v5.line()
		.x(function(d) { return x(parseTime(d.date)); })
		.y(function(d) { return y1(d.temperature); });

	// append the svg obgect to the body of the page
	// appends a "group" element to "svg"
	// moves the "group" element to the top left margin
	var svg = d3v5.select("#line-area").append("svg")
		.attr("id", "line")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr("class", "line_area");

	// set data to correct year and country
	data = data[year][country];

	// change data structure for line
	data_line = []
	for (m in data){
		data_line.push(data[m]);
	}

	// scale the range of the data
	x.domain(d3v5.extent(data_line, function(d) {return parseTime(d.date); }));
	y0.domain([0, d3v5.max(data_line, function(d) {return Math.max(d.tourism);})]);
	y1.domain([d3v5.min(data_line, function(d) {return Math.min(d.temperature); }), d3v5.max(data_line, function(d) {return Math.max(d.temperature); })]);

	// add the valueline path.
	svg.append("path")
		.data([data_line])
		.attr("class", "line_tourism")
		.style("stroke", "#708090")
		.style("stroke-width", 3)
		.style("fill", "none")
		.attr("d", valueline_tourism);

	// add the valueline2 path.
	svg.append("path")
		.data([data_line])
		.attr("class", "line_temp")
		.style("stroke", "#800000")
		.style("stroke-width", 3)
		.style("fill", "none")
		.attr("d", valueline_temp);

	// add the dots for the datapoints
	svg.selectAll(".dot_tourism")
		.data(data_line)
		.enter().append("circle")
		.attr("class", "dot_tourism")
		.on("mouseover", function(d, i) {
                  tooltip.style("display", null);
                })
        .on("mousemove", function(d){
			var tourism = Math.round(d.tourism)

			var x_pos = d3v5.mouse(this)[0] - 61;
			var y_pos = d3v5.mouse(this)[1] - 61;

			var html = "<span><b> Tourism:</b>: " + tourism + "</span>";
                  
			tooltip
				.attr("transform", "translate(" + x_pos + "," + y_pos + ")")
				.html(html)
				.style("font-size", "10px");

        })
        .on("mouseout", function(d, i) {
			tooltip.style("display", "none");
		})
		.attr("cx", function(d, i){ return x(parseTime(d.date));})
		.attr("cy", function(d){ return y0(d.tourism);})
		.attr("r", 3)
		.attr("fill", "#708090");

	svg.selectAll(".dot_temp")
		.data(data_line)
		.enter().append("circle")
		.attr("class", "dot_temp")
		.on("mouseover", function(d, i) {
			tooltip.style("display", null);
		})
        .on("mousemove", function(d){
			var temperature = Math.round(d.temperature)

			var x_pos = d3v5.mouse(this)[0] - 61;
			var y_pos = d3v5.mouse(this)[1] - 61;

			var html = "<span><b> Temperature</b>: " + temperature + "</span>";

			tooltip
				.attr("transform", "translate(" + x_pos + "," + y_pos + ")")
				.html(html)
				.style("font-size", "10px")

		})
		.on("mouseout", function(d, i) {
			tooltip.style("display", "none");
		})
		.attr("cx", function(d, i){ return x(parseTime(d.date));})
		.attr("cy", function(d){ return y1(d.temperature);})
		.attr("r", 3)
		.attr("fill", "#800000");

	// add the X Axis
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3v5.axisBottom(x));

	// add the Y0 Axis
	svg.append("g")
		.attr("class", "y_axis_tourism")
		.call(d3v5.axisLeft(y0));

	// add the Y1 Axis
	svg.append("g")
		.attr("class", "y_axis_temp")
		.attr("transform", "translate( " + width + ", 0 )")
		.call(d3v5.axisRight(y1));

	// add x label
    svg.append("text")
       .attr("class", "x_label")
       .attr("font-weight", "bold")
       .attr("x", width / 2)
       .attr("y", height + margin.bottom)
       .attr("text-anchor", "middle")
       .text("Month");

    // add y labels
    svg.append("g").attr("class", "y_label_tourism")
       .append("text")
       .attr("font-weight", "bold")
       .attr("transform", "rotate(-90)")
       .attr("x", - (height / 2))
       .attr("y", - margin.left + 10)
       .attr("text-anchor", "middle")
       .style("fill", "#708090")
       .text("Tourism");

   svg.append("g").attr("class", "y_label_temp")
       .append("text")
       .attr("font-weight", "bold")
       .attr("transform", "rotate(-90)")
       .attr("x", - (height / 2))
       .attr("y", width + margin.right - 10)
       .attr("text-anchor", "middle")
       .style("fill", "#800000")
       .text("Temperature");

    // add title
    svg.append("text")
       .attr("class", "title")
       .attr("font-size", "14px")
       .attr("font-weight", "bold")
       .attr("x", width / 2)
       .attr("y", -30)
       .attr("text-anchor", "middle")
       .text("Average temperature and tourism");

   // add text to show the chosen country and year
   svg.append("text")
       .attr("class", "chosen_country")
       .attr("font-size", "16px")
       .attr("font-weight", "bold")
       .attr("x", margin.left/2)
       .attr("y", 0)
       .attr("text-anchor", "left")
       .text(country);

   svg.append("text")
       .attr("class", "chosen_year")
       .attr("font-size", "16px")
       .attr("x", margin.left/2)
       .attr("y", 16)
       .attr("text-anchor", "left")
       .text(year);

   // add Tooltip
    var tooltip = svg.append("foreignObject")
    .attr("width", 200)
    .attr("height", 60)
    .style("class", "tooltip")


};

function update_line(data, year, country) {

	// set margins and size
	var margin = {top: 50, right: 50, bottom: 35, left: 70},
	width = 600 - margin.left - margin.right,
	height = 350 - margin.top - margin.bottom;

	data = data[year][country];

	// change data structure
	data_line = []
	for (m in data){
		data_line.push(data[m]);
	}

	// parse the date / time
	var parseTime = d3v5.timeParse("%m-%Y");

	// set the ranges
	var x = d3v5.scaleTime().range([0, width]);
	var y0 = d3v5.scaleLinear().range([height, 0]);
	var y1 = d3v5.scaleLinear().range([height, 0]);

	// define the 1st line
	var valueline_tourism = d3v5.line()
		.x(function(d) { return x(parseTime(d.date)); })
		.y(function(d) { return y0(d.tourism); });


	// define the 2nd line
	var valueline_temp = d3v5.line()
		.x(function(d) { return x(parseTime(d.date)); })
		.y(function(d) { return y1(d.temperature); });
    
    // Ssale the range of the data
	x.domain(d3v5.extent(data_line, function(d) {return parseTime(d.date); }));
	y0.domain([0, d3v5.max(data_line, function(d) {return Math.max(d.tourism);})]);
	y1.domain([d3v5.min(data_line, function(d) {return Math.min(d.temperature); }), d3v5.max(data_line, function(d) {return Math.max(d.temperature); })]);
  
	// set svg	
	var svg = d3v5.select("#line");

	// set transition
	var t = d3v5.transition().duration(750);

	// join data for tourism
	var line_tourism = svg.selectAll(".line_tourism")
		.data([data_line]);

	var dot_tourism = svg.selectAll(".dot_tourism")
		.data(data_line);

	// enter and update for tourism
	line_tourism.enter().append("path")
		.attr("class", "line_tourism")
		.style("stroke", "#708090")
		.style("stroke-width", 3)
		.style("fill", "none")
		.merge(line_tourism)
		.transition(t)
		.attr("d", valueline_tourism);

	// add the dots to the line together with the tooltip for tourism
	dot_tourism
		.enter()
		.append("circle")
		.attr("class", "dot_tourism")
		.on("mouseover", function(d, i) {
			tooltip.style("display", null);
		})
		.on("mousemove", function(d){
			var tourism = Math.round(d.tourism)

			var x_pos = d3v5.mouse(this)[0] - 61;
			var y_pos = d3v5.mouse(this)[1] - 61;
                  
			var html = "<span><b> Tourism:</b>: " + tourism + "</span>";
                  
			tooltip
				.attr("transform", "translate(" + x_pos + "," + y_pos + ")")
				.html(html)
				.style("font-size", "10px");

		})
		.on("mouseout", function(d, i) {
			tooltip.style("display", "none");
		})
        .attr("r", 3)
		.attr("fill", "#708090")
		.merge(dot_tourism)
		.transition(t)
		.attr("cx", function(d, i){ return x(parseTime(d.date));})
		.attr("cy", function(d){ return y0(d.tourism);});
    
    
    // for temperature, check if missing data
    if (!(data[6].temperature == undefined)){

    	// join data if temperature available
    	var line_temp = svg.selectAll(".line_temp")
			.data([data_line]);

		var dot_temp = svg.selectAll(".dot_temp")
			.data(data_line);

    	// enter and update the temperature data
    	line_temp.enter()
    	.append("path")
			.attr("class", "line_temp")
			.style("stroke", "#708090")
			.style("stroke-width", 3)
			.style("fill", "none")
		.merge(line_temp)
			.transition(t)
			.attr("d", valueline_temp);

		// add dots and tooltip to the line
		dot_temp.enter()
		.append("circle")
		.attr("class", "dot_temp")
		.on("mouseover", function(d, i) {
			tooltip.style("display", null);
		})
        .on("mousemove", function(d){
			var temperature = Math.round(d.temperature)

			var x_pos = d3v5.mouse(this)[0] - 61;
			var y_pos = d3v5.mouse(this)[1] - 61;
                  
			var html = "<span><b> Temperature</b>: " + temperature + "</span>";
                  
			tooltip
				.attr("transform", "translate(" + x_pos + "," + y_pos + ")")
				.html(html)
				.style("font-size", "10px");

			})
		.on("mouseout", function(d, i) {
			tooltip.style("display", "none");
		})
        .attr("r", 3)
		.merge(dot_temp)
		.transition(t)
		.attr("cx", function(d, i){ return x(parseTime(d.date));})
		.attr("cy", function(d){ return y1(d.temperature);})
		.attr("fill", "#800000")
    }
    else{
    	// if temperature not available, set to empty array
    	var line_temp = svg.selectAll(".line_temp")
			.data([[]]);

		var dot_temp = svg.selectAll(".dot_temp")
			.data([0,0,0,0,0,0,0,0,0,0,0,0]);

    	// enter and update the temperature data
    	line_temp.enter()
    	.append("path")
			.attr("class", "line_temp")
			.style("stroke", "#708090")
			.style("stroke-width", 3)
			.style("fill", "none")
		.merge(line_temp)
			.transition(t)
			.attr("d", valueline_temp);

		// add dots to the line (white)
		dot_temp.enter()
			.append("circle")
			.attr("class", "dot_temp")
	        .attr("r", 3)
			.merge(dot_temp)
			.attr("cx", function(d, i){return null;})
			.attr("cy", function(d){ return null;})
			.attr("fill", "#ffffff")
    }	

	// update axis
	var x_axis = svg.selectAll(".x_axis")
		.transition(t)
		.call(d3v5.axisBottom(x));

	var y_axis_tourism = svg.selectAll(".y_axis_tourism")
		.transition(t)
		.call(d3v5.axisLeft(y0));

	var y_axis_temp = svg.selectAll(".y_axis_temp")
		.transition(t)
		.call(d3v5.axisRight(y1));

}

function update_text(year, country){

	// set margins and size
	var margin = {top: 50, right: 50, bottom: 35, left: 70},
	width = 600 - margin.left - margin.right,
	height = 350 - margin.top - margin.bottom;

	var t = d3v5.transition().duration(200)

	// select svg
	var g = d3v5.select(".line_area");

	// remove old text
	var text_country = g.selectAll(".chosen_country")
		.remove()

	var text_year = g.selectAll(".chosen_year")
		.remove()

	// add text to show the chosen country and year
   g.append("text")
       .attr("class", "chosen_country")
       .attr("font-size", "16px")
       .attr("font-weight", "bold")
       .attr("x", margin.left/2)
       .attr("y", 0)
       .attr("text-anchor", "left")
       .transition(t)
       .text(country);

   g.append("text")
       .attr("class", "chosen_year")
       .attr("font-size", "16px")
       .attr("x", margin.left/2)
       .attr("y", 16)
       .attr("text-anchor", "left")
       .transition(t)
       .text(year);

}

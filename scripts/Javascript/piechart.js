// Sofie Löhr, 11038926

function piechart_data(outgoing, incoming){

    // make object and set keys
    var data = {};
    var years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"];

    // go over all the countries
    Object.values(incoming).forEach(function(d){

        // check if right year and make objects
        if (!(d.Year in data)){


            data[d.Year] = {};
        }
        
        if (d.GEO in data[d.Year]){

            var variables = {};
            variables.country = d.C_RESID;
            variables.count = d.Average;

            // add to the dataframe
            data[d.Year][d.GEO].incoming.push(variables);

        }
        else {

            data[d.Year][d.GEO] = {};
            data[d.Year][d.GEO].incoming = [];

            var variables = {};
            variables.country = d.C_RESID;
            variables.count = d.Average;

            // add to the dataframe
            data[d.Year][d.GEO].incoming.push(variables);
        }      
    })

    // add outgoing data
    Object.values(outgoing).forEach(function(d){
        if (d.TIME < 2019){
            if (d.GEO in data[d.TIME]){
                if (d.PARTNER == "Domestic"){
                    if (!("outgoing" in data[d.TIME][d.GEO])){
                        data[d.TIME][d.GEO].outgoing = [];
                    }
                    
                    var variables = {};
                    variables.country = d.PARTNER;
                    variables.count = d.Value;

                    data[d.TIME][d.GEO].outgoing.push(variables);
                }
                else if (d.PARTNER == "Outbound") {

                    var variables = {};
                    variables.country = d.PARTNER;
                    variables.count = d.Value;

                    data[d.TIME][d.GEO].outgoing.push(variables);

                }
            }
        }
    })
    return data;
}

function piechart(data, country, year){

	var width = 400;
    var height = 300;
    var radius = Math.min(width, height) / 2 - 40;

    var svg = d3v5.select("#pie-area")
        .append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")
        .attr("class", "pie_area")
            .attr("transform", `translate(${width / 2 - 80}, ${height / 2 + 10})`);

    var color = d3v5.scaleOrdinal().domain(function(d){return d.country})
        .range(["#cccccc", "#faebd7"]);

    var pie = d3v5.pie()
        .value(d => d.count)
        .sort(null);

    var arc = d3v5.arc()
        .innerRadius(0)
        .outerRadius(radius);

    function type(d) {
        d.incoming = Number(d.incoming);
        d.outgoing = Number(d.outgoing);
        return d;
    }

    function arcTween(a) {
        const i = d3v5.interpolate(this._current, a);
        this._current = i(1);
        return (t) => arc(i(t));
    }

    // add Tooltip
    var tooltip = svg.append("foreignObject")
    .attr("width", 200)
    .attr("height", 60)
    .style("class", "tooltip")

    // set pie to default value
    update_pie(data, year, country)

}


function update_pie(data, year, country) {
    
    const width = 400;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 40;
    
    // set legend dimensions
    var legendRectSize = 25
    var legendSpacing = 3

    const color = d3v5.scaleOrdinal().domain(function(d){return d.country})
        .range(["#cccccc", "#faebd7"])

    const pie = d3v5.pie()
        .value(d => d.count)
        .sort(null);

    const arc = d3v5.arc()
        .innerRadius(0)
        .outerRadius(radius);

    function type(d) {
        d.incoming = Number(d.incoming);
        d.outgoing = Number(d.outgoing);
        return d;
    }

    function arcTween(a) {
        const i = d3v5.interpolate(this._current, a);
        this._current = i(1);
        return (t) => arc(i(t));
    }

    data = data[year][country]

    data_default = data["incoming"]

    // set svg
    var svg = d3v5.select(".pie_area")

    // set transition
    var t = d3v5.transition().duration(200)

    // join piedata
    var pie_parts = svg.selectAll(".pie_parts")
        .data(pie(data_default))

    pie_parts
        .transition(t)
        .attrTween("d", arcTween)

    // exit remove
    pie_parts.exit()
        .remove()
        .transition(t)
        .attrTween("d", arcTween)

    // ENTER
    pie_parts.enter().append("path")
        .attr("class", "pie_parts")
        .on("mouseover", function(d, i) {
            tooltip.style("display", null);

            // set stroke
            d3v5.select(this)
                .attr("stroke", "#272626")
                .attr("stroke-width", 4)
                .attr("d", arc)
        })
        .on("mousemove", function(d){

            var count = Math.round(d.data.count)

            var x_pos = d3v5.mouse(this)[0] - 61
            var y_pos = d3v5.mouse(this)[1] - 61

            var html = "<span><b>" + d.data.country + "</b>: " +  count + "</span>"

            tooltip
                .attr("transform", "translate(" + x_pos + "," + y_pos + ")")
                .html(html)
                .style("font-size", "10px")

        })
        .on("mouseout", function(d, i) {

            tooltip.style("display", "none");

            d3v5.select(this).attr("stroke", "none")
            .attr("d", arc)
        })
        .attr("fill", (d, i) => color(i))
        .attr("d", arc)
        .attr("stroke", "white")
        .attr("stroke-width", "0.5px")
        .merge(pie_parts)
        .transition(t)
        .each(function(d){this._current = d;});

    pie_parts.transition(t).attrTween("d", arcTween)

    // Add Tooltip
    var tooltip = svg.append("foreignObject")
    .attr("width", 200)
    .attr("height", 60)
    .style("class", "tooltip");  

    // set the radio boxes to incoming checked and outgoing not checked
    d3v5.select("#incoming").property("checked", true)
    d3v5.select("#outgoing").property("checked", false) 


    // set interactive part
    d3v5.selectAll("input")
        .on("change", interactive_pie);

    function interactive_pie(val = this.value) {

        // Join new data
        const path = svg.selectAll("path")
            .data(pie(data[val]));

        // Update existing arcs
        path.transition().duration(200)
            .attrTween("d", arcTween);

        path.exit()
            .remove()
            .transition().duration(200)
            .attrTween("d", arcTween);

        // Enter new arcs
        path.enter().append("path")
            .attr("class", "pie-parts")
            .on("mouseover", function(d, i) {
                tooltip.style("display", null);

                // set stroke
                d3v5.select(this)
                    .attr("stroke", "#272626")
                    .attr("stroke-width", 4)
                    .attr("d", arc);
            })
            .on("mousemove", function(d){
                    
                var count = Math.round(d.data.count)

                var x_pos = d3v5.mouse(this)[0] - 61;
                var y_pos = d3v5.mouse(this)[1] - 61;
                  
                var html = "<span><b>" + d.data.country + "</b>: " +  count + "</span>";
                  
                tooltip
                    .attr("transform", "translate(" + x_pos + "," + y_pos + ")")
                    .html(html)
                    .style("font-size", "10px");

            })
            .on("mouseout", function(d, i) {

                tooltip.style("display", "none");

                d3v5.select(this)
                    .attr("stroke", "none")
                    .attr("d", arc);
            })
            .attr("fill", (d, i) => color(i))
            .attr("d", arc)
            .attr("stroke", "white")
            .attr("stroke-width", "0.5px")
            .each(function(d) { this._current = d; });

    }
}




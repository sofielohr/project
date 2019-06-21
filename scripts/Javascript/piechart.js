// Sofie Löhr, 11038926

function piechart_data(outgoing, incoming){

    var data = {}
    var years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'];

    // go over all the countries
    Object.values(incoming).forEach(function(d){

        // check if right year and make objects
        if (!(d.Year in data)){


            data[d.Year] = {}
        }
        
        if (d.GEO in data[d.Year]){

            var variables = {}
            variables.country = d.C_RESID
            variables.count = d.Average

            // add to the dataframe
            data[d.Year][d.GEO].incoming.push(variables)

        }
        else {

            data[d.Year][d.GEO] = {}
            data[d.Year][d.GEO].incoming = []

            var variables = {}
            variables.country = d.C_RESID
            variables.count = d.Average

            // add to the dataframe
            data[d.Year][d.GEO].incoming.push(variables)
        }      
    })

    // add outgoing data
    Object.values(outgoing).forEach(function(d){
        if (d.TIME < 2019){
            if (d.GEO in data[d.TIME]){
                if (d.PARTNER == "Domestic"){  
                    if (!("outgoing" in data[d.TIME][d.GEO])){
                        data[d.TIME][d.GEO].outgoing = []
                    }
                    
                    var variables = {}
                    variables.country = d.PARTNER
                    variables.count = d.Value
                    
                    data[d.TIME][d.GEO].outgoing.push(variables)
                }
                else if (d.PARTNER == "Outbound") {

                    var variables = {}
                    variables.country = d.PARTNER
                    variables.count = d.Value

                    data[d.TIME][d.GEO].outgoing.push(variables)
                }
            }
        }
        // console.log(data[d.TIME][d.GEO].outgoing)
    })
    return data

}

function piechart(data, country, year){
    data = data[year][country]

	const width = 400;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3v5.select("#pie-area")
        .append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")
            .attr("transform", `translate(${width / 2 - 80}, ${height / 2 + 10})`);

    const color = d3v5.scaleOrdinal().domain(function(d){console.log(d); return d.country})
        .range(["#383645", "#faebd7"])

    const pie = d3v5.pie()
        .value(d => d.count)
        .sort(null);

    const arc = d3v5.arc()
        .innerRadius(0)
        .outerRadius(radius);

    function type(d) {
        d.apples = Number(d.incoming);
        d.oranges = Number(d.outgoing);
        return d;
    }

    function arcTween(a) {
        const i = d3v5.interpolate(this._current, a);
        this._current = i(1);
        return (t) => arc(i(t));
    }
  
    d3v5.selectAll("input")
        .on("change", interactive_pie);

    function interactive_pie(val = this.value) {
        // Join new data
        const path = svg.selectAll("path")
            .data(pie(data[val]));

        // Update existing arcs
        path.transition().duration(200).attrTween("d", arcTween);

        // Enter new arcs
        path.enter().append("path")
            .attr("fill", (d, i) => color(i))
            .attr("d", arc)
            .attr("stroke", "white")
            .attr("stroke-width", "0.5px")
            .each(function(d) { this._current = d; });
    }

    interactive_pie("incoming");

    // set legend dimensions
    var legendRectSize = 25
    var legendSpacing = 3


    // legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d,i){
            var height = legendRectSize + legendSpacing
            var offset = height * color.domain().length / 2
            var horz = 5 * legendRectSize
            var vert = i * height - offset
            return "translate(" + horz + "," + (vert - 16) + ")";
        })

    legend.append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .style("fill", color)
        .style("stroke", color)
    
    // legend.append("text")
    //     .data(input)
    //     .attr("x", legendRectSize + 2 * legendSpacing)
    //     .attr("y", legendRectSize - 2 * legendSpacing)
    //     .text(function(d){ return d.label; })

	// // legend
	// var legend = svg1.selectAll(".legend")
	// 	.data(colorScale.domain())
	// 	.enter()
	// 	.append("g")
	// 	.attr("class", "legend")
	// 	.attr("transform", function(d,i){
	// 		var height = legendRectSize + legendSpacing
	// 		var offset = height * colorScale.domain().length / 2
	// 		var horz = 5 * legendRectSize
	// 		var vert = i * height - offset
	// 		return "translate(" + horz + "," + (vert - 16) + ")";
	// 	})

	// legend.append("rect")
	// 	.attr("width", legendRectSize)
	// 	.attr("height", legendRectSize)
	// 	.style("fill", colorScale)
	// 	.style("stroke", colorScale)
	
	// legend.append("text")
	// 	.data(input)
	// 	.attr("x", legendRectSize + 2 * legendSpacing)
	// 	.attr("y", legendRectSize - 2 * legendSpacing)
	// 	.text(function(d){ return d.label; })

}
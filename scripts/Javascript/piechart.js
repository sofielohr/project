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
    
    // set legend dimensions
    var legendRectSize = 25
    var legendSpacing = 3

    var svg = d3v5.select("#pie-area")
        .append("svg")
            // .attr("class", "pie_area")
            .attr("width", width)
            .attr("height", height)
        .append("g")
        .attr("class", "pie_area")
            .attr("transform", `translate(${width / 2 - 80}, ${height / 2 + 10})`);

    const color = d3v5.scaleOrdinal().domain(function(d){return d.country})
        .range(["#383645", "#faebd7"])

    const pie = d3v5.pie()
        .value(d => d.count)
        .sort(null);

    const arc = d3v5.arc()
        .innerRadius(0)
        .outerRadius(radius);

    var legend = svg.selectAll(".legend")
        .data(color.domain())

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
  
    d3v5.selectAll("input")
        .on("change", interactive_pie);

    function interactive_pie(val = this.value) {
         console.log(data[val])

        // Add Tooltip
       var tooltip = svg.append("g")

       tooltip.append("text")
          .style("class", "tooltip")

        // Join new data
        const path = svg.selectAll("path")
            .data(pie(data[val]));

        var legend = d3v5.select(".legend")
            .data(color.domain())


        // exit legend
        legend.exit()
            .attr("class", "exit")
            .transition().duration(200)
            .remove()

        // Update existing arcs
        path.transition().duration(200).attrTween("d", arcTween);

        path.exit().remove().transition().duration(200).attrTween("d", arcTween)

        legend.attr("class", "update")
            .transition().duration(200)

        // Enter new arcs
        path.enter().append("path")
            .attr("class", "pie-parts")
            .on("mouseover", function(d, i) {
                  tooltip.style("display", null);

                  d3v5.select(this)
                    .attr("stroke", '#272626')
                    .attr("stroke-width", 4)
                    .attr("d", arc)
                })
                .on("mousemove", function(d){
                  var x_pos = d3v5.mouse(this)[0] - 25
                  var y_pos = d3v5.mouse(this)[1] - 15
                  tooltip.attr("transform", "translate(" + x_pos + "," + y_pos + ")")
                  tooltip.select("text").text(d.data.country)
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
            .each(function(d) { console.log(d); this._current = d; });

        legend.enter()
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
        
        legend.append("text")
                .data(data[val])
                .attr("id", "pie-legend")
                .attr("x", legendRectSize + 2 * legendSpacing)
                .attr("y", legendRectSize - 2 * legendSpacing)
                .text(function(d){ return d.country; })


        // Enter new legend text
        // var text = svg.select(".legend")
        //     .data(data[val])

        // text.exit()
        //     .transition().duration(200)
        //     .attr("opacity", 1e-6)
        //     .remove()

        // text.transition().duration(200)
        //         .attr("x", legendRectSize + 2 * legendSpacing)
        //         .attr("y", legendRectSize - 2 * legendSpacing)
        
        // text.enter().append("text")
        //     .attr("opacity", 1e-6)
        //     .attr("x", legendRectSize + 2 * legendSpacing)
        //         .attr("y", legendRectSize - 2 * legendSpacing)
        //         .text(function(d){ console.log(d); return d.country; })



    }

    interactive_pie("incoming");
}


function update_pie(data, year, country) {
    const width = 400;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 40;
    
    // set legend dimensions
    var legendRectSize = 25
    var legendSpacing = 3

    const color = d3v5.scaleOrdinal().domain(function(d){return d.country})
        .range(["#383645", "#faebd7"])

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

    var inc = d3v5.select("#incoming").checked=true
    var outg = d3v5.select("#outgoing").checked=false

    data = data[year][country]["incoming"]

    var svg = d3v5.select(".pie_area")

    var t = d3v5.transition().duration(200)

    // JOIN
    var pie_parts = svg.selectAll(".pie_parts")
        .data(pie(data))

    pie_parts.transition(t).attrTween("d", arcTween)

    pie_parts.exit().remove().transition(t).attrTween("d", arcTween)

  // ENTER
  pie_parts.enter().append("path")
    .attr("class", "pie_parts")
    .on("mouseover", function(d, i) {
          tooltip.style("display", null);

          d3v5.select(this)
            .attr("stroke", '#272626')
            .attr("stroke-width", 4)
            .attr("d", arc)
        })
        .on("mousemove", function(d){
          var x_pos = d3v5.mouse(this)[0] - 25
          var y_pos = d3v5.mouse(this)[1] - 15
          tooltip.attr("transform", "translate(" + x_pos + "," + y_pos + ")")
          tooltip.select("text").text(d.data.country)
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
    // .merge(pie_parts)
    .transition(t)
    .each(function(d){ console.log(d);this._current = d;});

    pie_parts.transition(t).attrTween("d", arcTween)    
}




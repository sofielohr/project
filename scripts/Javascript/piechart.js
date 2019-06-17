// Sofie Löhr, 11038926

// function piechart_data(data){
	
// }

function piechart(){
	const width = 540;
    const height = 540;
    const radius = Math.min(width, height) / 2;

    const svg = d3v5.select("#pie")
        .append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3v5.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
         "#e78ac3","#a6d854","#ffd92f"]);

    const pie = d3v5.pie()
        .value(d => d.count)
        .sort(null);

    const arc = d3v5.arc()
        .innerRadius(0)
        .outerRadius(radius);

    function type(d) {
        d.apples = Number(d.apples);
        d.oranges = Number(d.oranges);
        return d;
    }

    function arcTween(a) {
        const i = d3v5.interpolate(this._current, a);
        this._current = i(1);
        return (t) => arc(i(t));
    }
  
    d3v5.json("data.json", type).then(data => {  
        d3v5.selectAll("input")
            .on("change", update);

        function update(val = this.value) {
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
                .attr("stroke-width", "6px")
                .each(function(d) { this._current = d; });
        }

        update("apples");
    });

	// legend
	var legend = svg1.selectAll(".legend")
		.data(colorScale.domain())
		.enter()
		.append("g")
		.attr("class", "legend")
		.attr("transform", function(d,i){
			var height = legendRectSize + legendSpacing
			var offset = height * colorScale.domain().length / 2
			var horz = 5 * legendRectSize
			var vert = i * height - offset
			return "translate(" + horz + "," + (vert - 16) + ")";
		})

	legend.append("rect")
		.attr("width", legendRectSize)
		.attr("height", legendRectSize)
		.style("fill", colorScale)
		.style("stroke", colorScale)
	
	legend.append("text")
		.data(input)
		.attr("x", legendRectSize + 2 * legendSpacing)
		.attr("y", legendRectSize - 2 * legendSpacing)
		.text(function(d){ return d.label; })

}
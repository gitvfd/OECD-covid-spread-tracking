function smallMultiples(data) {
    
    var minAxis = 1;
    var parseDate = d3.timeParse("%Y-%m-%d")
    var formatDate = d3.timeFormat("%Y-%m-%d")

    // set the dimensions and margins of the graph
    var marginSmall = { top: 30, right: 0, bottom: 30, left: 50 },
        widthSmall = 210 - marginSmall.left - marginSmall.right,
        heightSmall = 210 - marginSmall.top - marginSmall.bottom;

        // group the data: I want to draw one line per group

        var nested = d3.nest()
            .key(k => k.Country)
            .entries(data);

        // What is the list of groups?
        allKeys = nested.map(function (d) { return d.key })

        // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
        var svg = d3.select("#small-multiples")
            .selectAll("uniqueChart")
            .data(nested)
            .enter()
            .append("svg")
            .attr("width", widthSmall + marginSmall.left + marginSmall.right)
            .attr("height", heightSmall + marginSmall.top + marginSmall.bottom)
            .append("g")
            .attr("transform",
                "translate(" + marginSmall.left + "," + marginSmall.top + ")");

        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
            .domain(d3.extent(data, function (d) { return parseDate(d.date); }))
            .range([0, widthSmall]);
        svg
            .append("g")
            .attr("transform", "translate(0," + heightSmall + ")")
            .call(d3.axisBottom(x).ticks(2)
                .tickFormat(d3.timeFormat("%Y-%m-%d")));

        //Add Y axis
        var y = d3.scaleLinear() //or scaleLog
            .domain([minAxis, d3.max(data, function (d) { return parseFloat(d.cum); })])
            .range([heightSmall, 0]);
        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(function (d) {
                return y.tickFormat(5, d3.format(",d"))(d)
            }));

        // color palette
        /**var color = d3.scaleOrdinal()
            .domain(allKeys)
            .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])**/

        // Draw the line
        svg
            .append("path")
            .attr("fill", "none")
            .attr("stroke", function (d) { return /*color(d.key)*/"#8DCD79" })
            .attr("stroke-width", 1.9)
            .attr("class","areaCou")
            .attr("id", function (d) { return d.key.split(' ').join('').replace("*", "").replace("\''", "").replace("-", "").replace("(", "").replace(")", "") + "area";})
            .attr("d", function (d) {
                return d3.area()
                    .x(function (d) { return x(parseDate(d.date)); })
                    .y0(y(minAxis))
                    .y1(function (d) { return y(parseFloat(d.cum)); })
                    (d.values)
            })

        // Add titles
        svg
            .append("text")
            .attr("text-anchor", "start")
            .attr("y", -5)
            .attr("x", 0)
            .attr("class", "countryName")
            .text(function (d) { return (d.key) })
            //.style("fill", function (d) { return /*color(d.key)*/"#123123" })

  

}
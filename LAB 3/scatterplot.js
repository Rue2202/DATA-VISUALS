// JavaScript code for scatter plot with X and Y axes

function init() {
    var w = 1000;
    var h = 500;
    var padding = 30;

    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    var dataset = [
        [2, 8],
        [3, 5],
        [5, 17],
        [6, 6],
        [6, 12],
        [7, 20],
        [8, 22],
        [10, 11],
        [5, 12],
        [6, 16]
    ];

    // xScale maps the x values to fit within the width
    var xScale = d3.scaleLinear()
                        .domain([d3.min(dataset, function(d)
                         { 
                            return d[0]; 
                        }),
                        d3.max(dataset, function(d) 
                                 { 
                                    return d[0]; 
                                })])
                        .range([padding, w - padding]);

    // yScale maps the y values to fit within the height, inverted
    var yScale = d3.scaleLinear()
                        .domain([d3.min(dataset, function(d) 
                        {
                             return d[1]; 
                        }),
                                 d3.max(dataset, function(d) 
                        { 
                            return d[1]; 
                        })])
                        .range([h - padding, padding]); // Reversed Y-axis
                       

    // Create circles for each data point
    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d[0]); })
        .attr("cy", function (d) { return yScale(d[1]); })
        .attr("r", 8)
        .attr("fill", "pink");

    // Add text labels to the data points
    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function (d) { return d[0] + "," + d[1]; })
        .attr("x", function (d) { return xScale(d[0]) + 10; }) // Offset for better readability
        .attr("y", function (d) { return yScale(d[1]); })
        .attr("font-size", "12px")
        .attr("fill", "black");

    // Create X-axis
    var xAxis = d3.axisBottom(xScale).ticks(5);

    // Append X-axis to the SVG
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (h - padding) + ")") // Move to bottom
        .call(xAxis);

         // Add X-axis label
         svg.append("text")
         .attr("text-anchor", "end")
         .attr("x", w / 2)
         .attr("y", h - 5.3)  // Position below the axis
         .text("Tree Age (year)")
         .attr("font-size", "14px");

    // Create Y-axis
    var yAxis = d3.axisLeft(yScale).ticks(5);

    // Append Y-axis to the SVG
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding + ",0)") // Move to left
        .call(yAxis);

        // Add Y-axis label
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", -h / 2.5)  // Rotate for vertical label
        .attr("y", 12)
        .attr("transform", "rotate(-90)")
        .text("Tree Height (m)")
        .attr("font-size", "14px");
}

window.onload = init;

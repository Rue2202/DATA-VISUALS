
            // Set up the width, height, and padding for the chart area
            var w = 600; // Width of the chart
            var h = 200; // Height of the chart
            var barPadding = 30; // Padding in between the bars

            // Dataset of the bars
            var dataset = [24, 10, 29, 19, 8, 15, 20, 12, 9, 6, 21, 28];

            // Set up the x-axis scale to evenly divide the bars
            var xScale = d3.scaleBand() // Use scaleBand for evenly spaced bars
                          .domain(d3.range(dataset.length)) // Set domain as the index range of dataset
                          .range([0, w]) // Map the domain to the width of the chart
                          .paddingInner(0.05); // Add padding between bars

            // Set up the y-axis scale to adjust the bar height according to the dataset
            var yScale = d3.scaleLinear() // Use Linear scale for continuous values
                           .domain([0, d3.max(dataset)]) // Sets domain range from 0 to max value in dataset
                           .range([h, 0]); // Invert the y-axis so higher values are on top

            // SVG Element for chart area to add to chart div
            var svg = d3.select("#chart") // Select the bar chart div
                        .append("svg") // Add an SVG element
                        .attr("width", w + barPadding * 2) // Sets the total width + padding
                        .attr("height", h + barPadding * 2) // Sets the total height + padding
                        .append("g") // Group the chart for positioning
                        .attr("transform", "translate(" + barPadding + "," + barPadding + ")"); // Move the content by the padding
             
              // Function to draw or update bars and labels
        function drawBars() {
            // Bind data to the bars
            var bars = svg.selectAll("rect")
                .data(dataset, function(d, i) { return i; });

            // Enter new bars
            bars.enter()
                .append("rect")
                .attr("x", w) // Start off-screen to the right
                .attr("y", function(d) { return yScale(d); }) // y position based on data
                .attr("width", xScale.bandwidth())
                .attr("height", function(d) { return h - yScale(d); })
                .attr("fill", "pink")
                .merge(bars) // Merge new and existing bars
                .transition() // Animate the changes
                .duration(500)
                .attr("x", function(d, i) { return xScale(i); }) // Move to the correct x position
                .attr("y", function(d) { return yScale(d); }) // Adjust y based on data
                .attr("height", function(d) { return h - yScale(d); }); // Adjust height

                // Exit old bars
            bars.exit()
                .transition()
                .duration(500)
                .attr("x", w) // Move old bars off-screen to the right
                .remove(); // Remove old bars 

            // Bind data to the text labels
            var labels = svg.selectAll("text")
                .data(dataset, function(d, i) { return i; });


            // Add text labels for each bar
             labels.enter()
                .append("text")
                .attr("x", w) // Start off-screen to the right
                .attr("y", function(d) { return yScale(d) - 5; }) // Position text just above the bar
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .text(function(d) { return d; })
                .merge(labels) // Merge new and existing text labels
                .transition()
                .duration(500)
                .attr("x", function(d, i) { return xScale(i) + xScale.bandwidth() / 2; }) // Adjust x position for text
                .attr("y", function(d) { return yScale(d) - 5; }); // Adjust y position for text

              // Exit old text labels
            labels.exit()
                .transition()
                .duration(500)
                .attr("x", w) // Move old text labels off-screen
                .remove();
        }
             // Initial draw
        drawBars();

// Add Data button functionality
d3.select("#addButton").on("click", function() {
    var newNumber = Math.floor(Math.random() * 25); // Generate a random number
    dataset.push(newNumber); // Add the new number to the dataset

    // Update xScale domain to account for the new data
    xScale.domain(d3.range(dataset.length));

    // Re-draw the bars and labels with updated dataset
    drawBars();
});

// Remove Data button functionality
d3.select("#removeButton").on("click", function() {
    if (dataset.length > 0) {
        dataset.shift(); // Remove the first element of the dataset

        // Update xScale domain after removing data
        xScale.domain(d3.range(dataset.length));

        // Re-draw the bars and labels with updated dataset
        drawBars();
    }
});     
        

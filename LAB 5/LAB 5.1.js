
          // To set the width, height, and padding for the chart area
            var w = 500; // Width of the chart
            var h = 200; // Height of the chart
            var barPadding = 20; // Padding around the chart

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
             
            // Create the bars for the chart
            svg.selectAll("rect") // Select all the rect elements
            .data(dataset) // Bind the data to the bars
            .enter() // A placeholder for each data item
            .append("rect") // Append a rectangle for each data point
            .attr("x", function(d, i) { return xScale(i); }) // Position the bar using xScale
            .attr("y", function(d) { return yScale(d); }) // Set the top of the bar based on yScale
            .attr("width", xScale.bandwidth()) // Set the width for each bar
            .attr("height", function(d) { return h - yScale(d); }) // Set the height based on the data
            .attr("fill", "pink"); // Set bar color

            // Add text labels for each bar
            svg.selectAll("text") // Select text elements
            .data(dataset) // Bind dataset to text element
            .enter() // A placeholder for each data item
            .append("text") // Add text for each data item
            .text(function(d) { return d; }) // Display data value
            .attr("x", function(d, i) { return xScale(i) + xScale.bandwidth() / 2; }) // Center the text on each bar
            .attr("y", function(d) { return yScale(d) - 5; }) // Position the text just above the bar
            .attr("text-anchor", "middle") // Center the text horizontally
            .attr("fill", "black"); // Set text color

            // Function updateData to generate new random data and update the bar chart
            function updateData() {
              // Generate new random dataset
              dataset = [];
              var maxValue = 25; // Maximum value for random data
              var numValues = 12; // The number of bars
              for (var i = 0; i < numValues; i++) {
                  var newNumber = Math.floor(Math.random() * maxValue); // Generate random numbers
                  dataset.push(newNumber); // Add the new number to the dataset
              }

              // Update the yScale domain with the new max value
              yScale.domain([0, d3.max(dataset)]); // Updates the scale based on random new dataset

              // Update the bars with new data
              svg.selectAll("rect") // Select all existing bars
                   .data(dataset) // Bind the new data
                   .transition() // Animate the changes
                   .duration(500) // Set the duration for the animation
                   .attr("y", function(d) { return yScale(d); }) // Update the y position
                   .attr("height", function(d) { return h - yScale(d); }); // Update the height of the bars
              
              // Update the text labels with new data
              svg.selectAll("text") // Select all existing text labels
                .data(dataset) // Bind the new data
                .transition() // Animate changes in the bar chart
                .duration(500) // Set the duration for the animation
                .text(function(d) { return d; }) // Update the text content
                .attr("x", function(d, i) { return xScale(i) + xScale.bandwidth() / 2; }) // Adjust the x position
                .attr("y", function(d) { return yScale(d) - 5; }); // Adjust the y position
            }
            
          // Add event listener to the button to update the data when clicked
          d3.select("#updateButton") // Select the button by its ID
              .on("click", updateData); // Call updateData when the button is clicked
        
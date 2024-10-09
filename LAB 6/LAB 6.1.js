// Set chart dimensions and padding
var w = 600;
var h = 200;
var barPadding = 30;
var dataset = [24, 10, 29, 19, 8, 15, 20, 12, 9, 6, 21, 28]; // Initial dataset

// Set up the x-axis scale
var xScale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    .range([0, w])
    .paddingInner(0.1);

// Set up the y-axis scale
var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([h, 0]);

// Create an SVG element and add it to the chart div
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", w + barPadding * 2)
    .attr("height", h + barPadding * 2)
    .append("g")
    .attr("transform", "translate(" + barPadding + "," + barPadding + ")");

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
        .on("mouseover", handleMouseOver) // Add mouseover event
        .on("mouseout", handleMouseOut)   // Add mouseout event
        .merge(bars) // Merge new and existing bars
        .transition() // Animate the changes
        .duration(500)
        .attr("x", function(d, i) { return xScale(i); }) // Move to the correct x position
        .attr("y", function(d) { return yScale(d); }) // Adjust y based on data
        .attr("height", function(d) { return h - yScale(d); });

    // Exit old bars
    bars.exit()
        .transition()
        .duration(500)
        .attr("x", w) // Move old bars off-screen to the right
        .remove(); // Remove old bars from the DOM

    // Bind data to the text labels
    var labels = svg.selectAll("text.bar-label")
        .data(dataset, function(d, i) { return i; });

    // Enter new text labels
    labels.enter()
        .append("text")
        .attr("class", "bar-label")  // Add class to text label for consistent styling
        .attr("x", w) // Start off-screen to the right
        .attr("y", function(d) { return yScale(d) - 5; }) // Position text just above the bar
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text(function(d) { return d; })
        .merge(labels) // Merge new and existing text labels
        .transition()
        .duration(500)
        .attr("x", function(d, i) { return xScale(i) + xScale.bandwidth() / 2; }) // Adjust x position for text (centered)
        .attr("y", function(d) { return yScale(d) - 5; }); // Adjust y position for text

    // Exit old text labels
    labels.exit()
        .transition()
        .duration(500)
        .attr("x", w) // Move old text labels off-screen
        .remove();
}

// Mouseover handler to change the bar color and display tooltip
function handleMouseOver(event, d) {
    d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", "orange"); // Change bar color to orange on hover

    // Add tooltip (SVG-based)
    svg.append("text")
        .attr("class", "tooltip")  // Class for consistent styling
        .attr("x", parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2)
        .attr("y", yScale(d) - 5.5) //adjust hovered labels
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "14px")  // Set the same font size as bar labels for consistency
        .text(d);
}

// Mouseout handler to reset the bar color and remove tooltip
function handleMouseOut(event, d) {
    d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", "pink"); // Reset bar color

    // Remove the tooltip
    svg.selectAll(".tooltip").remove();
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

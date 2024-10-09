// Set chart dimensions and padding
var w = 600;             // Width of the chart
var h = 200;             // Height of the chart
var barPadding = 30;     // Padding between bars and the chart
var dataset = [24, 10, 29, 19, 8, 15, 20, 12, 9, 6, 21, 28];  // Initial dataset
var ascending = true;    // Flag to toggle between ascending and descending sort

// Set up the x-axis scale
var xScale = d3.scaleBand()  // Using scaleBand to handle categorical x-axis values
    .domain(d3.range(dataset.length))  // Set domain as the index range of the dataset
    .range([0, w])  // Map the domain to the full width of the chart
    .paddingInner(0.1);  // Add spacing between the bars

// Set up the y-axis scale
var yScale = d3.scaleLinear()  // Using scaleLinear to handle numerical y-axis values
    .domain([0, d3.max(dataset)])  // Domain from 0 to the maximum value in the dataset
    .range([h, 0]);  // Invert the y-axis so higher values are on top

// Create an SVG element and add it to the chart div
var svg = d3.select("#chart")  // Select the div with id 'chart'
    .append("svg")  // Create an SVG element
    .attr("width", w + barPadding * 2)  // Set the width of the SVG (chart width + padding)
    .attr("height", h + barPadding * 2)  // Set the height of the SVG (chart height + padding)
    .append("g")  // Create a 'g' element inside the SVG to group the bars
    .attr("transform", "translate(" + barPadding + "," + barPadding + ")");  // Move the group down and right by padding

// Function to draw or update bars and labels
function drawBars() {
    // Bind data to the bars
    var bars = svg.selectAll("rect")  // Select all 'rect' elements (the bars)
        .data(dataset, function(d, i) { return i; });  // Bind the dataset to the bars

    // Enter new bars if required
    bars.enter()
        .append("rect")  // Add a 'rect' for each new data point
        .attr("x", w)  // Start new bars off-screen to the right
        .attr("y", function(d) { return yScale(d); })  // Set the y position based on the data
        .attr("width", xScale.bandwidth())  // Set the width of the bar based on the xScale
        .attr("height", function(d) { return h - yScale(d); })  // Calculate the height of the bar
        .attr("fill", "pink")  // Set the color of the bar
        .on("mouseover", handleMouseOver)  // Add mouseover effect to the bar
        .on("mouseout", handleMouseOut)  // Add mouseout effect to the bar
        .merge(bars)  // Merge new and existing bars for updating
        .transition()  // Apply transition for smooth updates
        .duration(500)  // Duration of the transition (500ms)
        .attr("x", function(d, i) { return xScale(i); })  // Set the x position of the bar
        .attr("y", function(d) { return yScale(d); })  // Update y position based on data
        .attr("height", function(d) { return h - yScale(d); });  // Update height based on data

    // Remove any old bars that no longer have data
    bars.exit()
        .transition()  // Apply transition before removing
        .duration(500)  // Duration of the transition
        .attr("x", w)  // Move old bars off-screen to the right
        .remove();  // Remove the old bars

    // Bind data to the text labels
    var labels = svg.selectAll("text.bar-label")  // Select all text labels for the bars
        .data(dataset, function(d, i) { return i; });  // Bind the dataset to the labels

    // Enter new text labels if required
    labels.enter()
        .append("text")  // Add a 'text' element for each new data point
        .attr("class", "bar-label")  // Add a class for styling
        .attr("x", w)  // Start text labels off-screen to the right
        .attr("y", function(d) { return yScale(d) - 5; })  // Position text above the bar
        .attr("text-anchor", "middle")  // Center the text
        .attr("fill", "black")  // Set the text color to black
        .text(function(d) { return d; })  // Set the text content to the data value
        .merge(labels)  // Merge new and existing text labels for updating
        .transition()  // Apply transition for smooth updates
        .duration(500)  // Duration of the transition
        .attr("x", function(d, i) { return xScale(i) + xScale.bandwidth() / 2; })  // Center the text on the bar
        .attr("y", function(d) { return yScale(d) - 5; });  // Adjust the y position of the text

    // Remove old text labels that no longer have data
    labels.exit()
        .transition()  // Apply transition before removing
        .duration(500)  // Duration of the transition
        .attr("x", w)  // Move old text labels off-screen to the right
        .remove();  // Remove the old text labels
}

// Mouseover handler to change the bar color and display tooltip
function handleMouseOver(event, d) {
    d3.select(this)
        .transition()
        .duration(200)  // Transition duration
        .attr("fill", "orange");  // Change bar color to orange

    // Add tooltip (text) to show the value
    svg.append("text")  // Append a 'text' element for the tooltip
        .attr("class", "tooltip")  // Add a class for styling
        .attr("x", parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2)  // Center the tooltip on the bar
        .attr("y", yScale(d) - 5.5)  // Position tooltip slightly above the bar
        .attr("text-anchor", "middle")  // Center the text
        .attr("fill", "black")  // Set tooltip text color
        .attr("font-size", "14px")  // Set the font size
        .text(d);  // Display the data value
}

// Mouseout handler to reset the bar color and remove tooltip
function handleMouseOut(event, d) {
    d3.select(this)
        .transition()
        .duration(200)  // Transition duration
        .attr("fill", "pink");  // Reset the bar color to pink

    // Remove the tooltip
    svg.selectAll(".tooltip").remove();  // Remove all elements with the class 'tooltip'
}

// Initial draw of the bars and labels
drawBars();

// Add Data button functionality
d3.select("#addButton").on("click", function() {
    var newNumber = Math.floor(Math.random() * 25);  // Generate a random number
    dataset.push(newNumber);  // Add the new number to the dataset

    // Update xScale domain to account for the new data
    xScale.domain(d3.range(dataset.length));

    // Re-draw the bars and labels with updated dataset
    drawBars();
});

// Remove Data button functionality
d3.select("#removeButton").on("click", function() {
    if (dataset.length > 0) {
        dataset.shift();  // Remove the first element of the dataset

        // Update xScale domain after removing data
        xScale.domain(d3.range(dataset.length));

        // Re-draw the bars and labels with updated dataset
        drawBars();
    }
});

// Sort Data button functionality
d3.select("#sortButton").on("click", function() {
    // Sort the dataset based on the current state (ascending or descending)
    dataset.sort(ascending ? d3.ascending : d3.descending);

    // Update the xScale domain to map the sorted dataset
    xScale.domain(d3.range(dataset.length));

    // Redraw bars and labels with sorted data
    var bars = svg.selectAll("rect")  // Select all bars
        .data(dataset, function(d) { return d; });

    // Apply transition for sorted bars
    bars.transition()
        .duration(1000)  // Set transition duration to 1 second
        .attr("x", function(d, i) { return xScale(i); });  // Update x position for sorted bars

    // Apply transition for sorted text labels
    var labels = svg.selectAll("text.bar-label")
        .data(dataset, function(d) { return d; });

    labels.transition()
        .duration(1000)  // Set transition duration to 1 second
        .attr("x", function(d, i) { return xScale(i) + xScale.bandwidth() / 2; });  //
 // Toggle the sort direction for the next click
 ascending = !ascending;
});
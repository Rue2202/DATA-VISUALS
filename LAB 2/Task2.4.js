function init()
{
    //to read data from csv file
    d3.csv("Task_2.4_data.csv").then(function(data)
{
    console.log(data);
    wombatSightings=data;

    barChart(wombatSightings);
})

var w = 500;
var h = 150;
var barPadding=3;


//D3 block

var svg = d3.select("#chart")
            .append("svg")
            .attr("width",w)
            .attr("height",h);

function barChart(wombatSightings)
  {
    svg.selectAll("rect")
            .data(wombatSightings)
            .enter()
            .append("rect")
            // X & Y coordinates
            .attr("x",function(d, i)
            {
                return i * (w/wombatSightings.length);
            })
            .attr("y",function(d)
        {
            return h-(d.wombats * 4)-14
        })
        //Width & Height of the Bar Chart
           .attr("width",function(d)
           {
              return (w/wombatSightings.length-barPadding);
           })
           .attr("height",function(d)
        {
            return d.wombats*4
        })
//Color of Bar Chart changed according to the data value
        .attr("fill", function(d)
    {
        return "rgb(0, " + (100 + d.wombats * 10) + ", 0)";
    })

    svg.selectAll("text")
            .data(wombatSightings)
            .enter()
            .append("text")
            .text(function(d)
        {
            return d.wombats;
        })
        .attr("fill","black")
        .attr("x", function(d,i)
    {
        return i * (w/wombatSightings.length) + 10.5;
    })
        .attr("y", function(d)
        {
        return h - (d.wombats * 4)
        })
   }

}
window.onload = init;
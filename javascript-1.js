let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest();

let data;
let values;

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

let width = 900;
let height = 600;
let padding = 75;

let svg = d3.select("svg")
let tooltip = d3.select("#tooltip")

let drawCanvas = () => {
    svg.attr("width", width)
    svg.attr("height", height)
}

let generateScales = () => {

    heightScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) => {
                        return item[1];
                    })])
                    .range([0, height - (2 * padding)])

    xScale = d3.scaleLinear()
                    .domain([0, values.length - 1])
                    .range([padding, (width -padding)])

    let datesArray = values.map((item) => {
        return new Date(item[0])
    })

    xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray), d3.max(datesArray)])
                    .range([padding, (width - padding)])

    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) => {
                        return item[1];
                    })])
                    .range([(height - padding), padding])

}

let drawBars = () => {
    tooltip.style("opacity", 0);

    svg.selectAll("rect")
        .data(values)
        .enter()
        .append("rect")
        .style("fill", "#FFA836")
        .attr("class", "bar")
        .attr("width", (width - (2 * padding)) / values.length)
        .attr("data-date", (item) => {
            return item[0];
        })
        .attr("data-gdp", (item) => {
            return item[1];
        })
        .attr("height", (item) => {
            return heightScale(item[1]);
        })
        .attr("x", (item, index) => {
            return xScale(index);
        })
        .attr("y", (item) => {
            return (height - padding) - heightScale(item[1]);
        })
        .on("mouseover", function (event, item) {
            d3.select(this).style("fill", "black");
            tooltip.style("opacity", 0.9)
                .html("<p>Date: " + item[0] + "<br/> GDP: " + item[1] + " Billion</p>")
                .attr("data-date", item[0])
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY - 10 + "px");
        })
        .on("mouseout", function () {
            d3.select(this).style("fill", "#FFA836");
            tooltip.style("opacity", 0);
        });
};

let generateAxes = () => {

    let xAxis = d3.axisBottom(xAxisScale)

    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0, " + (height - padding) + ")")
    
    let yAxis = d3.axisLeft(yAxisScale)

    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ", 0)")
} 

req.open("GET", url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    values = data.data
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
}
req.send()
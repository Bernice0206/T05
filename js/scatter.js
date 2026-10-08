
const scatterContainer = d3.select("#scatter-chart");

// Load the TV energy dataset
d3.csv("data/Ex5_TV_energy.csv", d => ({
    star: +d.star2,
    energy: +d.energy_consumpt,
    brand: d.brand
})).then(data => {

    // Remove invalid values
    data = data.filter(d =>
        Number.isFinite(d.star) &&
        Number.isFinite(d.energy)
    );

    const width = 600;
    const height = 400;

    const margin = {
        top: 20,
        right: 30,
        bottom: 60,
        left: 75
    };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = scatterContainer
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    const chart = svg.append("g")
        .attr("transform",
            `translate(${margin.left},${margin.top})`);

    // X-axis scale
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.star))
        .nice()
        .range([0, chartWidth]);

    // Y-axis scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.energy)])
        .nice()
        .range([chartHeight, 0]);

    // Horizontal grid lines
    chart.append("g")
        .attr("class", "grid")
        .call(
            d3.axisLeft(y)
                .tickSize(-chartWidth)
                .tickFormat("")
        )
        .selectAll("line")
        .attr("stroke", "#e5eaf0");

    // X-axis
    chart.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(x));

    // Y-axis
    chart.append("g")
        .call(d3.axisLeft(y));

    // Scatter plot dots
    chart.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.star))
        .attr("cy", d => y(d.energy))
        .attr("r", 3.5)
        .attr("fill", "#2874a6")
        .attr("opacity", 0.65)
        .append("title")
        .text(d =>
            `Brand: ${d.brand}\nStar Rating: ${d.star}\nEnergy: ${d.energy} kWh/year`
        );

    // X-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "13px")
        .text("Energy Efficiency Star Rating");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 18)
        .attr("text-anchor", "middle")
        .attr("font-size", "13px")
        .text("Energy Consumption (kWh/year)");

}).catch(error => {
    console.error("Error loading scatter plot data:", error);
    scatterContainer.text("Unable to load scatter plot data.");
});


const lineContainer = d3.select("#line-chart");

// Load electricity spot price data
d3.csv("data/Ex5_ARE_Spot_Prices.csv").then(data => {

    const chartData = data.map(d => ({
        year: +d.Year,
        price: +d["Average Price (notTas-Snowy)"]
    })).filter(d =>
        Number.isFinite(d.year) &&
        Number.isFinite(d.price)
    ).sort((a, b) => a.year - b.year);

    const width = 600;
    const height = 400;

    const margin = {
        top: 30,
        right: 30,
        bottom: 60,
        left: 75
    };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create responsive SVG
    const svg = lineContainer
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    const chart = svg.append("g")
        .attr("transform",
            `translate(${margin.left},${margin.top})`);

    // X-axis: Years
    const x = d3.scaleLinear()
        .domain(d3.extent(chartData, d => d.year))
        .range([0, chartWidth]);

    // Y-axis: Electricity prices
    const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.price) * 1.1])
        .nice()
        .range([chartHeight, 0]);

    // Horizontal grid lines
    chart.append("g")
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
        .call(
            d3.axisBottom(x)
                .tickFormat(d3.format("d"))
                .ticks(7)
        );

    // Y-axis
    chart.append("g")
        .call(d3.axisLeft(y));

    // Create the line generator
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.price));

    // Draw the line
    chart.append("path")
        .datum(chartData)
        .attr("fill", "none")
        .attr("stroke", "#2874a6")
        .attr("stroke-width", 3)
        .attr("stroke-linejoin", "round")
        .attr("d", line);

    // Add dots for each year
    chart.selectAll(".price-dot")
        .data(chartData)
        .join("circle")
        .attr("class", "price-dot")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.price))
        .attr("r", 3.5)
        .attr("fill", "#2874a6")
        .append("title")
        .text(d =>
            `Year: ${d.year}\nAverage Price: $${d.price.toFixed(2)}/MWh`
        );

    // X-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "13px")
        .text("Year");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 18)
        .attr("text-anchor", "middle")
        .attr("font-size", "13px")
        .text("Average Spot Price ($/MWh)");

}).catch(error => {
    console.error("Error loading line chart:", error);
    lineContainer.text("Unable to load line chart data.");
});

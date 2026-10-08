
const barContainer = d3.select("#bar-chart");

d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv")
    .then(data => {

        const chartData = data.map(d => ({
            technology: d.Screen_Tech,
            energy: +d["Mean(Labelled energy consumption (kWh/year))"]
        }));

        const width = 600;
        const height = 400;

        const margin = {
            top: 30,
            right: 25,
            bottom: 65,
            left: 75
        };

        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        // Create responsive SVG
        const svg = barContainer
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        const chart = svg.append("g")
            .attr("transform",
                `translate(${margin.left},${margin.top})`);

        // X-axis: Screen technologies
        const x = d3.scaleBand()
            .domain(chartData.map(d => d.technology))
            .range([0, chartWidth])
            .padding(0.3);

        // Y-axis: Energy consumption
        const y = d3.scaleLinear()
            .domain([0, d3.max(chartData, d => d.energy) * 1.15])
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
            .call(d3.axisBottom(x));

        // Y-axis
        chart.append("g")
            .call(d3.axisLeft(y));

        // Colours
        const color = d3.scaleOrdinal()
            .domain(["LCD", "LED", "OLED"])
            .range(["#2874a6", "#67b3a3", "#f4a261"]);

        // Draw bars
        chart.selectAll(".bar")
            .data(chartData)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.technology))
            .attr("y", d => y(d.energy))
            .attr("width", x.bandwidth())
            .attr("height", d => chartHeight - y(d.energy))
            .attr("fill", d => color(d.technology))
            .attr("rx", 4)
            .append("title")
            .text(d =>
                `${d.technology}: ${d.energy.toFixed(1)} kWh/year`
            );

        // Value labels above bars
        chart.selectAll(".value-label")
            .data(chartData)
            .join("text")
            .attr("class", "value-label")
            .attr("x", d => x(d.technology) + x.bandwidth() / 2)
            .attr("y", d => y(d.energy) - 10)
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")
            .attr("font-weight", "bold")
            .attr("fill", "#183153")
            .text(d => d.energy.toFixed(1));

        // X-axis label
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 12)
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")
            .text("Screen Technology");

        // Y-axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", 18)
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")
            .text("Mean Energy Consumption (kWh/year)");

    })
    .catch(error => {
        console.error("Error loading bar chart:", error);
        barContainer.text("Unable to load bar chart data.");
    });

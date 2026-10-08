
const donutContainer = d3.select("#donut-chart");

d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv")
    .then(data => {

        // Convert CSV values into numbers
        const chartData = data.map(d => ({
            technology: d.Screen_Tech,
            energy: +d["Mean(Labelled energy consumption (kWh/year))"]
        }));

        const width = 500;
        const height = 400;

        const radius = Math.min(width, height) / 2 - 35;

        // Create responsive SVG
        const svg = donutContainer
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        const chart = svg.append("g")
            .attr("transform",
                `translate(${width / 2},${height / 2})`);

        // Colours for screen technologies
        const color = d3.scaleOrdinal()
            .domain(["LCD", "LED", "OLED"])
            .range(["#2874a6", "#67b3a3", "#f4a261"]);

        // Calculate donut segments
        const pie = d3.pie()
            .value(d => d.energy)
            .sort(null);

        // Create donut shape
        const arc = d3.arc()
            .innerRadius(radius * 0.55)
            .outerRadius(radius);

        // Draw donut segments
        chart.selectAll("path")
            .data(pie(chartData))
            .join("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.technology))
            .attr("stroke", "white")
            .attr("stroke-width", 3)
            .append("title")
            .text(d =>
                `${d.data.technology}: ${d.data.energy.toFixed(1)} kWh/year`
            );

        // Add labels
        const labelArc = d3.arc()
            .innerRadius(radius * 0.8)
            .outerRadius(radius * 0.8);

        chart.selectAll(".donut-label")
            .data(pie(chartData))
            .join("text")
            .attr("class", "donut-label")
            .attr("transform",
                d => `translate(${labelArc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "13px")
            .attr("font-weight", "bold")
            .attr("fill", "#183153")
            .text(d => d.data.technology);

        // Centre text
        chart.append("text")
            .attr("text-anchor", "middle")
            .attr("y", -5)
            .attr("font-size", "17px")
            .attr("font-weight", "bold")
            .attr("fill", "#183153")
            .text("TV Screen");

        chart.append("text")
            .attr("text-anchor", "middle")
            .attr("y", 17)
            .attr("font-size", "14px")
            .attr("fill", "#667085")
            .text("Technologies");

    })
    .catch(error => {
        console.error("Error loading donut chart:", error);
        donutContainer.text("Unable to load donut chart data.");
    });

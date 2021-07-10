// @TODO: YOUR CODE HERE!
/********************************************************/
function renderPlot() {

  var svg = d3.select("body").select("svg");

  if (!svg.empty()) {
    svg.remove();
  }

  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 50,
    right: 30,
    bottom: 80,
    left: 60
  };
/********************************************************/
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
 
  var svgGroup = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svgGroup.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`) 
/********************************************************/
  d3.csv("./assets/data/data.csv").then(function (data, err) {
    if (err) throw err;

    // Parse data
    data.forEach(function (data) {
      data.obesity = +data.obesity;
      data.poverty = +data.poverty;

    });

    var xLinearScale = d3.scaleLinear()
      .domain([(d3.min(data, d => d.obesity)-1), d3.max(data, d => d.obesity)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.poverty)])
      .range([height, 0]);
 
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
 
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.obesity))
      .attr("cy", d => yLinearScale(d.poverty))
      .attr("r", 10)
      .attr("fill", "lightblue")
      .attr("opacity", ".9")

    var text = chartGroup.selectAll(".statetext")
      .data(data)
      .enter()
      .append("text")
      .classed("stateText", true)
      .attr("x", d => xLinearScale(d.obesity))
      .attr("y", d => yLinearScale(d.poverty))
      .attr("font-size", "8px")
      .text(d => d.abbr)
      .attr("text-anchor", "middle")
      .attr("fill", "white");
 
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function (d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>obesity: ${d.obesity}`);
      });

    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
      toolTip.show(data, this);
    })

      .on("mouseout", function (data, index) {
        toolTip.hide(data);
      });
  
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Poverty %");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
      .attr("class", "axisText")
      .text("Obesity %");

  }).catch(function (error) {
    console.log(error);
  });

}

renderPlot();

d3.select(window).on("resize", renderPlot);
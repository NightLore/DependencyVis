import React, { Component } from 'react'
import * as d3 from 'd3'

class BarGraph extends Component {
   componentDidMount() {
      const data = [ 2, 4, 2, 6, 8 ]
      this.drawGraph(data)
   }
   drawGraph(data)  {
      const canvasHeight = 400;
      const canvasWidth = 600;
      const scale = 20;
      const offset = 90;
      const svgCanvas = d3.select(this.refs.canvas)
         .append("svg")
         .attr("width", canvasWidth)
         .attr("height", canvasHeight)
         .style("border", "1px solid black");

      svgCanvas.selectAll("rect")
         .data(data).enter()
            .append("rect")
            .attr("width", 40)
            .attr("height", (datapoint) => datapoint * scale)
            .attr("fill", "orange")
            .attr("x", (datapoint, iteration) => iteration * 45)
            .attr("y", (datapoint) => canvasHeight - datapoint * scale);

      svgCanvas.selectAll("text")
         .data(data).enter()
            .append("text")
            .attr("x", (dataPoint, i) => i * 45 + 10)
            .attr("y", (dataPoint, i) => canvasHeight - dataPoint * scale - 10)
            .text(dataPoint => dataPoint)




      svgCanvas.selectAll("circle")
         .data(data).enter()
            .append("circle")
            .attr("cx", (d, i) => (i+1) * offset)
            .attr("cy", d => d * scale)
            .attr("r", d => d * scale)
            .attr("stroke", "green")
            .attr("stroke-width", 1)
            .attr("fill", "navy")

      svgCanvas.selectAll("text")
         .data(data).enter()
            .append("text")
            .attr("x", (dataPoint, i) => (i+1) * offset)
            .attr("y", (dataPoint, i) => dataPoint * scale)
            .attr("dominant-baseline", "middle")
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .text(dataPoint => dataPoint)
   }
   render() { return <div ref="canvas"></div> }
}
export default BarGraph

import React, { Component } from 'react'
import * as d3 from 'd3'
//import { forceLink } from "d3-force";

class Graph extends Component {

   componentDidMount() {
      const data = [ 2, 4, 2, 6, 8 ];
      this.drawGraph(data);
   }

   drawGraph(data)  {
      const canvasHeight = 400;
      const canvasWidth = 600;
      const scale = 10;
      const offset = 90;
      const svgCanvas = d3.select(this._rootNode)
         .append("svg")
         .attr("width", canvasWidth)
         .attr("height", canvasHeight)
         .style("border", "1px solid black");

      /*
      const nodes = [{x: 15, y: 25}];
      const links = [];
      const link = svgCanvas.append("g")
         .attr("stroke", "#999")
         .selectAll("line");

      const node = svgCanvas.append("g")
         .selectAll("circle");
      
      const simulation = d3.forceSimulation(nodes)
         .force("charge", d3.forceManyBody().strength(-60))
         .force("link", d3.forceLink(links))
         .force("x", d3.forceX())
         .force("y", d3.forceY())
         .on("tick", () => {
            node.attr("cx", d => d.x)
               .attr("cy", d => d.y)

            link.attr("x1", d => d.source.x)
               .attr("y1", d => d.source.y)
               .attr("x2", d => d.target.x)
               .attr("y2", d => d.target.y);
         });
      */

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

   shouldComponentUpdate() {
      // Prevents component re-rendering
      return false;
   }

   _setRef(componentNode) {
      this._rootNode = componentNode;
   }

   render() { return <div ref={this._setRef.bind(this)}></div> }
}

function _createForceSimulation() {
   return d3.forceSimulation()
      .force("charge", d3.forceManyBody().strength(-60))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
}

export default Graph

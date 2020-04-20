import React, { Component } from 'react'
import * as d3 from 'd3'
//import { forceLink } from "d3-force";

class NodeGraph extends Component {

   componentDidMount() {
      const data = [ 2, 4, 2, 6, 8 ];
      this.drawGraph(data);
   }

   drawGraph(data)  {
      const canvasHeight = 400;
      const canvasWidth = 600;

      const svgCanvas = d3.select(this._rootNode)
         .append("svg")
         .attr("width", canvasWidth)
         .attr("height", canvasHeight)
         .style("border", "1px solid black");

      const nodes = [
         {id: 1},
         {id: 2},
         {id: 3},
         {id: 4},
         {id: 5},
         {id: 6},
      ];
      const links = [
         {source: 1, target: 2, value: 1},
         {source: 2, target: 3, value: 1},
         {source: 3, target: 4, value: 1},
         {source: 4, target: 5, value: 1},
         {source: 5, target: 6, value: 1},
      ];

      const simulation = d3.forceSimulation(nodes)
         .force("link", d3.forceLink(links).id(d => d.id))
         .force("charge", d3.forceManyBody())
         .force("center", d3.forceCenter(canvasWidth / 2, canvasHeight / 2));

      const link = svgCanvas.append("g")
            .attr("stroke", "#999")
         .selectAll("line")
         .data(links)
         .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

      const node = svgCanvas.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
         .selectAll("circle")
         .data(nodes)
         .join("circle")
            .attr("r", 5)
            .attr("fill", "red")

      simulation.on("tick", () => {
         link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
         node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
      });

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
      //.force("x", d3.forceX())
      //.force("y", d3.forceY())
}

export default NodeGraph

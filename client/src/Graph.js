import React, { Component } from 'react'
import * as d3 from 'd3'
import drag from './drag'

const color = () => {
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return d => scale(d.group);
}

class Graph extends Component {
   constructor(props) {
      super(props);

      this.canvasHeight = 400;
      this.canvasWidth = 600;
   }

   componentDidMount() {
      this._createCanvas();
   }

   render() { 
      if (this.props.nodesChanged)
      {
         this._clearCanvas();
         this._createSimulation();
         this._setGraphData();
         this._startGraph();

         console.log("Changed");
         this.props.setNodesChanged(false);
      }
      return <div ref={this._setRef.bind(this)}></div> 
   }

   /*
   shouldComponentUpdate() {
      // Prevents component re-rendering
      return false;
   }
   */

   // connects component to this
   _setRef(componentNode) {
      this._rootNode = componentNode;
   }

   _createCanvas() {
      this.svgCanvas = d3.select(this._rootNode)
         .append("svg")
         .attr("width", this.canvasWidth)
         .attr("height", this.canvasHeight)
         .style("border", "1px solid black");
   }

   _createSimulation() {
      this.simulation = d3.forceSimulation(this.props.nodes)
         .force("link", d3.forceLink(this.props.links)
            .id(d => d.id)
            .distance(d => d.value * 20))
         .force("charge", d3.forceManyBody())
         .force("center", d3.forceCenter(this.canvasWidth / 2, this.canvasHeight / 2))

      /*
      this.force = d3.layout.force()
         .charge(-120)
         .linkDistance(30)
         .size([this.canvasWidth, canvasHeight]);

      this.force.nodes(this.props.nodes)
         .links(json.links)
         .charge(d => {
            let charge = -500;
            if (d.index === 0) charge = 10 * charge;
            return charge;
         });
         */
   }

   _setGraphData() {
      this.link = this.svgCanvas.append("g")
            .attr("stroke", "#999")
         .selectAll("line")
         .data(this.props.links)
         .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

      this.node = this.svgCanvas.append("g")
         .selectAll("g")
         .data(this.props.nodes)
         .join("g")
            .call(drag(this.simulation));

      this.node.append("circle")
            .attr("r", d => d.radius)
            .attr("stroke", "white")
            .attr("fill", d => d.color)
      this.node.append("text")
            .attr("x", d => 1.5 * d.radius)
            .text(d => d.id)
            .attr("dominant-baseline", "middle")
         .clone(true).lower()
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 3);
   }

   _startGraph() {
      this.simulation.on("tick", () => {
         this.link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
         this.node
            .attr("transform", d => `translate(${d.x},${d.y})`)
      });
   }

   _clearCanvas() {
      this.svgCanvas.selectAll("*").remove();
   }

}

export default Graph

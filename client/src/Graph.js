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
   }

   componentDidMount() {

      const canvasHeight = 400;
      const canvasWidth = 600;

      this.svgCanvas = d3.select(this._rootNode)
            .append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight)
            .style("border", "1px solid black");

      this.simulation = d3.forceSimulation(this.props.nodes)
            .force("link", d3.forceLink(this.props.links).id(d => d.id))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(canvasWidth / 2, canvasHeight / 2))

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
            .attr("fill", color())
      this.node.append("text")
            .attr("x", d => 1.5 * d.radius)
            .text(d => d.id)
            .attr("dominant-baseline", "middle")
         .clone(true).lower()
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 3);

      this.simulation.on("tick", () => {
         this.link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
         this.node
            .attr("transform", d => `translate(${d.x},${d.y})`)
      });

      /*
      const svgCanvas = d3.select(this._rootNode)
         .append("svg")
         .attr("width", canvasWidth)
         .attr("height", canvasHeight)
         .style("border", "1px solid black");

      const simulation = d3.forceSimulation(nodes)
         .force("link", d3.forceLink(links).id(d => d.id))
         .force("charge", d3.forceManyBody())
         .force("center", d3.forceCenter(canvasWidth / 2, canvasHeight / 2));

      let link = svgCanvas.append("g")
            .attr("stroke", "#999")
         .selectAll("line")
         .data(links)
         .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

      let node = svgCanvas.append("g")
         .selectAll("g")
         .data(nodes)
         .join("g")
            .call(drag(simulation));

      node.append("circle")
            .attr("r", d => d.radius)
            .attr("stroke", "white")
            .attr("fill", color())
      node.append("text")
            .attr("x", d => 1.5 * d.radius)
            .text(d => d.id)
            .attr("dominant-baseline", "middle")
         .clone(true).lower()
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 3);

      simulation.on("tick", () => {
         link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
         node
            .attr("transform", d => `translate(${d.x},${d.y})`)
      });
      */

   }

   /*
   shouldComponentUpdate() {
      // Prevents component re-rendering
      return false;
   }
   */

   _setRef(componentNode) {
      this._rootNode = componentNode;
   }

   render() { 
      if (this.props.nodesChanged)
      {
         console.log("Changed");
         this.link = this.link
            .data(this.props.links)
            .join("line");

         this.node = this.node
            .data(this.props.nodes);

         this.simulation.nodes(this.props.nodes);
         this.simulation.force("link").links(this.props.links);
         this.simulation.alpha(1).restart();
         this.props.setNodesChanged(false);
      }
      return <div ref={this._setRef.bind(this)}></div> 
   }
}

export default Graph

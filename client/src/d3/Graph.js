import React, { Component } from 'react'
import * as d3 from 'd3'
import mouse from './mouse'
import d3helpers from './d3helpers'

let graphData = {
   canvasHeight: 800,
   canvasWidth: 1200,

   sidebarWidth: 200,
   sidebarFill: "lightsteelblue",

   tooltipWidth: 100,
   tooltipHeight: 100,
   tooltipCornerRadius: 15,
   tooltipFill: "lightsteelblue",
   tooltipTextColor: "red",
   tooltipCharWidth: 10,
   tooltipTextOffset: 20,
   tooltipDy: 20
};

class Graph extends Component {
   constructor(props) {
      super(props);
   }

   componentDidMount() {
      this._createCanvas();
   }

   render() { 
      if (this.props.nodesChanged)
      {
         this.props.setNodesChanged(false);
         this._clearCanvas();

         graphData.props = this.props;
         this._createSimulation();
         this._setGraphData();
         this._createTooltip();
         this._createSideBar();
         this._startGraph();

         console.log("Changed");
      }
      return <span ref={this._setRef.bind(this)}/> 
   }

   /*
   shouldComponentUpdate() {
      // Prevents component re-rendering
      return false;
   }
   */

   // connects component to this
   _setRef(componentNode) {
      graphData.rootNode = componentNode;
   }

   _createTooltip() {
      // Define the div for the tooltip
      graphData.tooltip = graphData.svgCanvas.append("g")	
         .style("opacity", 0)
         //.style("text-align", "center")

      graphData.tooltip.append("rect")
            .attr("width", graphData.tooltipWidth)
            .attr("height", graphData.tooltipHeight)
            .attr("rx", graphData.tooltipCornerRadius)
            .attr("fill", graphData.tooltipFill)

      graphData.tooltip.append("text")
            .attr("dominant-baseline", "middle")
            .attr("text-anchor", "middle")
            .attr("fill", graphData.tooltipTextColor)

   }

   _createSideBar() {

      graphData.sidebar = graphData.svgCanvas.append("g")

      graphData.sidebar.append("rect")
            .attr("width", graphData.sidebarWidth)
            .attr("height", graphData.canvasHeight)
            .attr("fill", graphData.sidebarFill)

      graphData.sidebar.content = graphData.sidebar
         .selectAll("g")
         .data(graphData.props.nodes)
         .join("g")

      graphData.sidebar.content.append("text")
            .attr("x", (d, i) => graphData.tooltipCharWidth)
            .attr("y", (d, i) => graphData.tooltipDy * (i+1))
            .text(d => d.id)

   }

   _createCanvas() {
      graphData.svgCanvas = d3.select(graphData.rootNode)
         .append("svg")
         .attr("width", graphData.canvasWidth)
         .attr("height", graphData.canvasHeight)
         .style("border", "1px solid black");
   }

   _createSimulation() {
      graphData.simulation = d3.forceSimulation(graphData.props.nodes)
         .force("link", d3.forceLink(graphData.props.links)
            .id(d => d.id)
            .distance(d => d.value * 20))
         .force("charge", d3.forceManyBody())
         .force("center", d3.forceCenter(graphData.canvasWidth / 2, graphData.canvasHeight / 2))

      /*
      graphData.force = d3.layout.force()
         .charge(-120)
         .linkDistance(30)
         .size([graphData.canvasWidth, canvasHeight]);

      graphData.force.nodes(graphData.props.nodes)
         .links(json.links)
         .charge(d => {
            let charge = -500;
            if (d.index === 0) charge = 10 * charge;
            return charge;
         });
         */
   }

   _setGraphData() {
      graphData.link = graphData.svgCanvas.append("g")
            .attr("stroke", "#999")
         .selectAll("line")
         .data(graphData.props.links)
         .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

      graphData.node = graphData.svgCanvas.append("g")
         .selectAll("g")
         .data(graphData.props.nodes)
         .join("g")
            .call(mouse.drag(graphData.simulation));

      graphData.node.append("circle")
            .attr("id", d => d.id)
            .attr("r", d => d.radius)
            .attr("stroke", "white")
            .attr("fill", d => d.color)
            .on("mouseover", mouse.handleMouseOver.bind(graphData))
            .on("mouseout", mouse.handleMouseOut.bind(graphData))
            .on("click", mouse.handleMouseClicked.bind(graphData))

      graphData.node.append("text")
            .attr("x", d => 1.5 * d.radius)
            .text(d => d.id)
            .attr("dominant-baseline", "middle")
         .clone(true).lower()
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 3);

   }

   _startGraph() {
      graphData.simulation.on("tick", () => {
         graphData.link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
         graphData.node
            .attr("transform", d => `translate(${d.x},${d.y})`)
      });
   }

   _clearCanvas() {
      graphData.svgCanvas.selectAll("*").remove();
   }

}

export default Graph

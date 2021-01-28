import React, { Component } from 'react'
import * as d3 from 'd3'
import mouse from './mouse'
import { updateNodes } from './d3utils'
import { getDocumentSize } from '../utils';

const DIVSTYLE = {
   position: "absolute",
   top: 0,
   right: 0,
   bottom: 0,
   left: 0,
}

const SIMULATION = {
   STRENGTH: 45,
   DISTANCE_MAX_RATIO: 8
}

let graphData = {
   tooltipWidth: 100,
   tooltipHeight: 100,
   tooltipCornerRadius: 15,
   tooltipFill: "lightsteelblue",
   tooltipTextColor: "red",
   tooltipCharWidth: 10,
   tooltipTextOffset: 20,
   tooltipDy: 20
};

function setScale(minDomain, maxDomain) {
   const minRange = 8;
   const maxRange = Math.max(minRange + 1, 
      Math.min(window.innerWidth, window.innerHeight)/8);
   maxDomain = Math.max(maxDomain, minDomain + maxRange - minRange);

   graphData.scale = d3.scaleLinear()
      .domain([minDomain, maxDomain])
      .range([minRange, maxRange]);
   console.log("Scale", minDomain, maxDomain, minRange, maxRange);
}

function scale(integer) {
   return graphData.scale ? graphData.scale(integer) : integer;
}

function setEndPoints(selection) {
   selection
      .each(d => {
         let dx = d.target.x - d.source.x;
         let dy = d.target.y - d.source.y;
         let angle = Math.atan2(dx, dy);

         // Compute the line endpoint such that the arrow
         // is touching the edge of the node rectangle perfectly.
         d.sourceX = d.source.x + Math.sin(angle) * scale(d.source.radius);
         d.targetX = d.target.x - Math.sin(angle) * scale(d.target.radius);
         d.sourceY = d.source.y + Math.cos(angle) * scale(d.source.radius);
         d.targetY = d.target.y - Math.cos(angle) * scale(d.target.radius);
      })
      .attr("x1", function(d) { return d.sourceX; })
      .attr("y1", function(d) { return d.sourceY; })
      .attr("x2", function(d) { return d.targetX; })
      .attr("y2", function(d) { return d.targetY; });

}

function getSize() {
   let size = getDocumentSize();
   return {
      width: size.width - 2,
      height: size.height - 2,
   };
}

class Graph extends Component {
   constructor(props) {
      super(props);
      this.state = getSize();
      graphData.scale = scale;
   }

   resize = () => {
      let size = getSize();
      let width = size.width;
      let height = size.height;

      if (graphData.svgCanvas)
         graphData.svgCanvas
            .attr("width", width)
            .attr("height", height)

      if (graphData.simulation) {
         graphData.simulation.force("center")
            .x(width / 2)
            .y(height / 2)
         graphData.simulation.alpha(0.3).restart();
      }
      this.setState({width: width, height: height});
   };

   componentDidMount() {
      this._createCanvas(this.state.width, this.state.height);
      window.addEventListener('resize', this.resize);
   }

   componentWillUnmount() {
      window.removeEventListener('resize', this.resize);
   }

   render() { 

      if (this.props.nodesChanged)
      {
         this.props.setNodesChanged(false);
         this._clearCanvas();

         graphData.props = this.props;
         let {minRadius, maxRadius} = updateNodes(this.props.nodes, this.props.options);
         setScale(minRadius, maxRadius);
         this._createSimulation(this.state.width, this.state.height);
         this._setGraphData();
         this._createTooltip();
         this._startGraph();

         console.log("Changed", this.props.nodes);
      }
      return <div id="graph" style={DIVSTYLE} ref={this._setRef.bind(this)}/> 
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

   _createCanvas(width, height) {
      graphData.svgCanvas = d3.select(graphData.rootNode)
         .append("svg")
         .attr("width", width)
         .attr("height", height)
         .style("border", "1px solid black");

   }

   _createSimulation(width, height) {
      let minDimension = Math.min(width, height);
      graphData.simulation = d3.forceSimulation(graphData.props.nodes)
         .force("link", d3.forceLink(graphData.props.links)
            .id(d => d.id)
            .distance(link => scale(link.source.radius) + scale(link.target.radius) + minDimension / SIMULATION.DISTANCE_MAX_RATIO)
            //.distance(d => minDimension / SIMULATION.DISTANCE_MAX_RATIO)
            )
         .force("charge", d3.forceManyBody()
            .distanceMax(minDimension / 2)
            .strength(d => -1 * SIMULATION.STRENGTH * Math.sqrt(scale(d.radius))))
            //.strength(d => Math.sqrt(scale(d.radius * 100)) * -5))
         .force("center", d3.forceCenter(width / 2, height / 2))
   }

   _setGraphData() {
      const arrowSize = 2;
      graphData.svgCanvas.append("defs")
         .append("marker")
            .attr("id", "arrow")
            .attr("orient", "auto")
            .attr("preserveAspectRatio", "none")
            .attr("viewBox", [0,-arrowSize/2,arrowSize,arrowSize])
            .attr("refX", arrowSize)
            .attr("refY", 0)
            .attr("markerWidth", arrowSize)
            .attr("markerHeight", arrowSize * 4 / 5)
         .append("path")
            .attr("d", `M 0 ${-arrowSize/2} L ${arrowSize} 0 L 0 ${arrowSize/2}`)
            .attr("fill", "#888")

      graphData.link = graphData.svgCanvas.append("g")
            .attr("stroke", "#999")
         .selectAll("line")
         .data(graphData.props.links)
         .join("line")
            .attr("stroke-width", d => 2)

      graphData.node = graphData.svgCanvas.append("g")
         .selectAll("g")
         .data(graphData.props.nodes)
         .join("g")
            .call(mouse.drag(graphData.simulation));

      graphData.node.append("circle")
            .attr("id", d => d.id)
            .attr("r", d => scale(d.radius))
            .attr("stroke", d => d.color === "white" ? "black" : "white")
            .attr("fill", d => d.color)
            .on("mouseover", mouse.handleMouseOver.bind(graphData))
            .on("mouseout", mouse.handleMouseOut.bind(graphData))
            .on("click", mouse.handleMouseClicked.bind(graphData))
            .on("dblclick", mouse.handleMouseDoubleClicked.bind(graphData))

      graphData.arrow = graphData.svgCanvas.append("g")
         .selectAll("line")
         .data(graphData.props.links)
         .join("line")
            .attr("stroke-width", 5)
            .attr("marker-end", "url(#arrow)");

      graphData.node.append("text")
            .attr("x", d => 5 + scale(d.radius))
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
         graphData.arrow.call(setEndPoints)
      });
   }

   _clearCanvas() {
      graphData.svgCanvas.selectAll("*").remove();
   }

}

export default Graph

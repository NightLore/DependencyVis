import React, { Component } from 'react'
import * as d3 from 'd3'
import drag from './drag'

/*
const color = () => {
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return d => scale(d.group);
}
*/

class Graph extends Component {
   constructor(props) {
      super(props);

      this.canvasHeight = 800;
      this.canvasWidth = 1200;

      this.tooltipWidth = 100;
      this.tooltipHeight = 100;
      this.tooltipCornerRadius = 15;
      this.tooltipFill = "lightsteelblue";
      this.tooltipTextColor = "red";
      this.tooltipCharWidth = 10;
      this.tooltipTextOffset = 20;
      this.tooltipDy = 20;
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
         this._createToolTip();
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

   _createToolTip() {
      // Define the div for the tooltip
      this.tooltip = this.svgCanvas.append("g")	
         .style("opacity", 0)
         //.style("text-align", "center")

      this.tooltip.append("rect")
            .attr("width", this.tooltipWidth)
            .attr("height", this.tooltipHeight)
            .attr("rx", this.tooltipCornerRadius)
            .attr("fill", this.tooltipFill)

      this.tooltip.append("text")
            .attr("dominant-baseline", "middle")
            .attr("text-anchor", "middle")
            .attr("fill", this.tooltipTextColor)
            
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
            .on("mouseover", this._handleMouseOver.bind(this))
            .on("mouseout", this._handleMouseOut.bind(this))
            .on("click", this._handleMouseClicked.bind(this))
      
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

   _handleMouseOver(d) {
      let p = d3.event.target.parentElement.parentElement.parentElement;
      let rectX = d3.mouse(p)[0] + d.radius * 2;
      let rectY = d3.mouse(p)[1] + d.radius * 2;
      this.tooltipWidth = Math.max(d.id.length, ("version: " + d.version).length) 
         * this.tooltipCharWidth;
      this.tooltipHeight = d.length * this.tooltipDy + this.tooltipTextOffset; 
      let textX = rectX + this.tooltipWidth / 2;
      let textY = rectY + this.tooltipTextOffset;
      let dy = this.tooltipDy;

      console.log("mouseover", d);
      this.tooltip.transition()
            .duration(200)
            .style("opacity", 0.9)
      this.tooltip.selectAll("rect")
            .attr("x", rectX + "px")
            .attr("y", rectY + "px")
            .attr("width", this.tooltipWidth)
            .attr("height", this.tooltipHeight)
      this.tooltip.selectAll("text")
         .selectAll("*").remove()

      this.tooltip.selectAll("text")
         .append("tspan")
            .attr("x", textX + "px")
            .attr("y", textY + "px")
            .text(d.id)

      this.tooltip.selectAll("text")
         .append("tspan")
            .attr("x", textX + "px")
            .attr("y", textY + "px")
            .attr("dy", dy + "px")
            .text("version: " + d.version)

      if (!d.info) return;
      dy += this.tooltipDy;
      for (const [key, value] of Object.entries(d.info)) {
         this.tooltip.selectAll("text")
            .append("tspan")
               .attr("x", textX + "px")
               .attr("y", textY + "px")
               .attr("dy", dy + "px")
               .text(key + ": " + (value.name || value))
         dy += this.tooltipDy;
      }
   }

   _handleMouseOut(d) {
      this.tooltip.transition()
         .duration(500)
         .style("opacity", 0);
      this.tooltip.selectAll("rect")
         .attr("x", -this.tooltipWidth)
      this.tooltip.selectAll("tspan")
         .attr("x", -this.tooltipWidth)
   }

   async _handleMouseClicked(d) {
      if (d.clicked) return;

      let data = await this.props.search(d.id);
      d.clicked = true;
      d.color = "darkorange";
      if (data) {
         d.color = "lightblue";
         d.info = {
            size: data.size,
            archived: data.archived,
            license: data.license,
            language: data.language,
            forks: data.forks,
            watchers: data.watchers
         }
         d.length += 6;
      }
      console.log("Clicked processed", d);
   }

   _clearCanvas() {
      this.svgCanvas.selectAll("*").remove();
   }

}

export default Graph

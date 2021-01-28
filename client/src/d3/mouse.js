import * as d3 from 'd3'
import updateTooltip from './tooltip'
import { searchNewGraph } from './d3utils'
import { openInNewTab } from '../utils'

function drag(simulation) {

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

// most of these helper functions expect to be called with .bind(Graph)
// WARNING: find a way to not use .bind for 'this', it overwrites what d3 sets 
// the 'this' variable to (element that was actually hovered over.

function handleMouseOver(d) {
   let p = d3.event.target.parentElement.parentElement.parentElement;
   this.rectX = d3.mouse(p)[0] + this.scale(d.radius) * 2 / 3;
   this.rectY = d3.mouse(p)[1] + this.scale(d.radius) * 2 / 3;

   console.log("mouseover", d);
   this.tooltip.transition()
         .duration(200)
         .style("opacity", 0.9)

   this.tooltip.selectAll("rect")
         .attr("x", `${this.rectX}px`)
         .attr("y", `${this.rectY}px`)

   updateTooltip(this.tooltip, d, this);
}

function handleMouseOut(d) {
   this.tooltip.transition()
      .duration(500)
      .style("opacity", 0);
   this.tooltip.selectAll("rect")
      .attr("x", -this.tooltipWidth)
   this.tooltip.selectAll("tspan")
      .attr("x", -this.tooltipWidth)
}

async function handleMouseClicked(d) {
   d.active = true;
   if (d.clicked) {this.props.setNodesChanged(true); return;}

   // set load state
   d.color = "lightgrey"; // loading color
   d.loaded = {
      color: "grey"
   };
   let circle = d3.select("#" + d.id);
   circle.attr("fill", d.color);

   // start search
   let graph = {
      nodes: this.props.nodes,
      links: this.props.links
   };
   this.props.setGraph(await searchNewGraph(
      d, graph, this.props.options, this.props.setErrorText
   ));

   updateTooltip(this.tooltip, d, this);

   console.log("Click processed", d);
}

function handleMouseDoubleClicked(d) {
   openInNewTab(`?org=${d.all.username}&repo=${d.all.repo}`);
   console.log("Double Clicked", d);
}

const mouse = {
   drag: drag,
   handleMouseOver: handleMouseOver,
   handleMouseOut: handleMouseOut,
   handleMouseClicked: handleMouseClicked,
   handleMouseDoubleClicked: handleMouseDoubleClicked
}

export default mouse;

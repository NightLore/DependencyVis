import * as d3 from 'd3'
import d3helpers from './d3helpers'

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
   this.rectX = d3.mouse(p)[0] + d.radius * 2;
   this.rectY = d3.mouse(p)[1] + d.radius * 2;

   console.log("mouseover", d);
   this.tooltip.transition()
         .duration(200)
         .style("opacity", 0.9)

   this.tooltip.selectAll("rect")
         .attr("x", this.rectX + "px")
         .attr("y", this.rectY + "px")

   d3helpers.updateTooltip(this.tooltip, d, this);
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
   if (d.clicked) return;

   d.color = "red";
   let circle = d3.select("#" + d.id);
   circle.attr("fill", d.color);


   let data = await this.props.search(d.id);
   if (data) {
      d.clicked = true;
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

      d3helpers.updateTooltip(this.tooltip, d, this);
      circle.attr("fill", d.color);
   }

   console.log("circle", circle);
   console.log("Clicked processed", d);
}

const mouse = {
   drag: drag,
   handleMouseOver: handleMouseOver,
   handleMouseOut: handleMouseOut,
   handleMouseClicked: handleMouseClicked
}

export default mouse;

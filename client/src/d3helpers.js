
function updateTooltip(tooltip, d, attributes) {
   attributes.tooltipWidth = 
      Math.max(d.id.length, ("version: " + d.version).length) 
      * attributes.tooltipCharWidth;
   attributes.tooltipHeight = 
      d.length * attributes.tooltipDy + attributes.tooltipTextOffset; 
   let textX = attributes.rectX + attributes.tooltipWidth / 2;
   let textY = attributes.rectY + attributes.tooltipTextOffset;
   let dy = attributes.tooltipDy;

   tooltip.selectAll("rect")
         .attr("width", attributes.tooltipWidth)
         .attr("height", attributes.tooltipHeight)

   tooltip.selectAll("text")
      .selectAll("*").remove()

   tooltip.selectAll("text")
      .append("tspan")
         .attr("x", textX + "px")
         .attr("y", textY + "px")
         .text(d.id)

   if (d.version) {
      tooltip.selectAll("text")
         .append("tspan")
            .attr("x", textX + "px")
            .attr("y", textY + "px")
            .attr("dy", dy + "px")
            .text("version: " + d.version)
   }

   if (!d.info) return;
   dy += attributes.tooltipDy;
   for (const [key, value] of Object.entries(d.info)) {
      tooltip.selectAll("text")
         .append("tspan")
            .attr("x", textX + "px")
            .attr("y", textY + "px")
            .attr("dy", dy + "px")
            .text(key + ": " + (value.name || value))
      dy += attributes.tooltipDy;
   }

}

const d3helpers = {
   updateTooltip: updateTooltip
};

export default d3helpers;

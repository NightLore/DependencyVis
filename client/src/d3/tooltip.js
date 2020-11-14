
function updateTooltip(tooltip, d, attributes) {
   attributes.tooltipWidth = 
      Math.max(d.id.length, ("version: " + d.version).length) 
      * attributes.tooltipCharWidth;

   tooltip.selectAll("text")
      .selectAll("*").remove()

   let textX = attributes.rectX + attributes.tooltipWidth / 2;
   let textY = attributes.rectY + attributes.tooltipTextOffset;
   let dy = 0;

   // dy = setName(tooltip, d, attributes, textX, textY, dy);
   // dy = setInfo(tooltip, d, attributes, textX, textY, dy);
   switch (attributes.props.options.color) {
      case "loaded":
         dy = setLoaded(tooltip, d, attributes, textX, textY, dy);
         break;
      case "audit":
         dy = setAudit(tooltip, d, attributes, textX, textY, dy);
         break;
   }

   attributes.tooltipHeight = dy + attributes.tooltipTextOffset;
   tooltip.selectAll("rect")
         .attr("width", attributes.tooltipWidth)
         .attr("height", attributes.tooltipHeight)
}

function addText(tooltip, textX, textY, dy, text) {
   tooltip.selectAll("text")
      .append("tspan")
         .attr("x", textX + "px")
         .attr("y", textY + "px")
         .attr("dy", dy + "px")
         .text(text)
}

function setName(tooltip, d, attributes, textX, textY, dy) {
   addText(tooltip, textX, textY, dy, d.id);
   return dy + attributes.tooltipDy;
}

function setInfo(tooltip, d, attributes, textX, textY, dy) {
   if (!d.info) return;

   for (const [key, value] of Object.entries(d.info)) {
      addText(tooltip, textX, textY, dy, key + ": " + value);
      dy += attributes.tooltipDy;
   }
   return dy;
}

function setLoaded(tooltip, d, attributes, textX, textY, dy) {
   if (!d.loaded) {
      addText(tooltip, textX, textY, dy, "Node Not Loaded");
      dy += attributes.tooltipDy;
      addText(tooltip, textX, textY, dy, "Click to Load");
      return dy + attributes.tooltipDy;
   }
   addText(tooltip, textX, textY, dy, d.loaded.stats);
   return dy + attributes.tooltipDy;
}

function setAudit(tooltip, d, attributes, textX, textY, dy) {
   if (!d.audit) {
      return setLoaded(tooltip, d, attributes, textX, textY, dy);
   }
   addText(tooltip, textX, textY, dy, "ID | SEVERITY");
   dy += attributes.tooltipDy;

   d.audit.forEach(a => {
      addText(tooltip, textX, textY, dy, a.id + ": " + a.severity);
      dy += attributes.tooltipDy;
      
   });
   return dy;
}

export default updateTooltip;

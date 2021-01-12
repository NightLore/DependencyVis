import {
   COLOR_OPTION_LOADED,
   COLOR_OPTION_AUDIT
} from '../Options'

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
      case COLOR_OPTION_LOADED.NAME:
         dy = setLoaded(tooltip, d, attributes, textX, textY, dy);
         break;
      case COLOR_OPTION_AUDIT.NAME:
         dy = setAudit(tooltip, d, attributes, textX, textY, dy);
         break;
      default:
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

/*
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
*/

function setLoaded(tooltip, d, attributes, textX, textY, dy) {
   if (!d.loaded || !d.loaded.stats) {
      addText(tooltip, textX, textY, dy, "Dependencies Not Loaded");
      dy += attributes.tooltipDy;
      addText(tooltip, textX, textY, dy, "Click to Load");
      return dy + attributes.tooltipDy;
   }
   addText(tooltip, textX, textY, dy, d.loaded.stats);
   return dy + attributes.tooltipDy;
}

function setAudit(tooltip, d, attributes, textX, textY, dy) {
   if (!d.loaded || d.loaded.failed) {
      return setLoaded(tooltip, d, attributes, textX, textY, dy);
   }

   if (!d.audit) {
      addText(tooltip, textX, textY, dy, "No severities");
      return dy + attributes.tooltipDy;
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

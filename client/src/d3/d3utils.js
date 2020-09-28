
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

   if (!d.info) return;
   for (const [key, value] of Object.entries(d.info)) {
      if (key === "source") continue;
      tooltip.selectAll("text")
         .append("tspan")
            .attr("x", textX + "px")
            .attr("y", textY + "px")
            .attr("dy", dy + "px")
            .text(key + ": " + value)
      dy += attributes.tooltipDy;
   }

}

function createCentralNode(id, username, repo) {
   let details = {source: getGithubURL(username, repo)};
   return createNode(id, "blue", 10, 1, true, details);
}

function createSideNode(node) {
   let id = node.name;
   let version = node.version;
   let color = auditToColor(node.audit);
   let details = {
      version: version
   };
   console.log("Create side Node:", color, node);
   return createNode(id, color, 8, 2, undefined, details, {version: version});
}

function auditToColor(audit) {
   if (!audit) return "green";
   if (audit.severity === "critical") return "darkred";
   if (audit.severity === "high") return "red";
   if (audit.severity === "moderate") return "orange";
   if (audit.severity === "low") return "yellow";
   console.error("Audit cannot convert to color", audit);
}

function getGithubSearchURL(username, repo) {
   return "api.github.com/repos/" + username + "/" + repo;
}

function getGithubURL(username, repo) {
   return "github.com/" + username + "/" + repo;
}

/*
 * id = identifier
 * color = color of node
 * radius = size of node
 * length
 * clicked = has node been clicked or not
 * source = url to info about node
 */
function createNode(id, color, radius, length, clicked, details, info)
{
   return {
      id: id,
      color: color,
      radius: radius,
      length: length,
      clicked: clicked,
      details: details,
      info: info
   };
}

export { 
   updateTooltip,
   createCentralNode,
   createSideNode,
   getGithubURL
}

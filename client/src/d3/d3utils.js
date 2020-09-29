
function updateTooltip(tooltip, d, attributes) {
   attributes.tooltipWidth = 
      Math.max(d.id.length, ("version: " + d.version).length) 
      * attributes.tooltipCharWidth;
   attributes.tooltipHeight = 
      d.length * attributes.tooltipDy + attributes.tooltipTextOffset; 

   tooltip.selectAll("rect")
         .attr("width", attributes.tooltipWidth)
         .attr("height", attributes.tooltipHeight)

   tooltip.selectAll("text")
      .selectAll("*").remove()

   let textX = attributes.rectX + attributes.tooltipWidth / 2;
   let textY = attributes.rectY + attributes.tooltipTextOffset;
   let dy = 0;

   // dy = setName(tooltip, d, attributes, textX, textY, dy);
   // dy = setInfo(tooltip, d, attributes, textX, textY, dy);
   dy = setAudit(tooltip, d, attributes, textX, textY, dy);
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

function setAudit(tooltip, d, attributes, textX, textY, dy) {
   if (!d.audit) {
      addText(tooltip, textX, textY, dy, "No severities");
      return;
   }
   addText(tooltip, textX, textY, dy, "ID | SEVERITY");
   dy += attributes.tooltipDy;

   d.audit.forEach(a => {
      addText(tooltip, textX, textY, dy, a.id + ": " + a.severity);
      dy += attributes.tooltipDy;
      
   });
   return dy;
}

function auditToColor(audit) {
   var severity = 0;
   // audit might not exist if no vulnerabilities
   if (audit) {
      // audit should come in as a list of vulnerabilities
      // audit should be sorted from highest severity to lowest
      severity = Math.max(auditSeverityToValue(audit[0].severity));
   }
   return auditSeverityValueToColor(severity);
}

function auditSeverityToValue(severity) {
   switch (severity) {
      case "critical":
         return 4;
      case "high":
         return 3;
      case "moderate":
         return 2;
      case "low":
         return 1;
      default:
         console.error("Audit default color used: ", severity);
         return 0;
   }
}

function auditSeverityValueToColor(severity) {
   switch (severity) {
      case 4:
         return "darkred";
      case 3:
         return "red";
      case 2:
         return "orange";
      case 1:
         return "yellow";
      default:
         return "green";
   }
}

function getGithubSearchURL(username, repo) {
   return "api.github.com/repos/" + username + "/" + repo;
}

function getGithubURL(username, repo) {
   return "github.com/" + username + "/" + repo;
}

function createCentralNode(id, username, repo) {
   let centralNode = {
      id: id,
      color: "blue",
      radius: 10,
      length: 1, // size of tooltip, deprecated
      clicked: true,
      details: {
         source: getGithubURL(username, repo)
      }
   };
   console.log("Create central Node:", centralNode);
   return centralNode;
}

function createSideNode(node) {
   let sideNode = {
      id: node.name,
      audit: node.audit,
      color: auditToColor(node.audit),
      radius: 8,
      length: 2, // size of tooltip, deprecated
      details: {
         version: node.version
      },
      info: {
         version: node.version
      },
   };
   console.log("Create side Node:", sideNode);
   return sideNode;
}

export { 
   updateTooltip,
   createCentralNode,
   createSideNode,
   getGithubURL
}


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
   dy = setAudit(tooltip, d, attributes, textX, textY, dy);

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

function setAudit(tooltip, d, attributes, textX, textY, dy) {
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

function toNodeColor(data, options) {
   if (data.isCentral)
      return "blue";
   switch (options.color) {
      case "loaded":
         if (data.loaded)
            return data.loaded.color;
         break;
      case "audit":
         return auditToColor(data.audit);
      default:
   }
   return "orange";
}

function toNodeSize(data, options) {
   switch (options.size) {
      case "nothing":
         return data.isCentral ? 10 : 8;
      case "stars":
         // Note: centralNode does not save this info
         return data.all ? data.all.stargazers_count : 8;
      default:
   }
   return data.isCentral ? 10 : 8;
}

function hasNode(nodes, data) {
   for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === data.name) {
         return true;
      }
   }
   return false;
}

function dependenciesToNodes(dependencies, mainNode, nodes, links, options) {
   let newNodes = [];
   let newLinks = [];
   dependencies.forEach((data, index, array) => {
      if (!hasNode(nodes, data)) {
         newNodes.push(createSideNode(data, options));
      }
      newLinks.push({
         source: mainNode, 
         target: data.name, 
         value: data.name.length
      });
   });
   console.log("Dependencies registered: ", newNodes, newLinks);
   return { nodes: nodes.concat(newNodes), links: links.concat(newLinks) };
}

function getGithubSearchURL(username, repo) {
   return "api.github.com/repos/" + username + "/" + repo;
}

function getGithubURL(username, repo) {
   return "github.com/" + username + "/" + repo;
}

function createCentralNode(id, username, repo, options) {
   let centralNode = {
      id: id,
      isCentral: true,
      radius: 10,
      clicked: true,
      details: {
         source: getGithubURL(username, repo)
      }
   };
   centralNode.color = toNodeColor(centralNode, options);
   centralNode.radius = toNodeSize(centralNode, options);
   console.log("Create central Node:", centralNode);
   return centralNode;
}

function createSideNode(node, options) {
   let sideNode = {
      id: node.name,
      audit: node.audit,
      color: toNodeColor(node, options),
      radius: toNodeSize(node, options),
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
   dependenciesToNodes,
   toNodeColor,
   toNodeSize,
   getGithubURL
}

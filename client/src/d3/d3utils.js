import auditToColor from '../dataManagers/audit'
import { lookup, search } from '../AxiosUtils'

// -------------- axiosToD3 -------------- //

async function lookupNewGraph(userInfo, mainId, graph, options, err) {
      let {resp, error} = await lookup(userInfo);
      if (error) {err("Failed lookup!"); return;}

      console.log("Response Data:", resp);
      return dependenciesToNodes(
         resp.dependencies, mainId, 
         graph.nodes, graph.links, 
         options
      );

}

async function searchNewGraph(d, graph, options, err) {
   let {resp: data, error} = await search(d.id);
   if (error) {
      console.log("Failed Search", d); 
      err("Failed search!");
      return;
   }

   console.log("Search Result:", data);
   let importData = {
      size: data.size,
      archived: data.archived,
      license: data.license.name,
      language: data.language,
      forks: data.forks,
      watchers: data.subscribers_count,
   };
   if (!d.info) d.info = {}
   if (!d.details) d.details = {}
   if (!d.loaded) d.loaded = {}
   Object.assign(d.info, importData);
   Object.assign(d.details, importData);
   d.all = data;
   d.details.source = getGithubURL(data.username, data.repo);

   d.loaded.color = "lightblue"
   d.clicked = true;
   d.source = data.source;

   // get new graph
   return dependenciesToNodes(
      data.dependencies, 
      d.id, 
      graph.nodes, 
      graph.links, 
      options
   );
}

// -------------- nodes -------------- //


function updateNodes(nodes, options) {
   let maxRadius = 10;
   let minRadius = Infinity;
   nodes.forEach(node => {
      node.color = toNodeColor(node, options);
      node.radius = toNodeSize(node, options);
      if (node.radius > maxRadius) 
         maxRadius = node.radius;
      if (node.radius < minRadius)
         minRadius = node.radius;
   });
   maxRadius = Math.max(maxRadius, minRadius + 1);
   return {minRadius, maxRadius};
};

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
      case "watchers":
         return data.all ? data.all.subscribers_count : 8;
      case "forks":
         return data.all ? data.all.forks_count : 8;
      case "open_issues":
         return data.all ? data.all.open_issues_count : 8;
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
   createCentralNode,
   lookupNewGraph,
   searchNewGraph,
   updateNodes,
   getGithubURL
}

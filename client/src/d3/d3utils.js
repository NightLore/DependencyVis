import auditToColor from '../dataManagers/audit'
import { lookup, search } from '../AxiosUtils'
import {
   COLOR_OPTION_LOADED, 
   COLOR_OPTION_AUDIT, 
   SIZE_OPTIONS,
} from '../Options'

const DEFAULT_SIDE_NODE_SIZE = 8;
const DEFAULT_CENTRAL_NODE_SIZE = 10;

// -------------- axiosToD3 -------------- //

async function lookupNewGraph(userInfo, mainId, graph, options, err) {
   let {resp, error} = await lookup(userInfo, options);
   if (error) {err("Failed lookup!"); return;}

   console.log("Response Data:", resp);
   let newGraph = dependenciesToNodes(
      resp.dependencies, mainId, 
      graph.nodes, graph.links, 
      options
   );

   if (options.loadAhead) {
      for (let node of newGraph.nodes) {
         await lookAtSingle(node, graph, options, err);

      }
   }

   return { 
      nodes: graph.nodes.concat(newGraph.nodes),
      links: graph.links.concat(newGraph.links)
   };
}

async function searchNewGraph(d, graph, options, err) {
   if (!d.all) {
      lookAtSingle(d, graph, options, err);
   }

   if (!d.all) { // lookup failed
      return;
   }

   d.loaded.stats = "Loaded"
   d.loaded.color = "lightblue"
   d.clicked = true;

   // get new graph
   let newGraph = dependenciesToNodes(
      d.all.dependencies, 
      d.id, 
      graph.nodes, 
      graph.links, 
      options
   );

   if (options.loadAhead) {
      newGraph.nodes.forEach(node => {
         lookAtSingle(node, graph, options, err);
      });
   }

   return { 
      nodes: graph.nodes.concat(newGraph.nodes),
      links: graph.links.concat(newGraph.links)
   };
}

async function lookAtSingle(d, graph, options, err) {
   if (!d.loaded) d.loaded = {}
   let {resp: data, error} = await search(d.id, options);
   if (error) {
      console.log("Failed Search", d); 
      //err("Failed search!");
      d.loaded.failed = true;
      d.loaded.stats = "Could not find source";
      d.loaded.color = "white";
      return;
   }

   console.log("Look At Single Result:", data);
   let importData = {
      size: data.size,
      archived: data.archived,
      license: data.license.name,
      language: data.language,
      forks: data.forks,
      watchers: data.subscribers_count,
      stars: data.stargazers_count,
      openPRs: data.open_pull_request_count,
      prMeanTime: data.pull_request_mean_time
   };
   if (!d.info) d.info = {}
   if (!d.details) d.details = {}
   Object.assign(d.info, importData);
   Object.assign(d.details, importData);
   d.all = data;
   d.details.source = getGithubURL(data.username, data.repo);
   d.details.created = data.created_at;
   d.details.updated = data.updated_at;
   d.source = d.all.source;

   if (data.dependencies.length === 0) {
      d.loaded.stats = "Loaded";
      d.loaded.color = "lightblue";
      d.clicked = true;
   }


}

// -------------- nodes -------------- //


function updateNodes(nodes, options) {
   let maxRadius = 0;
   let minRadius = Infinity;
   nodes.forEach(node => {
      node.color = toNodeColor(node, options);
      if (node.color === "white")
         node.strokeColor = "black"

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
   if (data.loaded && data.loaded.failed)
      return "white";
   switch (options.color) {
      case COLOR_OPTION_LOADED.NAME:
         return data.loaded.color;
      case COLOR_OPTION_AUDIT.NAME:
         return auditToColor(data.audit);
      default:
   }
   return "grey";
}

function toNodeSize(data, options) {
   let option = SIZE_OPTIONS.CHOICES.find(opt => opt.NAME === options.size);
   switch (option.NAME) {
         // put non-default cases here
      default:
   }
   return option.KEY ? _getDataSizeOrDefault(data.all, option.KEY) : _getDefaultSize(data.isCentral);
}

function _getDefaultSize(isCentral) {
   return isCentral ? DEFAULT_CENTRAL_NODE_SIZE : DEFAULT_SIDE_NODE_SIZE;
}

function _getDataSize(node, dataType) {
   return node && node[dataType] ? node[dataType] : undefined;
}

function _getDataSizeOrDefault(node, dataType) {
   return _getDataSize(node, dataType) || DEFAULT_SIDE_NODE_SIZE;
}

function _hasNode(nodes, data) {
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
      if (!_hasNode(nodes, data)) {
         newNodes.push(_createSideNode(data, options));
      }
      newLinks.push({
         source: mainNode, 
         target: data.name, 
         value: data.name.length
      });
   });
   console.log("Dependencies registered: ", newNodes, newLinks);
   return { nodes: newNodes, links: newLinks };
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
      },
      loaded: {
         stats: "Loaded Central Node",
         color: "blue"
      }
   };
   centralNode.color = toNodeColor(centralNode, options);
   centralNode.radius = toNodeSize(centralNode, options);
   console.log("Create central Node:", centralNode);
   return centralNode;
}

function _createSideNode(node, options) {
   let sideNode = {
      id: node.name,
      audit: node.audit,
      //color: toNodeColor(node, options),
      radius: toNodeSize(node, options),
      details: {
         version: node.version
      },
      info: {
         version: node.version
      },
      loaded: {
         color: "grey"
      }
   };
   //if (sideNode.color === "white")
   //   sideNode.strokeColor = "black";
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

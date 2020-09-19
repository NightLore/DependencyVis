import axios from 'axios';

const lookup = async userInfo => await post("lookup", userInfo);
const search = async querry => await post("search", {querry: querry});

async function post(querry, data) {
   let resp = null;
   let err = null;
   try {
      resp = await axios.post('http://localhost:3001/' + querry, data);
   }
   catch (e) {
      err = e;
      console.error("Failed querry!");
   }
   return {resp: resp, error: err};
}

function getGithubSearchURL(username, repo) {
   return "api.github.com/repos/" + username + "/" + repo;
}

function getGithubURL(username, repo) {
   return "github.com/" + username + "/" + repo;
}

function createCentralNode(id, username, repo) {
   let details = {source: getGithubURL(username, repo)};
   return createNode(id, "blue", 10, 1, true, details);
}

function createSideNode(id, username, repo, version) {
   let details = {
      source: getGithubURL(username, repo),
      version: version
   };
   return createNode(id, "orange", 8, 2, undefined, details);
}

/*
 * id = identifier
 * color = color of node
 * radius = size of node
 * length
 * clicked = has node been clicked or not
 * source = url to info about node
 */
function createNode(id, color, radius, length, clicked, details)
{
   return {
      id: id,
      color: color,
      radius: radius,
      length: length,
      clicked: clicked,
      details: details
   };
}

const Axios = {
   lookup: lookup,
   search: search,
   getGithubSearchURL: getGithubSearchURL,
   getGithubURL: getGithubURL,
   createCentralNode: createCentralNode,
   createSideNode: createSideNode
}

export default Axios;

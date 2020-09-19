import React from 'react'
import { lookup } from './AxiosUtils'
import { createCentralNode, createSideNode } from './d3/d3utils'
const { useState } = React;

const Form = props => {
   const [username, setUsername] = useState('');
   const [repo, setRepo] = useState('');
   const [folder, setFolder] = useState('');

   function getUserInfo() {
      return {
         username: username,
         repo: repo,
         folder: folder
      };
   }

   function reset() {
      setUsername('');
      setRepo('');
      setFolder('');
      props.setErrorText('');
   }

   var handleSubmit = async event => {
      event.preventDefault();
      var userInfo = getUserInfo();

      console.log("SUBMIT");

      let mainId = username + "/" + repo;
      let nodes = [createCentralNode(mainId, username, repo)];
      let links = [];

      let querryResp = await lookup(userInfo);
      if (querryResp.error) {props.setErrorText("Failed lookup!"); return;}

      let data = querryResp.resp;
      console.log("Response Data:", data);
      data.dependencies.forEach((value, index, array) => {
         nodes.push(createSideNode(value.name, username, repo, value.version));
         links.push({
            source: mainId, 
            target: value.name, 
            value: value.name.length
         });
      });
      console.log("Nodes Generated", nodes, links);
      props.setNodesLinks(nodes, links);

      reset();
   }

   return (
      <span style={{display: "inline-block", margin: "1em"}}>
      <form onSubmit={handleSubmit}>
         <input
            type="text"
            value={username}
            onChange={event => setUsername(event.target.value)}
            placeholder="GitHub username"
            required
         />
         <input
            type="text"
            value={repo}
            onChange={event => setRepo(event.target.value)}
            placeholder="GitHub repo"
            required
         />
         <button type="submit">Search</button>
         <input
            type="text"
            value={folder}
            onChange={event => setFolder(event.target.value)}
            placeholder="optional specified folder"
         />
      </form>
      </span>
   )
}

export default Form;

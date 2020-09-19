import React from 'react'
import Axios from './AxiosHelpers'
const { useState } = React;

const Form = props => {
   const [username, setUsername] = useState('');
   const [repo, setRepo] = useState('');
   const [folder, setFolder] = useState('');

   var handleSubmit = async event => {
      event.preventDefault();
      var userInfo = {
         username: username,
         repo: repo,
         folder: folder
      };

      console.log("SUBMIT");

      let mainId = username + "/" + repo;
      let nodes = [Axios.createCentralNode(mainId, username, repo)];
      let links = [];

      let querryResp = await Axios.lookup(userInfo);
      if (querryResp.error) {props.setErrorText("Failed lookup!"); return;}

      let data = querryResp.resp.data;
      console.log("Response Data:", data);
      data.dependencies.forEach((value, index, array) => {
         nodes.push(Axios.createSideNode(value.name, username, repo, value.version));
         links.push({
            source: mainId, 
            target: value.name, 
            value: value.name.length
         });
      });
      console.log("Nodes Generated", nodes, links);
      props.setNodesLinks(nodes, links);

      setUsername('');
      setRepo('');
      setFolder('');
      props.setErrorText('');
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

import React from 'react'
import { lookup } from './AxiosUtils'
import { createCentralNode, dependenciesToNodes } from './d3/d3utils'
const { useState } = React;

const FORMBACKGROUND = {
   zIndex: "5",
   backgroundColor: "rgb(191, 226, 227)",

   position: "absolute",
   width: "100%",
   height: "100%",
}

const FORMSTYLE = {
   width: "fit-content",

   // center on page 
   position: "absolute",
   margin: "auto",
   left: "50%",
   top: "30%",
   transform: "translate(-50%, -50%)",
}

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
      let newGraph = dependenciesToNodes(data.dependencies, mainId, nodes, links, {
         color: props.colorOption
      });
      console.log("Nodes Generated", nodes, links);
      props.setGraph(newGraph);

      props.setFormVisibility(false);
      reset();
   }

   let display = props.showForm ? "block" : "none";
   return (
      <div style={{display: display}}>
      <div style={FORMBACKGROUND}>
      <div style={FORMSTYLE}>
      <h1 style={props.titleStyle}>{props.title}</h1>
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
      </div>
      </div>
      </div>
   )
}

export default Form;

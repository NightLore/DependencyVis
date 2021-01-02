import React from 'react'
import { 
   createCentralNode, 
   lookupNewGraph
} from './d3/d3utils'
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
   const [dbOption, setDBOption] = useState(true);

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

      let mainId = username + "/" + repo;
      console.log("SUBMIT", mainId);

      let newGraph = {
         nodes: [createCentralNode(mainId, username, repo, props.options)],
         links: []
      }

      newGraph = await lookupNewGraph(
         userInfo, mainId,
         newGraph, props.options,
         props.setErrorText);
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
         <br/>
         <label>
            Use MongoDB Database: 
            <input
               type="checkbox"
               name="dbOption"
               checked={dbOption}
               onChange={event => setDBOption(event.target.checked)}
            />
         </label>
      </form>
      </div>
      </div>
      </div>
   )
}

export default Form;

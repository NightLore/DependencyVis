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
   const [org, setOrg] = useState('');
   const [repo, setRepo] = useState('');
   const [folder, setFolder] = useState('');
   const [dbOption, setDBOption] = useState(true);

   var reset = () => {
      setOrg('');
      setRepo('');
      setFolder('');
      props.setErrorText('');
   }

   var handleSubmit = async (o, r, f='') => {
      var userInfo = {
         username: o,
         repo: r,
         folder: f
      };

      console.log("SUBMIT", userInfo);

      props.setGraph(
         await lookupNewGraph(userInfo, props.options, props.setErrorText)
      );

      props.setFormVisibility(false);
      reset();
   }

   var checkURL = () => {
      const urlQuerry = new URLSearchParams(window.location.search); 
      const o = urlQuerry.get('org');
      const r = urlQuerry.get('repo');
      if (o && r && props.showForm) {
         handleSubmit(o, r);
      }
   }

   checkURL();
   let display = props.showForm ? "block" : "none";
   return (
      <div style={{display: display}}>
      <div style={FORMBACKGROUND}>
      <div style={FORMSTYLE}>
      <h1 style={props.titleStyle}>{props.title}</h1>
      <form onSubmit={event => {event.preventDefault(); handleSubmit(org, repo, folder);}}>
         <input
            type="text"
            value={org}
            onChange={event => setOrg(event.target.value)}
            placeholder="GitHub organization"
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

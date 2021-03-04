import React from 'react';
import './css/Form.css';
import { lookupNewGraph } from './utils/d3';
const { useState } = React;

const Form = props => {
   const [owner, setOrg] = useState('');
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
   var handleSubmitEvent = event => {
      event.preventDefault(); 
      handleSubmit(owner, repo, folder);
   }

   var checkURL = () => {
      const urlQuerry = new URLSearchParams(window.location.search); 
      const o = urlQuerry.get('owner');
      const r = urlQuerry.get('repo');
      if (o && r && props.showForm) {
         handleSubmit(o, r);
      }
   }

   checkURL();
   return (
      <div style={{display: props.showForm ? "block" : "none"}}>
      <div id='form_background'>
      <div id='form'>
      <h1 id='form_title'>{"DependencyVis"}</h1>
      <form onSubmit={handleSubmitEvent}>
         <input
            type="text"
            value={owner}
            onChange={event => setOrg(event.target.value)}
            placeholder="GitHub owner"
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
            Use own database? 
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

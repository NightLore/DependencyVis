import React from 'react';
import './App.css';
import dotenv from 'dotenv';
import Graph from './d3/Graph';
import Sidebar from './Sidebar';
import Form from './Form';
import { search } from './AxiosUtils';

dotenv.config();
console.log(process.env);
const { useState } = React;

const TITLE = "DependencyVis"
const TITLESTYLE = {
   fontSize: "4em",
   fontStyle: "italic",
   textAlign: "center",
   color: "rgb(75, 35, 92)",
}

const ERRORSTYLE = {
   zIndex: "10",

   // font
   color:"red", 
   fontSize: "2em",
   fontWeight: "bold",

   // center on page 
   position: "absolute",
   margin: "auto",
   width: "fit-content",
   left: "50%",
   top: "50%",
   transform: "translate(-50%, -50%)",
}

const ErrorText = props => {
   return (<span style={ERRORSTYLE}>{props.text}</span>)
}

const App = () => {
   const [nodes, setNodes] = useState([]);
   const [links, setLinks] = useState([]);
   const [nodesChanged, setNodesChanged] = useState(false);
   const [showForm, setFormVisibility] = useState(true);
   const [errorText, setErrorText] = useState('');

   let setNodesLinks = (newNodes, newLinks) => {
      setNodes(newNodes);
      setLinks(newLinks);
      setNodesChanged(true);
      console.log("Nodes set", nodes, links);
   }

   var querrySearch = async querry => {
      console.log("App Click ", querry);

      let querryResp = await search(querry);
      if (querryResp.error) {setErrorText("Failed search!"); return;}

      console.log("Response Search:", querryResp);
      return querryResp.resp;
   }

   return (
      <div>
         <Form 
            title={TITLE}
            titleStyle={TITLESTYLE}
            setNodesLinks={setNodesLinks}
            setErrorText={setErrorText}
            showForm={showForm}
            setFormVisibility={setFormVisibility}
         />
         <ErrorText 
            text={errorText}
         />
         <Sidebar 
            nodes={nodes} 
            links={links}
         />
         <Graph 
            nodes={nodes} 
            links={links}
            nodesChanged={nodesChanged}
            setNodesChanged={setNodesChanged}
            setNodesLinks={setNodesLinks}
            search={querrySearch}
         />
      </div>
   )
}

export default App;

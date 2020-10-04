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
   // defaults set to be examples of the format
   const [nodes, setNodes] = useState([
      {id: "lion", group: 1, radius: 5},
      {id: "roar", group: 1, radius: 9},
      {id: "absurdlylongname", group: 2, radius: 5},
      {id: "4", group: 2, radius: 9},
      {id: "5", group: 3, radius: 5},
      {id: "test20", group: 3, radius: 9},
   ]);
   const [links, setLinks] = useState([
      {source: "lion", target: "roar", value: 1},
      {source: "roar", target: "absurdlylongname", value: 1},
      {source: "absurdlylongname", target: "4", value: 1},
      {source: "4", target: "5", value: 1},
      {source: "lion", target: "test20", value: 1},
   ]);
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
            search={querrySearch}
         />
      </div>
   )
}

export default App;

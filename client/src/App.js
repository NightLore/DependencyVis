import React from 'react';
import './App.css';
import dotenv from 'dotenv';
import Graph from './d3/Graph';
import Sidebar from './Sidebar';
import Form from './Form';
import Axios from './AxiosHelpers';

dotenv.config();
console.log(process.env);
const { useState } = React;

const ErrorText = props => {
   return (<span style={{color:"red", margin: "1em"}}>{props.text}</span>)
}

const App = () => {
   const [cards, setCards] = useState([])
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
   const [errorText, setErrorText] = useState('');

   let setNodesLinks = (newNodes, newLinks) => {
      setNodes(newNodes);
      setLinks(newLinks);
      setNodesChanged(true);
      console.log("Nodes set", nodes, links);
   }

   var addNewCard = cardInfo => {
      setCards(cards.concat(cardInfo))
   }

   var search = async querry => {
      console.log("App Click ", querry);

      let querryResp = await Axios.search(querry);
      if (querryResp.error) {setErrorText("Failed search!"); return querryResp;}

      console.log("Response Search:", querryResp);
      return querryResp.resp.data;
   }

   return (
      <div>
         <Form 
            onSubmit={addNewCard} 
            setNodesLinks={setNodesLinks}
            setErrorText={setErrorText}
         />
         <ErrorText 
            text={errorText}
         />
         <div>
         <Sidebar 
            nodes={nodes} 
            links={links}
         />
         <Graph 
            nodes={nodes} 
            links={links}
            nodesChanged={nodesChanged}
            setNodesChanged={setNodesChanged}
            search={search}
         />
         </div>
      </div>
   )
}

export default App;

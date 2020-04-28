import React from 'react';
import axios from 'axios';
import './App.css';
import dotenv from 'dotenv';
import Graph from './Graph';

dotenv.config();
console.log(process.env);
console.log(process.env.REACT_APP_PASSWORD);

const { useState } = React;

const Card = props => {
   console.log("New Card: ", props);
   
   return (
      <div style={{ margin: '1em' }}>
      <div>
         <div style={{ fontWeight: 'bold' }}>Repo name: {props.username}/{props.repo}</div>
         <div>Fork count: {props.forks_count}</div>
         <div>Star count: {props.stargazers_count}</div>
         <div>Watcher count: {props.watchers_count}</div>
         <div>Size: {props.size}</div>
         <div>Num of Open Issues: {props.open_issues_count}</div>
         <div>License: {props.license ? props.license.name : "None"}</div>
         <div>Is private: {props.private ? "true" : "false"}</div>
         <div>Visibility: {props.visibility}</div>
         <div>Subscribers: {props.subscribers_count}</div>
         <div>package.json: {JSON.stringify(props.dependencies)}</div>
      </div>
      </div>
)
}

const CardList = props => <div>{props.cards.map(card => <Card {...card} />)}</div>

const Form = props => {
   const [username, setUsername] = useState('')
   const [repo, setRepo] = useState('')
   const [folder, setFolder] = useState('')

   var handleSubmit = async event => {
      event.preventDefault()
      var cardInfo;
      var userInfo = {
         username: username,
         repo: repo,
         folder: folder
      };

      console.log("SUBMIT");

      let mainId = username + "/" + repo;
      let nodes = [
         {id: mainId, color: "blue", radius: 10}
      ]
      let links = []

      axios.post('http://localhost:3001/lookup', userInfo)
         .then(resp => {
            cardInfo = resp.data;
            if (resp) {
               resp.data.dependencies.forEach((value, index, array) => {
                  nodes.push({id: value.name, color: "orange", radius: 8});
                  links.push({source: mainId, target: value.name, value: 5});
               });
               
               props.onSubmit(cardInfo);
               props.setNodesLinks(nodes, links);
               setUsername('');
               setRepo('');
            }
            console.log("Card Info Response", cardInfo);
         }).catch(err => {console.error(err);});

   }

   return (
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
         <button type="submit">Display</button>
         <input
            type="text"
            value={folder}
            onChange={event => setFolder(event.target.value)}
            placeholder="optional specified folder"
         />
      </form>
   )
}

const App = () => {
   const [cards, setCards] = useState([])
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

   let setNodesLinks = (newNodes, newLinks) => {
      setNodes(newNodes);
      setLinks(newLinks);
      setNodesChanged(true);
      console.log("Nodes set", nodes, links);
   }

   var addNewCard = cardInfo => {
      setCards(cards.concat(cardInfo))
   }

   return (
      <div>
         <Graph 
            nodes={nodes} 
            links={links}
            nodesChanged={nodesChanged}
            setNodesChanged={setNodesChanged}/>
         <Form onSubmit={addNewCard} 
            setNodesLinks={setNodesLinks}/>
         <CardList cards={cards} />
      </div>
   )
}

export default App;

import React from 'react';
import axios from 'axios';
import './App.css';
import dotenv from 'dotenv';
import Graph from './Graph';
import NodeGraph from './NodeGraph';
import BarGraph from './BarGraph';

dotenv.config();
console.log(process.env);
console.log(process.env.REACT_APP_PASSWORD);

let nodes = [
   {id: "lion", group: 1, radius: 5},
   {id: "roar", group: 1, radius: 9},
   {id: "absurdlylongname", group: 2, radius: 5},
   {id: "4", group: 2, radius: 9},
   {id: "5", group: 3, radius: 5},
   {id: "test20", group: 3, radius: 9},
];
let links = [
   {source: "lion", target: "roar", value: 1},
   {source: "roar", target: "absurdlylongname", value: 1},
   {source: "absurdlylongname", target: "4", value: 1},
   {source: "4", target: "5", value: 1},
   {source: "lion", target: "test20", value: 1},
];

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

   var handleSubmit = async event => {
      event.preventDefault()
      var cardInfo;
      var userInfo = {
         username: username,
         repo: repo
      };
      console.log("SUBMIT");

      axios.post('http://localhost:3001/lookup', userInfo)
         .then(resp => {
            cardInfo = resp.data;
            if (resp) {
               props.onSubmit(cardInfo);
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
         <button type="submit">Add card</button>
      </form>
   )
}

const App = () => {
   const [cards, setCards] = useState([])

   var addNewCard = cardInfo => {
      setCards(cards.concat(cardInfo))
   }

   return (
      <div>
         <Graph nodes={nodes} links={links}/>
         <NodeGraph/>
         <BarGraph/>
         <Form onSubmit={addNewCard} />
         <CardList cards={cards} />
      </div>
   )
}

export default App;

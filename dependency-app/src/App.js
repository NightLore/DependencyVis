import React from 'react';
import axios from 'axios';
import './App.css';

const { useState } = React

const Card = props => {
   console.log("Card");
   var dependency = JSON.parse(atob(props["dependency"].content));
   var srctree = props["srctree"];
   props = props["info"];
   console.log(dependency);
   console.log(props);
   console.log(srctree);
   return (
      <div style={{ margin: '1em' }}>
      <div>
         <div style={{ fontWeight: 'bold' }}>Repo name: {props.full_name}</div>
         <div>Fork count: {props.forks_count}</div>
         <div>Star count: {props.stargazers_count}</div>
         <div>Watcher count: {props.watchers_count}</div>
         <div>Size: {props.size}</div>
         <div>Num of Open Issues: {props.open_issues_count}</div>
         <div>Created: {props.created_at}</div>
         <div>Updated: {props.updated_at}</div>
         <div>Pushed: {props.pushed_at}</div>
         <div>License: {props.license ? props.license.name : "None"}</div>
         <div>Is private: {props.private ? "true" : "false"}</div>
         <div>Visibility: {props.visibility}</div>
         <div>Subscribers: {props.subscribers_count}</div>
         <div>package.json: {JSON.stringify(dependency.dependencies)}</div>
      </div>
      </div>
)
}

const CardList = props => <div>{props.cards.map(card => <Card {...card} />)}</div>

async function axiosGet(url) {
   return axios.get(url).then(resp => resp.data);
}

const extractPackageJson = srctree => {
   
}

const Form = props => {
   const [username, setUsername] = useState('')
   const [repo, setRepo] = useState('')

   var handleSubmit = async event => {
      event.preventDefault()
      var cardInfo = {};
      console.log("SUBMIT");

      cardInfo["name"] = `${username}/${repo}`;
      cardInfo["info"] = await axiosGet(`https://api.github.com/repos/${username}/${repo}`);
      console.log("Info");
      console.log(cardInfo["info"]);

      cardInfo["srctree"] = await axiosGet(`https://api.github.com/repos/${username}/${repo}/git/trees/master`);
      console.log("srctree");
      console.log(cardInfo["srctree"]);

      cardInfo["dependency"] = await axiosGet(`https://api.github.com/repos/${username}/${repo}/contents/package.json`);
      console.log("dependency");
      console.log(cardInfo["dependency"]);

      props.onSubmit(cardInfo)
      setUsername('');
      setRepo('');
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
   <Form onSubmit={addNewCard} />
         <CardList cards={cards} />
       </div>
  )
}

export default App;

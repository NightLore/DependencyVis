import React from 'react';
import axios from 'axios';
import './App.css';

const { useState } = React

const Card = (props, dependency) => {
  console.log("Card");
  console.log(dependency);
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
        <div>package.json: {dependency.content}</div>
      </div>
    </div>
  )
}

const CardList = props => <div>{props.cards.map(card => <Card {...card} />)}</div>

const Form = props => {
  const [username, setUsername] = useState('')
  const [repo, setRepo] = useState('')

  var handleSubmit = event => {
    event.preventDefault()
    var cardInfo;
    var dependency;
    console.log("SUBMIT");

    axios
      .get(`https://api.github.com/repos/${username}/${repo}`)
      .then(resp => {
	cardInfo = resp.data;
	console.log("Got info");
	console.log(cardInfo);
	if (dependency) {
	  //props.onSubmit(cardInfo, dependency)
          //setUsername('');
          //setRepo('');
        }
      });
    axios
      .get(`https://api.github.com/repos/${username}/${repo}/contents/package.json`)
      .then(resp => {
	console.log("Got dependency");
	dependency = resp.data;
	console.log(dependency);
	console.log(dependency.content);
	console.log(atob(dependency.content));
	//dependency = JSON.parse(dependency.content);
	if (cardInfo) {
	  props.onSubmit(cardInfo, dependency)
          setUsername('');
          setRepo('');
	  cardInfo = false;
	  dependency = false;
        }
      });
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

  var addNewCard = (cardInfo, dependency) => {
    setCards(cards.concat(cardInfo, dependency))
  }

  return (
    <div>
      <Form onSubmit={addNewCard} />
      <CardList cards={cards} />
    </div>
  )
}

export default App;

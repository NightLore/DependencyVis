import ReactDOM from 'react-dom';
import React from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

const { useState } = React

const Card = props => {
  return (
    <div style={{ margin: '1em' }}>
      <img alt="avatar" style={{ width: '70px' }} src={props.avatar_url} />
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

    axios
      .get(`https://api.github.com/repos/${username}/${repo}`)
      .then(resp => {
        props.onSubmit(resp.data)
        setUsername('')
        setRepo('')
      })
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

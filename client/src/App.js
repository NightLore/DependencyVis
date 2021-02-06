import React from 'react';
import './css/App.css';
import Graph from './d3/Graph';
import Sidebar from './Sidebar';
import Form from './Form';
import ColorLegend from './ColorLegend';
import OptionsPane from './OptionsPane';
import ButtonPane from './ButtonPane';
import AddPane from './AddPane';
import ErrorText from './ErrorText';

const { useState } = React;
const App = () => {
   const [nodes, setNodes] = useState([]);
   const [links, setLinks] = useState([]);
   const [nodesChanged, setNodesChanged] = useState(false);
   const [showForm, setFormVisibility] = useState(true);
   const [errorText, setErrorText] = useState('');
   const [dbOption, setDBOption] = useState(true);
   const [loadAheadOption, setLoadAheadOption] = useState(true);
   const [colorOption, setColorOption] = useState('loaded');
   const [sizeOption, setSizeOption] = useState('nothing');

   const setGraph = graph  => {
      if (graph) {
         if (graph.nodes)
            setNodes(graph.nodes);
         if (graph.links)
            setLinks(graph.links);
      }
      setNodesChanged(true);
   }

   const handleColorOption = option => {
      setColorOption(option);
      setNodesChanged(true);
   }

   const handleSizeOption = option => {
      setSizeOption(option);
      setNodesChanged(true);
   }

   let options = {
      mongodb: dbOption,
      loadAhead: loadAheadOption,
      color: colorOption,
      size: sizeOption
   };
   console.log("options", options);
   return (
      <div id="App">
         <Form 
            setGraph={setGraph}
            setErrorText={setErrorText}
            showForm={showForm}
            setFormVisibility={setFormVisibility}
            setDBOption={setDBOption}
            options={options}
         />
         <ErrorText 
            text={errorText}
         />
         <Sidebar 
            nodes={nodes} 
            links={links}
         />
         <div className='top-right'>
            <ColorLegend
               colorOption={colorOption}
            />
            <OptionsPane 
               options={options}
               setColorOption={handleColorOption}
               setSizeOption={handleSizeOption}
            />
         </div>
         <AddPane
            nodes={nodes}
            links={links}
            setGraph={setGraph}
            options={options}
            setErrorText={setErrorText}
         />
         <ButtonPane
            nodes={nodes}
            links={links}
            setGraph={setGraph}
            options={options}
            setErrorText={setErrorText}
         />
         <Graph 
            nodes={nodes} 
            links={links}
            nodesChanged={nodesChanged}
            setNodesChanged={setNodesChanged}
            setGraph={setGraph}
            setErrorText={setErrorText}
            options={options}
         />
      </div>
   )
}

export default App;

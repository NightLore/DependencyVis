import React from 'react';
import './App.css';
import Graph from './d3/Graph';
import Sidebar from './Sidebar';
import Form from './Form';
import ColorLegend from './ColorLegend';
import OptionsPane from './OptionsPane';
import ButtonPane from './ButtonPane';
import ErrorText from './ErrorText';

const { useState } = React;

const TITLE = "DependencyVis"
const TITLESTYLE = {
   fontSize: "4em",
   fontStyle: "italic",
   textAlign: "center",
   color: "rgb(75, 35, 92)",
}

const TOP_RIGHT_STYLE = {
   position: "absolute",
   top: "0px",
   right: "0px",
   display: "flex",
}

const App = () => {
   const [nodes, setNodes] = useState([]);
   const [links, setLinks] = useState([]);
   const [nodesChanged, setNodesChanged] = useState(false);
   const [showForm, setFormVisibility] = useState(true);
   const [errorText, setErrorText] = useState('');
   const [colorOption, setColorOption] = useState('loaded');
   const [sizeOption, setSizeOption] = useState('nothing');

   const setGraph = graph  => {
      if (graph.nodes)
         setNodes(graph.nodes);
      if (graph.links)
         setLinks(graph.links);
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
      color: colorOption,
      size: sizeOption
   };
   console.log("options", options);
   return (
      <div>
         <Form 
            title={TITLE}
            titleStyle={TITLESTYLE}
            setGraph={setGraph}
            setErrorText={setErrorText}
            showForm={showForm}
            setFormVisibility={setFormVisibility}
            options={options}
         />
         <ErrorText 
            text={errorText}
         />
         <Sidebar 
            nodes={nodes} 
            links={links}
         />
         <div style={TOP_RIGHT_STYLE}>
            <ColorLegend
               colorOption={colorOption}
            />
            <OptionsPane 
               options={options}
               setColorOption={handleColorOption}
               setSizeOption={handleSizeOption}
            />
         </div>
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

   //position: "absolute",
export default App;

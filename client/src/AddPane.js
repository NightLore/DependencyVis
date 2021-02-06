import React, { Component } from 'react';
import './css/AddPane.css'
import HideButton, { TRANSFORMS } from './HideButton';
import { searchNewGraph } from './d3/d3utils';

class AddPane extends Component {
   constructor(props) {
      super(props);
      this.state = {
         isHidden: false
      };
   }
   setHidden = hidden => {this.setState({isHidden: hidden})};

   async addDependency(graph, node) {
      console.log("add dependency", graph);
      let newGraph = {
         nodes: [].concat(graph.nodes), 
         links: [].concat(graph.links)
      };

      console.log("searching...", newGraph);
      let ng = await searchNewGraph(node, newGraph, 
         this.props.options, 
         this.props.setErrorText
      );
      if (ng) newGraph = ng;
      this.props.setGraph(newGraph);
   }

   render() {
      let style = {};
      if (this.state.isHidden)
         style.transform = TRANSFORMS.UP;

      let graph = {
         nodes: this.props.nodes,
         links: this.props.links
      };

      return (
         <div id="add-pane" style={style}>
            <form onSubmit={this.addDependency}>
               <input
                  type='text'
                  onChange={event => {}}
                  placeholder="Try a dependency here"
                  required
               />
               <button type='submit'>Add</button>
            </form>
            <HideButton
               isHidden={this.state.isHidden}
               setHidden={this.setHidden}
               direction={"up"}
            />
         </div>
      );

   }
}

export default AddPane;

import React, { Component } from 'react';
import './css/ButtonPane.css'
import HideButton, { TRANSFORMS } from './HideButton';
import { searchNewGraph } from './utils/d3';

class ButtonPane extends Component {
   constructor(props) {
      super(props);
      this.state = {
         isHidden: false
      };
   }
   setHidden = hidden => {this.setState({isHidden: hidden})};

   async loadNextLayer(graph) {
      console.log("loading next layer:", graph);
      let newGraph = {
         nodes: [].concat(graph.nodes), 
         links: [].concat(graph.links)
      };

      console.log("searching...", newGraph);
      // TODO: parallelism? Promise.all(map(...
      for (const node of graph.nodes) {
         console.log("single search params", node, newGraph);
         if (node.clicked) continue;
         let ng = await searchNewGraph(node, newGraph, 
            this.props.options, 
            this.props.setErrorText
         );
         if (ng) newGraph = ng;
      }
      console.log("searched all", newGraph);
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
         <div id="button-pane" style={style}>
            <button type="button" onClick={e => this.loadNextLayer(graph)}>Load Next Layer</button>
            <HideButton
               isHidden={this.state.isHidden}
               setHidden={this.setHidden}
               direction={"down"}
            />
         </div>
      );

   }
}

export default ButtonPane;

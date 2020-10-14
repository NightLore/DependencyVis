import React, { Component } from 'react';
import HideButton, { TRANSFORMS } from './HideButton';
import { searchNewGraph } from './d3/d3utils';

const STYLE = {
   position: "absolute",
   padding: "0px 2px 2px 2px",
   margin: "1px auto auto auto",
   zIndex: 4,
   left: 0,
   right: 0,
   width: "fit-content",
   backgroundColor: "lightsteelblue"
}

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
         if (!node.clicked)
            newGraph = await searchNewGraph(node, newGraph, this.props.options, this.props.setErrorText);
         console.log("single search", node, newGraph);
      }
      console.log("searched all", newGraph);
      this.props.setGraph(newGraph);
   }

   render() {
      let style = Object.assign({}, STYLE);
      if (this.state.isHidden)
         style.transform = TRANSFORMS.UP;

      let graph = {
         nodes: this.props.nodes,
         links: this.props.links
      };
      return (
         <div style={style}>
            <button type="button" onClick={e => this.loadNextLayer(graph)}>Load Next Layer</button>
         </div>
      )

      /*
      return (
         <div style={style}>
            <button type="button">Load Next Layer</button>
            <HideButton
               isHidden={this.state.isHidden}
               setHidden={this.setHidden}
               direction={"down"}
            />
         </div>
      )
      */

   }
}

export default ButtonPane;

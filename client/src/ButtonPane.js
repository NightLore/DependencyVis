import React, { Component } from 'react';
import HideButton, { TRANSFORMS } from './HideButton';

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
   loadNextLayer() {
      console.log("loading next layer:", this.props.nodes);
   }

   render() {
      let style = Object.assign({}, STYLE);
      if (this.state.isHidden)
         style.transform = TRANSFORMS.UP;

      return (
         <div style={style}>
            <button type="button" onClick={e => this.loadNextLayer()}>Load Next Layer</button>
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

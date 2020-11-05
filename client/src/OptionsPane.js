import React, { Component } from 'react'
import HideButton, { TRANSFORMS } from './HideButton'
import OPTIONS, { createHandlers } from './Options'

const PANE_TITLE = "Options";

// -------------- Styles ------------- //
const STYLE = {
   margin: "1px",
   padding: "0.5em 1em 1em 1em",
   position: "absolute",
   zIndex: "4",
   top: "0px",
   right: "0px",
   width: "fit-content",
   height: "fit-content",
   backgroundColor: "lightsteelblue",
}

const PANE_TITLE_STYLE = {
   margin: "0px",
   textAlign: "center",
   fontWeight: "bold",
   fontStyle: "italic",
   fontSize: "large",
}

const HEADER_STYLE = {
   margin: "0.5em 0 0 0",
   fontWeight: "bold"
}

const BUTTON_STYLE = {
   margin: 0
}

const TOOLTIP_STYLE = {
}

// -------------- Tooltip ------------- //



// -------------- Radio Button ------------- //

const RadioButton = props => {
   return (
      <p style={BUTTON_STYLE}>
      <label>
         <input 
            type="radio" 
            id={props.name}
            name={props.group}
            value={props.name}
            checked={props.option === props.name}
            onChange={props.handler}
         />
         {props.contents}
      </label>
      </p>
   )
}

// -------------- Options Pane ------------- //

class OptionsPane extends Component {
   constructor(props) {
      super(props);
      this.state = {
         isHidden: false
      };
   }
   setHidden = hidden => {this.setState({isHidden: hidden})};
   handlers = createHandlers(this.props);

   render() {
      let style = Object.assign({}, STYLE);
      if (this.state.isHidden)
         style.transform = TRANSFORMS.UP;

      // set pane title
      let toRender = [(
         <p key={"pane_title"} 
            style={PANE_TITLE_STYLE}>
            {PANE_TITLE}
         </p>
      )];

      OPTIONS.forEach((opt, index) => {
         // push option's title element
         toRender.push(
            <p key={index}
               style={HEADER_STYLE}>
               {opt.TITLE}
            </p>
         );

         // push options
         opt.CHOICES.forEach(choice => {
            toRender.push(
               <RadioButton
                  key={index + choice.NAME}
                  name={choice.NAME}
                  group={opt.TITLE}
                  contents={choice.DISPLAY}
                  option={this.props.options[opt.ID]}
                  handler={this.handlers[opt.ID]}
               />
            );
         });
      });

      return (
         <div style={style}>
            {toRender}
            <HideButton
               isHidden={this.state.isHidden}
               setHidden={this.setHidden}
               direction={"down"}
            />
         </div>
      );
   }
}

export default OptionsPane;

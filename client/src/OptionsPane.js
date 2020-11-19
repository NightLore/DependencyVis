import React, { Component } from 'react'
import HideButton, { TRANSFORMS } from './HideButton'
import OPTIONS, { createHandlers } from './Options'

const PANE_TITLE = "Options";

// -------------- Styles ------------- //
const STYLE = {
   margin: "1px",
   padding: "0.5em 1em 1em 1em",
   zIndex: "4",
   position: "relative",
   width: "fit-content",
   height: "fit-content",
   backgroundColor: "lightsteelblue",
   display: "inline-block"
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

const TOOLTIP_COLOR = "#555";
const TOOLTIP_ARROW_SIZE = "5px";
const TOOLTIP_STYLE = ""
 + "\n.tooltip {"
 + "\n   position: relative;"
 + "\n}"
 + "\n"
 + "\n.tooltip .tooltiptext {"
 + "\n   visibility: hidden;"
 + "\n   background-color: " + TOOLTIP_COLOR + ";"
 + "\n   color: #fff;"
 + "\n   text-align: center;"
 + "\n   border-radius: 6px;"
 + "\n   padding: 0 " + TOOLTIP_ARROW_SIZE + " " + TOOLTIP_ARROW_SIZE + " " + TOOLTIP_ARROW_SIZE + ";"
 + "\n"
 + "\n   position: absolute;"
 + "\n   z-index: 11;"
 + "\n   top: 0%;"
 + "\n   right: 105%;"
 + "\n   opacity: 0;"
 + "\n   transition: opacity 0.3s;"
 + "\n   width: fit-content;"
 + "\n}"
 + "\n"
 + "\n.tooltip .tooltiptext::after {"
 + "\n   content: \"\";"
 + "\n   position: absolute;"
 + "\n   top: 10px;"
 + "\n   left: 100%;"
 + "\n   margin-top: -" + TOOLTIP_ARROW_SIZE + ";"
 + "\n   border-width: " + TOOLTIP_ARROW_SIZE + ";"
 + "\n   border-style: solid;"
 + "\n   border-color: transparent transparent transparent " + TOOLTIP_COLOR + ";"
 + "\n}"
 + "\n"
 + "\n.tooltip:hover .tooltiptext {"
 + "\n   visibility: visible;"
 + "\n   opacity: 1;"
 + "\n}"
 + "\n"
 + "\n";



// -------------- Radio Button ------------- //

const RadioButton = props => {
   return (
      <p className={"tooltip"} style={BUTTON_STYLE}>
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
      <span className={"tooltiptext"}>{props.tooltip}</span>
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
            <style key={"style"}>
               {TOOLTIP_STYLE}
            </style>
         ), (
            <p key={"pane_title"} 
               style={PANE_TITLE_STYLE}>
               {PANE_TITLE}
            </p>
         )
      ];

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
                  tooltip={choice.TOOLTIP}
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

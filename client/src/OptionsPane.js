import React, { Component } from 'react'

// -------------- Styles ------------- //
const STYLE = {
   margin: "1px",
   padding: "0.5em 1em 1em 1em",
   position: "absolute",
   zIndex: "4",
   top: "0px",
   right: "0px",
   width: "fit-contents",
   height: "fit-contents",
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

// -------------- Option helpers ------------- //

function createOption(title, choices) {
   return {
      ID: title.toLowerCase(),
      TITLE: title,
      CHOICES: choices,
      SETTER: "set" + title + "Option"
   };
}

function createChoice(name, displayName) {
   return {
      NAME: name,
      DISPLAY: displayName
   };
}

function createHandlers(props) {
   let handlers = {}
   OPTIONS.forEach(opt => {
      handlers[opt.ID] = e => {
         console.log("selected", e.target.value);
         props[opt.SETTER](e.target.value);
      };
   });
   return handlers;
}

// -------------- Option Constants -------------- //
const PANE_TITLE = "Options";

const OPTIONS = [
   createOption("Color", [
      createChoice("loaded", "Load Status"),
      createChoice("audit", "Audit")
   ]),
   createOption("Size", [
      createChoice("nothing", "Nothing"),
      createChoice("stars", "Stars")
   ]),
];

// -------------- Options Pane ------------- //

class OptionsPane extends Component {
   handlers = createHandlers(this.props);

   render() {
      // set pane title
      let toRender = [(
         <p style={PANE_TITLE_STYLE}>{PANE_TITLE}</p>
      )];

      OPTIONS.forEach((opt, index) => {
         // push option's title element
         toRender.push(
            <p style={HEADER_STYLE}>{opt.TITLE}</p>
         );

         // push options
         opt.CHOICES.forEach(choice => {
            toRender.push(
               <RadioButton
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
         <div style={STYLE}>
            {toRender}
         </div>
      );
   }
}

export default OptionsPane;

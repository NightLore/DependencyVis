import React, { Component } from 'react';
import './css/OptionsPane.css';
import HideButton, { TRANSFORMS } from './HideButton';
import OPTIONS, { createHandlers } from './Options';

const PANE_TITLE = "Options";

// -------------- Styles ------------- //

const TOOLTIP_COLOR = "#555";
const TOOLTIP_TEXT_COLOR = "#fff";
const TOOLTIP_ARROW_SIZE = "5px";
const TOOLTIP_STYLE = ""
 + "\n.options-tooltip .options-tooltiptext {"
 + `\n   background-color: ${TOOLTIP_COLOR};`
 + `\n   color: ${TOOLTIP_TEXT_COLOR};`
 + `\n   padding: 0 ${TOOLTIP_ARROW_SIZE} ${TOOLTIP_ARROW_SIZE} ${TOOLTIP_ARROW_SIZE};`
 + "\n"
 + "\n   top: 0%;"
 + "\n   right: 105%;"
 + "\n}"
 + "\n"
 + "\n.options-tooltip .options-tooltiptext::after {"
 + "\n   top: 10px;"
 + "\n   left: 100%;"
 + `\n   margin-top: -${TOOLTIP_ARROW_SIZE};`
 + `\n   border-width: ${TOOLTIP_ARROW_SIZE};`
 + `\n   border-color: transparent transparent transparent ${TOOLTIP_COLOR};`
 + "\n}"
 + "\n";

// -------------- Radio Button ------------- //

const RadioButton = props => {
   return (
      <p className={'options-tooltip options-choice'}>
      <label>
         <input 
            type='radio' 
            id={props.name}
            name={props.group}
            value={props.name}
            checked={props.option === props.name}
            onChange={props.handler}
         />
         {props.contents}
      </label>
      <span className={'options-tooltiptext'}>{props.tooltip}</span>
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
      let style = {};
      if (this.state.isHidden)
         style.transform = TRANSFORMS.UP;

      // set pane title
      let toRender = [(
            <style key={'style'}>
               {TOOLTIP_STYLE}
            </style>
         ), (
            <p key={'pane_title'}
               className={'options-title'}>
               {PANE_TITLE}
            </p>
         )
      ];

      OPTIONS.forEach((opt, index) => {
         // push option's title element
         toRender.push(
            <p key={index}
               className={'options-header'}>
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
         <div id={'options'} style={style}>
            {toRender}
            <HideButton
               isHidden={this.state.isHidden}
               setHidden={this.setHidden}
               direction={'down'}
            />
         </div>
      );
   }
}

export default OptionsPane;

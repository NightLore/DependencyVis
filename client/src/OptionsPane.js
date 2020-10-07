import React, { Component } from 'react'

const STYLE = {
   margin: "1px",
   padding: "1em",
   position: "absolute",
   zIndex: "4",
   top: "0px",
   right: "0px",
   width: "fit-contents",
   height: "fit-contents",
   backgroundColor: "lightsteelblue",
}

const HSTYLE = {
   margin: "0px",
   fontWeight: "bold"
}

const PSTYLE = {
   margin: "0px"
}

const RadioButton = props => {
   return (
      <p style={PSTYLE}>
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

class OptionsPane extends Component {

   handleColorOption = e => {
      console.log("selected", e.target.value);
      this.props.setColorOption(e.target.value);
   }

   render() {
      return (
         <div style={STYLE}>
            <p style={HSTYLE}>Options:</p>

            <RadioButton
               name="loaded"
               group="colorOption"
               contents="Loaded"
               option={this.props.colorOption}
               handler={this.handleColorOption}
            />

            <RadioButton
               name="audit"
               group="colorOption"
               contents="Audit"
               option={this.props.colorOption}
               handler={this.handleColorOption}
            />
         </div>
      )
   }
}

export default OptionsPane;

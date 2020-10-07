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

class OptionsPane extends Component {
   render() {
      return (
         <div style={STYLE}>
            <p style={HSTYLE}>Options:</p>

            <p style={PSTYLE}>
            <label>
               <input 
                  type="radio" 
                  id="loaded" 
                  name="option" 
                  value="loaded"
               />
               Loaded
            </label>
            </p>

            <p style={PSTYLE}>
            <label>
               <input 
                  type="radio" 
                  id="audit" 
                  name="option" 
                  value="audit"
               />
               Audit
            </label>
            </p>
         </div>
      )
   }
}

export default OptionsPane;

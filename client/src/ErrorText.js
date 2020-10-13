import React from 'react';

const ERRORSTYLE = {
   zIndex: "10",

   // font
   color:"red", 
   fontSize: "2em",
   fontWeight: "bold",

   // center on page 
   position: "absolute",
   margin: "auto",
   width: "fit-content",
   left: "50%",
   top: "50%",
   transform: "translate(-50%, -50%)",
}

const ErrorText = props => {
   return (<span style={ERRORSTYLE}>{props.text}</span>)
}

export default ErrorText;

import React, { Component } from 'react';
import HideButton, { TRANSFORMS } from './HideButton'
import { 
   COLOR_OPTION_LOADED, 
   COLOR_OPTION_AUDIT
} from './Options'

const PANE_TITLE = "Legend";

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

const TABLE_CSS = ""
 + "\n"
 + "table {\n"
 + "  border-collapse: collapse\n"
 + "}\n\n"

 + "th {\n"
 + "  border-bottom: 1px solid black\n"
 + "}\n\n"

 + ".left-column {\n"
 + "  border-right: 1px solid black;\n"
 + "  padding-right: 0.4em\n"
 + "}\n\n"

 + ".right-column {\n"
 + "  padding-left: 0.4em\n"
 + "}\n\n"

 + ".circle {\n"
 + "  display:block;\n"
 + "  height:10px;\n"
 + "  width:10px;\n"
 + "  border-radius:50%;\n"
 + "  margin:auto;\n"
 + "  color:#fff;\n"
 + "  line-height:10px;\n"
 + "  text-align:center\n"
 + "}\n\n"

// -------------- ColorLegend ------------- //

function paragraph(key, style, text) {
   return (
      <p key={key}
         style={style}>
         {text}
      </p>
   )
}

function tableHeaders(h1, h2) {
   return (
      <thead>
      <tr>
         <th className={"left-column"}>{h1}</th>
         <th className={"right-column"}>{h2}</th>
      </tr>
      </thead>
   )
}

function tableRow(color, description, borderColor = "white") {
   return (
      <tr>
         <td className={"left-column"}>
            <span 
               className={"circle"} 
               style={{backgroundColor: color, border: "1px solid " + borderColor}}
            />
         </td>
         <td className={"right-column"}>{description}</td>
      </tr>
   )
}

class ColorLegend extends Component {
   constructor(props) {
      super(props);
      this.state = {
         isHidden: false
      };
   }
   setHidden = hidden => {this.setState({isHidden: hidden})};

   render() {
      let style = Object.assign({}, STYLE);
      if (this.state.isHidden)
         style.transform = TRANSFORMS.UP;

      let colorOption = this.props.colorOption

      // set pane title
      let toRender = [paragraph("pane_title", PANE_TITLE_STYLE, PANE_TITLE)];

      switch (colorOption) {
         case COLOR_OPTION_LOADED.NAME:
            toRender.push((<style key="style">{TABLE_CSS}</style>));
            toRender.push((
               <table key="table">
                  {tableHeaders("Node", "Status")}
                  <tbody>
                     {tableRow("blue", "Main node")}
                     {tableRow("grey", "Not Loaded")}
                     {tableRow("lightblue", "Loaded")}
                     {tableRow("white", "Failed to Load", "black")}
                  </tbody>
               </table>
            ));
            break;

         case COLOR_OPTION_AUDIT.NAME:
            toRender.push((<style key="style">{TABLE_CSS}</style>));
            toRender.push((
               <table key="table">
                  {tableHeaders("Node", "Severity")}
                  <tbody>
                     {tableRow("grey", "Not Loaded")}
                     {tableRow("white", "Failed to Load", "black")}
                     {tableRow("darkred", "Critical")}
                     {tableRow("red", "High")}
                     {tableRow("orange", "Medium")}
                     {tableRow("yellow", "Low")}
                     {tableRow("green", "No severity")}
                  </tbody>
               </table>
            ));
            break;
         default:
      }

      return (
         <div style={style}>
            {toRender}
            <HideButton
               isHidden={this.state.isHidden}
               setHidden={this.setHidden}
               direction={"down"}
            />
         </div>
      )
   }
}

export default ColorLegend;

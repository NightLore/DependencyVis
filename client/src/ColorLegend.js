import React, { Component } from 'react';
import './css/ColorLegend.css';
import HideButton, { TRANSFORMS } from './HideButton';
import licenseManager from './dataManagers/license.js';
import { 
   COLOR_OPTION_LOADED, 
   COLOR_OPTION_AUDIT,
   COLOR_OPTION_LICENSE
} from './Options'

// -------------- Different States ------------- //
//

function getLoadedLegend() {
   return (
      <table key='table' className={'colorlegend-table'}>
      {tableHeaders("Node", "Status")}
      <tbody>
         {tableRow("blue", "Main node")}
         {tableRow("grey", "Not Loaded")}
         {tableRow("lightblue", "Loaded")}
         {tableRow("white", "Failed to Load", "black")}
      </tbody>
      </table>
   );
}

function getAuditLegend() {
   return (
      <table key="table">
      {tableHeaders("Node", "Severity")}
      <tbody>
         {tableRow("grey", "Partially Loaded")}
         {tableRow("white", "Failed to Load", "black")}
         {tableRow("darkred", "Critical")}
         {tableRow("red", "High")}
         {tableRow("orange", "Medium")}
         {tableRow("yellow", "Low")}
         {tableRow("green", "No severity")}
      </tbody>
      </table>
   );
}

function getLicenseLegend() {
   const licenses = licenseManager.getAllColors();
   const display = [];
   for (const license of licenses) {
      display.push(tableRow(license.color, license.name));
   }


   return (
      <table key="table">
      {tableHeaders("Node", "License")}
      <tbody>
         {display}
      </tbody>
      </table>
   );
}

// -------------- ColorLegend ------------- //

function tableHeaders(h1, h2) {
   return (
      <thead>
      <tr>
         <th className={'colorlegend-th colorlegend-left'}>{h1}</th>
         <th className={'colorlegend-th colorlegend-right'}>{h2}</th>
      </tr>
      </thead>
   )
}

function tableRow(color, description, borderColor = 'white') {
   return (
      <tr key={color + description}>
         <td className={'colorlegend-left'}>
            <span 
               className={'colorlegend-circle'} 
               style={{backgroundColor: color, border: `1px solid ${borderColor}`}}
            />
         </td>
         <td className={'colorlegend-right'}>{description}</td>
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
      let style = {};
      if (this.state.isHidden)
         style.transform = TRANSFORMS.UP;

      let colorOption = this.props.colorOption

      // set pane title
      let toRender = [(
         <p id='colorlegend-title' key={'pane_title'}>
            {"Legend"}
         </p>
      )];

      switch (colorOption) {
         case COLOR_OPTION_LOADED.NAME:
            toRender.push(getLoadedLegend());
            break;

         case COLOR_OPTION_AUDIT.NAME:
            toRender.push(getAuditLegend());
            break;

         case COLOR_OPTION_LICENSE.NAME:
            toRender.push(getLicenseLegend());
            break;
         default:
      }

      return (
         <div id={'colorlegend'} style={style}>
            {toRender}
            <HideButton
               isHidden={this.state.isHidden}
               setHidden={this.setHidden}
               direction={'down'}
            />
         </div>
      )
   }
}

export default ColorLegend;

import React, { Component } from 'react'
import HideButton, { TRANSFORMS } from './HideButton';
import { getDocumentSize } from './utils';

const { useState } = React;

let SIDEBARSTYLE = {
   margin: "1px",
   position: "absolute",
   zIndex: "4",
   display: "inline-block", 
   backgroundColor: "lightsteelblue",
   width: 200,
   top: 0,
   bottom: 0,
}

const LISTCONTAINERSTYLE = {
   //resize: "horizontal", 
   overflow: "auto", 
   height: "-webkit-fill-available"
}

const LISTSTYLE = 
   '.caret::before {\n'
 + '  content: "\\25B6";\n' // Unicode for small right-pointing black triangle
 + '  color: black;\n'
 + '  display: inline-block;\n'
 + '  margin-right: 0.5em;\n'
 + '}\n'
 + '\n'
 + '.caret-down::before {\n'
 + '  -ms-transform: rotate(90deg);\n' /* IE 9 */
 + '  -webkit-transform: rotate(90deg);\n' /* Safari */
 + '  transform: rotate(90deg);\n'  
 + '}\n'
 + '\n'
 + '.caret {\n'
 + '  cursor: pointer;\n'
 + '  -webkit-user-select: none;\n' // Safari 3.1+
 + '  -moz-user-select: none;\n' // Firefox 2+
 + '  -ms-user-select: none;\n' // IE 10+
 + '  user-select: none;\n'
 + '  list-style-type: none;\n'
 + '}\n'
 + '\n'
 + '.bullet::before {\n'
 + '  content: "\\25AA";\n' // Unicode for small square
 + '  color: black;\n'
 + '  margin-right: 0.5em;\n'
 + '}\n'
 + '\n'
 + 'ul, .sidebar-list {\n'
 + '  margin: 0;\n'
 + '  padding-left: 0.5em;\n'
 + '  list-style-type: none\n'
 + '}\n'
 + '\n'

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

function valueToString(key, value) {
   if (!value) return "";
   let v = value;
   switch (key) {
      case 'created':
      case 'updated':
         v = value.split('T')[0];
         break;
      case 'prMeanTime':
         v = `${(value / 1000 / 60 / 60 / 24).toFixed(1)} days`;
         break;
      default:
   }
   return `${key}: ${v}`;
}

const ListNode = props => {
   const [active, setActive] = useState(false); // solely to update when clicked
   const node = props.node;
   const toggleActive = () => {node.active = !node.active; setActive(!active);}

   if (!node.details) {
      return (
         <li>
            <span className="bullet">{node.id}</span>
         </li>
      );
   }

   if (!node.active) {
      return (
         <li>
            <span className="caret" onClick={toggleActive}>{node.id}</span>
         </li>
      );
   }

   let nodeProps = Object.entries(node.details);
   let propElements = nodeProps.reduce((elements, value) => {
      const str = valueToString(value[0], value[1]);
      if (str) {
         elements.push(
            <li key={value[0]}>
               <span className="bullet">{str}</span>
            </li>
         );
      }
      return elements;
   });

   return (
      <li>
         <span className="caret caret-down" onClick={toggleActive}>{node.id}</span>
         <ul style={{marginLeft: "0.5em"}}>
            {propElements}
         </ul>
      </li>
   );

};

const CloseDropdownButton = props => {
   const closeNodes = () => {
      props.nodes.forEach(node => {
         node.active = false;
      });
      props.toggleUpdate();
   }

   return (
      <button className={"tooltip"}
         style={{
            top: "0px",
            right: "0px",
            height: "1em",
            position: "absolute", 
            translate: "translate(100%, 0%)",
         }} 
         onClick={closeNodes}>
         <span className={"tooltiptext"}>{"Close All Dropdowns"}</span>
      </button>
   );
}

class Sidebar extends Component {
   constructor(props) {
      super(props);
      this.state = {
         width: 0,
         height: 0,
         isHidden: false,
         update: false,
      };
   }

   // ---------------- helper functions ---------- //
   updateDimensions = () => {
      this.setState(getDocumentSize());
   };
   setHidden = hidden => {
      this.setState({isHidden: hidden});
   }
   toggleUpdate = () => {
      this.setState({update: !this.state.update});
   }

   // ---------------- render functions ---------- //
   componentDidMount() {
      window.addEventListener('resize', this.updateDimensions);
      this.updateDimensions();
   }

   componentWillUnmount() {
      window.removeEventListener('resize', this.updateDimensions);
   }

   render() {
      let nodes = this.props.nodes.map(
         (value, index) => <ListNode key={value.id} node={value}/>
      );
      let style = Object.assign({}, SIDEBARSTYLE);
      if (this.state.isHidden)
         style.transform = TRANSFORMS.LEFT;

      return (
         <div style={style}>
            <style>{TOOLTIP_STYLE}</style>
            <div style={LISTCONTAINERSTYLE}>
               <style>{LISTSTYLE}</style>
               <ul className='sidebar-list'>{nodes}</ul>
            </div>
            <CloseDropdownButton
               nodes={this.props.nodes}
               toggleUpdate={this.toggleUpdate}
            />
            <HideButton
               isHidden={this.state.isHidden}
               setHidden={this.setHidden}
               direction={"right"}
            />
         </div>
      )
   }
}

export default Sidebar;

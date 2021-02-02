import React, { Component } from 'react';
import './css/Sidebar.css';
import HideButton, { TRANSFORMS } from './HideButton';
import { getDocumentSize } from './utils';

const { useState } = React;

const TOOLTIP_COLOR = "#555";
const TOOLTIP_TEXT_COLOR = "#fff";
const TOOLTIP_ARROW_SIZE = "5px";
const TOOLTIP_STYLE = ""
 + "\n.sidebar-tooltip .sidebar-tooltiptext {"
 + `\n   background-color: ${TOOLTIP_COLOR};`
 + `\n   color: ${TOOLTIP_TEXT_COLOR};`
 + `\n   padding: ${TOOLTIP_ARROW_SIZE};`
 + "\n}"
 + "\n"
 + "\n.sidebar-tooltip .sidebar-tooltiptext::after {"
 + `\n   top: -${TOOLTIP_ARROW_SIZE};`
 + "\n   left: 50%;"
 + `\n   margin-top: -${TOOLTIP_ARROW_SIZE};`
 + `\n   border-width: ${TOOLTIP_ARROW_SIZE};`
 + `\n   border-color: transparent transparent ${TOOLTIP_COLOR} transparent;`
 + "\n   transform: translate(-50%, 0%);"
 + "\n}"
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
            <span className='sidebar-bullet'>{node.id}</span>
         </li>
      );
   }

   if (!node.active) {
      return (
         <li>
            <span className='sidebar-caret' onClick={toggleActive}>{node.id}</span>
         </li>
      );
   }

   const propElements = Object.entries(node.details).reduce((elements, value) => {
      const str = valueToString(value[0], value[1]);
      if (str) {
         elements.push(
            <li key={value[0]}>
               <span className='sidebar-bullet'>{str}</span>
            </li>
         );
      }
      return elements;
   }, []);

   return (
      <li>
         <span className='sidebar-caret sidebar-caret-down' onClick={toggleActive}>{node.id}</span>
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
      <button id='sidebar-close-button' 
              className={'sidebar-tooltip'} 
              onClick={closeNodes}>
         <span className={'sidebar-tooltiptext'}>{'Close All Dropdowns'}</span>
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
      let style = {};
      if (this.state.isHidden)
         style.transform = TRANSFORMS.LEFT;

      return (
         <div id='sidebar' style={style}>
            <style>{TOOLTIP_STYLE}</style>
            <div id='sidebar-list-container'>
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

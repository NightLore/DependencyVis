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

const ListNode = props => {
   const [active, setActive] = useState(false);

   const toggleActive = () => setActive(!active);

   let node = props.node;

   if (!node.details) {
      return (
         <li>
            <span className="bullet">{node.id}</span>
         </li>
      );
   }

   if (!active) {
      return (
         <li>
            <span className="caret" onClick={toggleActive}>{node.id}</span>
         </li>
      );
   }

   let nodeProps = Object.entries(node.details);
   let propElements = nodeProps.map((value, index) =>
      <li key={value[0]}>
         <span className="bullet">{value[0] + ": " + value[1]}</span>
      </li>
   );

   return (
      <li>
         <span className="caret caret-down" onClick={toggleActive}>{node.id}</span>
         <ul style={{marginLeft: "0.5em"}}>
            {propElements}
         </ul>
      </li>
   );

};

class Sidebar extends Component {
   constructor(props) {
      super(props);
      this.state = {
         width: 0,
         height: 0,
         isHidden: false,
      };
   }

   // ---------------- helper functions ---------- //
   updateDimensions = () => {
      this.setState(getDocumentSize());
   };
   setHidden = hidden => {
      this.setState({isHidden: hidden});
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
            <div style={{overflow: "auto", height: "-webkit-fill-available"}}>
               <style>{LISTSTYLE}</style>
               <ul className='sidebar-list'>{nodes}</ul>
            </div>
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

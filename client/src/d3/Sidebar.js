import React, { Component } from 'react'

const PROPS = {
   sidebarHeight: 800,
   sidebarWidth: 200,
   sidebarFill: "lightsteelblue",
};

const listStyle = {
   margin: "0.5em", 
   paddingLeft: "1em", 
   content:"\\25B6"
};

const TreeList = props => {
   let mainItem = props.items[0];
   let children = props.items.slice(1);
   let list = children.map((value, index) => 
      <li key={value.id}>
         {value.id}
      </li>
   );
   
   return (
      <ul style={listStyle}>
         <li key={mainItem.id}>
            <span>{mainItem.id}</span>
            <ul style={{paddingLeft:"1em"}}>{list}</ul>
         </li>
      </ul>
   )
}

class Sidebar extends Component {
   render() {
      return (
         <div style={{
               margin: "1px",
               position: "absolute",
               display: "inline-block", 
               backgroundColor: PROPS.sidebarFill, 
               width: PROPS.sidebarWidth,
               height: PROPS.sidebarHeight
         }}>
            <TreeList items={this.props.nodes}/>
         </div>
      )
   }
}

export default Sidebar;

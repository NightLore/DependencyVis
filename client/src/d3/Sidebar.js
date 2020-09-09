import React, { Component } from 'react'

let PROPS= {
   sidebarHeight: 800,
   sidebarWidth: 200,
   sidebarFill: "lightsteelblue"
};

const TreeList = props => {
   let list = props.items.map((value) => 
      <li key={value.id}>
         {value.id}
      </li>
   );
   
   return (
      <ul>{list}</ul>
   )
}

class Sidebar extends Component {
   constructor(props) {
      super(props);
   }

   componentDidMount() {}

   render() {
      return (
         <div style={{
               margin: "1px",
               position: "absolute",
               display: "inline-block", 
               "background-color": PROPS.sidebarFill, 
               width: PROPS.sidebarWidth,
               height: PROPS.sidebarHeight
         }}>
            <TreeList items={this.props.nodes}/>
         </div>
      )
   }
}

export default Sidebar;

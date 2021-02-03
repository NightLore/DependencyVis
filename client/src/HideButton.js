import React from 'react';
import './css/HideButton.css';

function OpenState(open, close, x, y, w, h) {
   let tx = x - 100;
   let ty = y - 100;
   return {
      OPEN: open,
      CLOSE: close,
      LEFT: `${x}%`,
      TOP: `${y}%`,
      WIDTH: `${w}`,
      HEIGHT: `${h}`,
      TRANSFORM: `translate(${tx}%, ${ty}%)`
   }
}

const TRANSFORMS = {
   UP:    "translate(0%, -100%)",
   RIGHT: "translate(100%, 0%)",
   DOWN:  "translate(0%, 100%)",
   LEFT:  "translate(-100%, 0%)",
};

const OPEN_STATES = {
   // double down angle brackets, double up angle brackets
   UP: OpenState(" \uFE3E ", " \uFE3D ", 50, 0, '2em', '1em'),

   // double left carets, double right carets
   RIGHT: OpenState("\u27EA", "\u27EB", 100, 50, '1em', '2em'),

   // double up angle brackets, double down angle brackets
   DOWN: OpenState(" \uFE3D ", " \uFE3E ", 50, 100, '2em', '1em'),
   
   // double right carets, double left carets
   LEFT: OpenState("\u27EB", "\u27EA", 0, 50, '1em', '2em'),
}

const HideButton = props => {
   const toggleHidden = () => {
      props.setHidden(!props.isHidden);
   };
   const state = OPEN_STATES[props.direction.toUpperCase()];
   const style = {
      top: state.TOP,
      left: state.LEFT,
      width: state.WIDTH,
      height: state.HEIGHT,
      lineHeight: state.HEIGHT,
      transform: state.TRANSFORM
   };

   let buttonContents 
      = props.isHidden ? state.CLOSE : state.OPEN;

   return (
      <button className={'hide-button'}
              style={style} 
              onClick={toggleHidden}>
         {buttonContents}
      </button>
   )
};

export { TRANSFORMS };
export default HideButton;

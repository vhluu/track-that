import React from 'react';
import './Button.scss';

function Button(props) {
  const { btnType, clicked, children, ariaLabel } = props;

  /* Executes click handler on space or enter key press */
  function handleKeyDown(e) {
    const SPACEBAR_KEY = 0 || 32;
    const ENTER_KEY = 13;
    
    if (clicked && (e.keyCode == SPACEBAR_KEY || e.keyCode == ENTER_KEY)) {
      e.preventDefault();
      e.stopPropagation();
      clicked();
    }
  }
  
  return (
    <div className={`btn ${btnType}`} onClick={clicked} onKeyDown={handleKeyDown} role="button" tabIndex="0" aria-label={ariaLabel} >{ children }</div>
  );
}

export default Button;

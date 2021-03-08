import React from 'react';
import './Button.scss';

function Button(props) {
  const { type, clicked, children, ariaLabel } = props;

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

  let icon;
  switch(type) {
    case 'delete':
      icon = <svg viewBox="0 0 137.583 164.571" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-42.333 -64.167)"><rect x="52.917" y="112.32" width="116.42" height="116.42" rx="10.583" ry="7.276" fill="#CFD8DC"/><rect className="delete-icon-top" x="127" y="64.167" width="10.583" height="31.75" rx="4.914" ry="5.291" fill="#CFD8DC"/><g fill="#CFD8DC" className="delete-icon-top"><rect x="84.667" y="64.167" width="10.583" height="31.75" rx="5.291" ry="5.292"/><rect x="42.333" y="85.333" width="137.58" height="20.411" rx="10.583" ry="15.308"/><rect x="84.667" y="64.167" width="52.917" height="10.583" rx="10.583" ry="7.938"/></g><g fill="#B0BEC5"><rect transform="scale(1 -1)" x="105.83" y="-212.86" width="10.583" height="84.667" rx="10.583" ry="7.276"/><rect x="74.083" y="127.67" width="10.583" height="84.667" rx="10.583" ry="7.761"/><rect x="137.58" y="127.67" width="10.583" height="84.667" rx="10.583" ry="7.276"/></g></g></svg>;
      break;
  }
  
  return (
    <div className={`btn ${type} ${icon ? 'btn-icon' : 'btn-default'}`} onClick={clicked} onKeyDown={handleKeyDown} role="button" tabIndex="0" aria-label={ariaLabel} >{ children }{ icon }</div>
  );
}

export default Button;

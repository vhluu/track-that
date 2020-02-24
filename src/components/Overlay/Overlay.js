import React from 'react';
import './Overlay.scss';

function Overlay(props) {
  const { children, show } = props;
  return (
    <div className="overlay-wrapper">
      { children[0] }
      { show && (
        <div className="overlay">
          { children[1] }
        </div>
      ) }
    </div>
  );
}

export default Overlay;

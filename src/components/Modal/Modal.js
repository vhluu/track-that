import React from 'react';

function Modal(props) {
  const { show, children, extraClasses } = props;
  return (
    <div className={`modal card ${extraClasses}${show ? '' : ' hide'}`}>
      { children }
    </div>
  );
}

export default Modal;

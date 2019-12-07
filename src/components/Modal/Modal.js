import React from 'react';

function Modal(props) {
  const { show, children } = props;
  const modalClasses = show ? 'modal card' : 'modal card hide';
  return (
    <div className={modalClasses}>
      { children }
    </div>
  );
}

export default Modal;

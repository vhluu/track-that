import React from 'react';

function Button(props) {
  const { btnType, clicked, children } = props;
  return (
    <div className={`btn ${btnType}`} onClick={clicked} role="button">{ children }</div>
  );
}

export default Button;

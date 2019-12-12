import React from 'react';

function Checkbox(props) {
  const { children, checked, id, extraClasses } = props;
  return (
    <div className={`checkbox-wrapper ${extraClasses}`}>
      <input type="checkbox" id={id} checked={checked} />
      <label htmlFor={id}>
        <div className="custom-checkbox" />
        {children}
      </label>
    </div>
  );
}

export default Checkbox;

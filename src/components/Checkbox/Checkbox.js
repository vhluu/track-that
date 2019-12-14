import React from 'react';

function Checkbox(props) {
  const { children, id, extraClasses, onChange, index, checked = false } = props;
  return (
    <div className={`checkbox-wrapper ${extraClasses}`}>
      <input type="checkbox" id={id} checked={checked} onChange={onChange} data-index={index} />
      <label htmlFor={id}>
        <div className="custom-checkbox" />
        {children}
      </label>
    </div>
  );
}

export default Checkbox;

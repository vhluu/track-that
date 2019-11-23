import React from 'react';

function ColorPickerItem(props) {
  const { color, onChange, checked } = props;
  return (
    <div>
      <input type="radio" name="tag-color-picker" id={`${color}-color`} value={color} required onChange={onChange} checked={checked} />
      <label htmlFor={`${color}-color`}>
        <div className={`color-picker-item ${color}`} />
      </label>
    </div>
  );
}

export default ColorPickerItem;

import React from 'react';

function ColorPickerItem(props) {
  const { color, onChange } = props;
  return (
    <div>
      <input type="radio" name="tag-color-picker" id={`${color}-color`} value={color} required onChange={onChange} />
      <label htmlFor={`${color}-color`}>
        <div className={`color-picker-item ${color}`} />
      </label>
    </div>
  );
}

export default ColorPickerItem;

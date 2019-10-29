import React from 'react';
import ColorPickerItem from './ColorPickerItem/ColorPickerItem';

function ColorPicker() {
  const colors = ['red', 'orange', 'yellow', 'green', 'lightblue', 'blue', 'purple', 'pink'];
  return (
    <div className="tag-field-wrapper">
      <label>Color</label>
      <div className="color-picker">
        {(colors).map((color) => (
          <ColorPickerItem color={color} />
        ))}
      </div>
    </div>
  );
}

export default ColorPicker;

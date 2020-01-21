import React from 'react';
import ColorPickerItem from './ColorPickerItem/ColorPickerItem';

function ColorPicker(props) {
  const { onChange, defaultVal } = props;
  const colors = ['violet', 'indigo', 'skyblue', 'aquamarine', 'lime', 'orange', 'red', 'rose',
    'pink', 'purple', 'blue', 'teal', 'green', 'yellow', 'redorange', 'gray'];
    
  return (
    <div className="tag-field-wrapper">
      <label>Color</label>
      <div className="color-picker">
        {(colors).map((color) => (
          <ColorPickerItem color={color} onChange={onChange} checked={color === defaultVal} />
        ))}
      </div>
    </div>
  );
}

export default ColorPicker;

import React from 'react';

import ColorPickerItem from './ColorPickerItem/ColorPickerItem';
import './ColorPicker.scss';

function ColorPicker(props) {
  const { onChange, defaultVal } = props;
  const colors = ['violet', 'indigo', 'skyblue', 'aquamarine', 'lime', 'orange', 'red', 'rose',
    'pink', 'purple', 'blue', 'teal', 'green', 'yellow', 'redorange', 'gray'];
    
  return (
    <div className="tag-field-wrapper">
      <label id="color-label">Color</label>
      <div className="color-picker" role="group" aria-labelledby="color-label">
        {(colors).map((color) => (
          <ColorPickerItem key={color} color={color} onChange={onChange} checked={color === defaultVal} />
        ))}
      </div>
    </div>
  );
}

export default ColorPicker;

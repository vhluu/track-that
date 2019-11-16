import React, { Component } from 'react';
import ColorPickerItem from './ColorPickerItem/ColorPickerItem';

class ColorPicker extends Component {
  render() {
    const colors = ['red', 'orange', 'yellow', 'green', 'lightblue', 'blue', 'purple', 'pink'];
    const { onChange } = this.props;
    return (
      <div className="tag-field-wrapper">
        <label>Color</label>
        <div className="color-picker">
          {(colors).map((color) => (
            <ColorPickerItem color={color} onChange={onChange} />
          ))}
        </div>
      </div>
    );
  }
}

export default ColorPicker;

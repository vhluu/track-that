import React from 'react';

function ColorPicker(props) {
  return (
    <div className="tag-field-wrapper">
      <label>Color</label>
      <div className="color-picker">
        <input type="radio" name="tag-color-picker" id="red-color" value="red" required />
        <label htmlFor="red-color">
          <div className="color-picker-item red" />
        </label>

        <input type="radio" name="tag-color-picker" id="orange-color" value="orange" />
        <label htmlFor="orange-color">
          <div className="color-picker-item orange" />
        </label>

        <input type="radio" name="tag-color-picker" id="yellow-color" value="yellow" />
        <label htmlFor="yellow-color">
          <div className="color-picker-item yellow" />
        </label>

        <input type="radio" name="tag-color-picker" id="green-color" value="green" />
        <label htmlFor="green-color">
          <div className="color-picker-item green" />
        </label>

        <input type="radio" name="tag-color-picker" id="lightblue-color" value="lightblue" />
        <label htmlFor="lightblue-color">
          <div className="color-picker-item lightblue" />
        </label>

        <input type="radio" name="tag-color-picker" id="blue-color" value="blue" />
        <label htmlFor="blue-color">
          <div className="color-picker-item blue" />
        </label>

        <input type="radio" name="tag-color-picker" id="purple-color" value="purple" />
        <label htmlFor="purple-color">
          <div className="color-picker-item purple" />
        </label>

        <input type="radio" name="tag-color-picker" id="pink-color" value="pink" />
        <label htmlFor="pink-color">
          <div className="color-picker-item pink" />
        </label>
      </div>
    </div>
  );
}

export default ColorPicker;

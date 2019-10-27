import React, { Component } from 'react';
import ColorPicker from './ColorPicker/ColorPicker';

class TagModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="tag-modal card">
        <form>
          <p className="tag-error-message hide">All fields are required!!</p>
          <div className="tag-field-wrapper">
            <label for="tag-field-title">Tag Name</label>
            <input type="text" name="tag-field-title" required />
          </div>
          <ColorPicker />
          <div className="btn btn-create-tag">Create Tag</div>
        </form>
      </div>
    );
  }
}

export default TagModal;

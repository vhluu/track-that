import React, { Component } from 'react';
import ColorPicker from './ColorPicker/ColorPicker';
import IconPicker from './IconPicker/IconPicker';

class TagModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showErrorMsg: false,
      selectedIcon: null,
    };

    this.colorPicker = React.createRef();
    this.handleIconSelect = this.handleIconSelect.bind(this);
  }

  createTag() {
    // this.colorPicker.current.value;
  }

  handleIconSelect(icon) {
    this.setState({
      selectedIcon: icon,
    });
  }

  render() {
    const { showErrorMsg } = this.state;
    return (
      <div className="tag-modal card">
        <form>
          { showErrorMsg && <p className="tag-error-message">All fields are required!!</p> }
          <div className="tag-field-wrapper">
            <label htmlFor="tag-field-title">Tag Name</label>
            <input type="text" name="tag-field-title" required />
          </div>
          <ColorPicker ref={this.colorPicker} />
          <IconPicker onIconSelect={this.handleIconSelect} />
          
          <div className="btn btn-create-tag" onClick={this.createTag} role="button" tabIndex={0}>Create Tag</div>
        </form>
      </div>
    );
  }
}

export default TagModal;

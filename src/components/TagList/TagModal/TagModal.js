import React, { Component } from 'react';
import ColorPicker from './ColorPicker/ColorPicker';
import IconPicker from './IconPicker/IconPicker';

class TagModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showErrorMsg: false,
      selectedIcon: null,
      selectedColor: null,
    };

    this.titleInput = React.createRef();

    this.createTag = this.createTag.bind(this);
    this.handleColorSelect = this.handleColorSelect.bind(this);
    this.handleIconSelect = this.handleIconSelect.bind(this);
  }

  createTag() {
    const formValues = {
      title: this.titleInput.current.value,
      color: this.state.selectedColor,
      icon: this.state.selectedIcon,
    };
    console.log(formValues);

    if (!formValues.title || !formValues.color || !formValues.icon) {
      this.setState({
        showErrorMsg: true,
      });
    } else {
      // create tag
      this.setState({
        showErrorMsg: false,
      });
    }
  }

  handleColorSelect(event) {
    this.setState({
      selectedColor: event.target.value,
    });
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
            <input type="text" name="tag-field-title" required ref={this.titleInput} />
          </div>
          <ColorPicker onChange={this.handleColorSelect} />
          <IconPicker onIconSelect={this.handleIconSelect} />
          
          <div className="btn btn-create-tag" onClick={this.createTag} role="button" tabIndex={0}>Create Tag</div>
        </form>
      </div>
    );
  }
}

export default TagModal;

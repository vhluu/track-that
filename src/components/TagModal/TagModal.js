import React, { Component } from 'react';
import ColorPicker from './ColorPicker/ColorPicker';
import IconPicker from './IconPicker/IconPicker';

class TagModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedColor: props.selectedTag ? props.selectedTag.color : false,
      selectedIcon: null,
      showErrorMsg: false,
      showConfirmation: false,
      titleValue: props.selectedTag ? props.selectedTag.title : '',
    };

    this.titleInput = React.createRef();

    this.createTag = this.createTag.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
    this.handleColorSelect = this.handleColorSelect.bind(this);
    this.handleIconSelect = this.handleIconSelect.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.toggleConfirmation = this.toggleConfirmation.bind(this);
  }

  // TODO: generate id
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
      this.props.onCreateTag(formValues);
    }
  }

  deleteTag() {
    this.toggleConfirmation();
  }

  handleTitleChange(event) {
    this.setState({
      titleValue: event.target.value,
    });
  }

  handleColorSelect(event) {
    console.log('selecting color');
    this.setState({
      selectedColor: event.target.value,
    });
  }

  handleIconSelect(icon) {
    this.setState({
      selectedIcon: icon,
    });
  }

  toggleConfirmation() {
    this.setState((prevState) => ({
      showConfirmation: !(prevState.showConfirmation),
    }));
  }

  render() {
    const { action, onDeleteTag, onUpdateTag, selectedTag } = this.props;
    const { showErrorMsg, showConfirmation, titleValue, selectedColor } = this.state;
    const { color, icon } = selectedTag || { color: false, icon: false };
    return (
      <div className="tag-modal card">
        <form>
          { showErrorMsg && <p className="tag-error-message">All fields are required!!</p> }
          <div className="tag-field-wrapper">
            <label htmlFor="tag-field-title">Tag Name</label>
            <input type="text" name="tag-field-title" required ref={this.titleInput} value={titleValue || ''} onChange={this.handleTitleChange} />
          </div>
          <ColorPicker onChange={this.handleColorSelect} defaultVal={selectedColor} />
          <IconPicker onIconSelect={this.handleIconSelect} defaultVal={icon} />
          
          { action === 'create' && <div className="btn btn-create-tag" onClick={this.createTag} role="button" tabIndex={0}>Create Tag</div> }
          
          { action === 'update' && (
            <div className="tag-btn-wrapper">
              <div className="btn btn-update-tag" onClick={onUpdateTag}>Update</div>
              <div className="tag-delete-wrapper">
                <svg className="delete-icon" onClick={this.toggleConfirmation} viewBox="0 0 137.583 164.571" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-42.333 -64.167)"><rect x="52.917" y="112.32" width="116.42" height="116.42" rx="10.583" ry="7.276" fill="#CFD8DC"/><rect  className="delete-icon-top" x="127" y="64.167" width="10.583" height="31.75" rx="4.914" ry="5.291" fill="#CFD8DC"/><g fill="#CFD8DC" className="delete-icon-top"><rect x="84.667" y="64.167" width="10.583" height="31.75" rx="5.291" ry="5.292"/><rect x="42.333" y="85.333" width="137.58" height="20.411" rx="10.583" ry="15.308"/><rect x="84.667" y="64.167" width="52.917" height="10.583" rx="10.583" ry="7.938"/></g><g fill="#B0BEC5"><rect transform="scale(1 -1)" x="105.83" y="-212.86" width="10.583" height="84.667" rx="10.583" ry="7.276"/><rect x="74.083" y="127.67" width="10.583" height="84.667" rx="10.583" ry="7.761"/><rect x="137.58" y="127.67" width="10.583" height="84.667" rx="10.583" ry="7.276"/></g></g></svg>
                { showConfirmation && (
                  <div className="delete-confirm">
                    <p className="delete-confirm-title">Are you sure?</p>
                    <p className="delete-confirm-desc">Deleting your tag will remove it from the calendar.</p>
                    <div className="btn btn-cancel" onClick={this.toggleConfirmation}>Cancel</div>
                    <div className="btn btn-delete" onClick={onDeleteTag}>Delete</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    );
  }
}

export default TagModal;

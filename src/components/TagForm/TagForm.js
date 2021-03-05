import React, { Component } from 'react';

import Button from '../Button/Button';
import ColorPicker from './ColorPicker/ColorPicker';
import DeleteConfirm from './DeleteConfirm/DeleteConfirm';
import IconPicker from './IconPicker/IconPicker';

import './TagForm.scss';

class TagForm extends Component {
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
    this.handleColorSelect = this.handleColorSelect.bind(this);
    this.handleIconSelect = this.handleIconSelect.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.toggleConfirmation = this.toggleConfirmation.bind(this);
    this.updateTag = this.updateTag.bind(this);
  }

  /* Returns an object that has all of the values entered into the form */
  getFormValues() {
    const { selectedColor, selectedIcon } = this.state;
    const { selectedTag } = this.props;

    return {
      title: this.titleInput.current.value,
      color: selectedColor || ((selectedTag) ? selectedTag.color : false),
      icon: selectedIcon || ((selectedTag) ? selectedTag.icon : false),
    };
  }

  /* Validates the form & returns the form values if valid */
  validateForm() {
    const formValues = this.getFormValues();

    if (!formValues.title || !formValues.color || !formValues.icon) {
      this.setState({ showErrorMsg: true });
      return null;
    } 
    this.setState({ showErrorMsg: false });
    return formValues;
  }

  /* Handles click of 'Create Tag' btn. Creates tag in store & database */
  createTag() {
    const formValues = this.validateForm(); // validate form & get form values

    if (formValues) { // form data is valid
      this.props.onCreateTag(formValues); // create tag in store & database
      this.setState({ // clear form
        selectedColor: false,
        selectedIcon: false,
        titleValue: '',
      });
    }
  }

  /* Handles click of 'Update Tag' btn. Updates tag in store & database */
  updateTag() {
    const { selectedTag, onUpdateTag, toggleSelf } = this.props;
    const formValues = this.validateForm(); // validate form & get form values

    if (formValues) {
      const { title: sTitle, color: sColor, icon: sIcon, id } = selectedTag;
      const { title, color, icon } = formValues;
      // check that at least one value is updated
      if (sTitle !== title || sColor !== color || sIcon !== icon) {
        formValues.id = id;
        onUpdateTag(formValues); // update tag in database & store
        toggleSelf(selectedTag); // toggle the modal
      }
    }
  }

  /* Handles changes to the title input field */
  handleTitleChange(event) {
    this.setState({ titleValue: event.target.value });
  }

  /* Handles color select for the color picker field */
  handleColorSelect(event) {
    this.setState({ selectedColor: event.target.value });
  }

  /* Handles icon select for the icon picker field */
  handleIconSelect(icon) {
    this.setState({ selectedIcon: icon });
  }

  /* Toggles the delete confirmation pop up */
  toggleConfirmation() {
    this.setState((prevState) => ({
      showConfirmation: !(prevState.showConfirmation),
    }));
  }

  render() {
    const { action, onDeleteTag, selectedTag } = this.props;
    const { showErrorMsg, showConfirmation, titleValue, selectedColor } = this.state;
    const { icon } = selectedTag || { icon: false };

    return (
      <form>
        { showErrorMsg && <p className="tag-error-message">All fields are required!!</p> }
        <div className="tag-field-wrapper">
          <label htmlFor="tag-field-title">Tag Name</label>
          <input type="text" name="tag-field-title" required ref={this.titleInput} value={titleValue || ''} onChange={this.handleTitleChange} />
        </div>
        <ColorPicker onChange={this.handleColorSelect} defaultVal={selectedColor} />
        <IconPicker onIconSelect={this.handleIconSelect} defaultVal={icon} />
        
        { action === 'create' && <Button btnType="btn-create-tag" clicked={this.createTag} ariaLabel="Create Tag">Create Tag</Button> }
        
        { action === 'update' && (
          <div className="tag-btn-wrapper">
            <Button btnType="btn-update-tag" clicked={this.updateTag} ariaLabel="Update Tag">Update</Button>
            <div className="tag-delete-wrapper">
              <svg className="delete-icon" onClick={this.toggleConfirmation} viewBox="0 0 137.583 164.571" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-42.333 -64.167)"><rect x="52.917" y="112.32" width="116.42" height="116.42" rx="10.583" ry="7.276" fill="#CFD8DC"/><rect  className="delete-icon-top" x="127" y="64.167" width="10.583" height="31.75" rx="4.914" ry="5.291" fill="#CFD8DC"/><g fill="#CFD8DC" className="delete-icon-top"><rect x="84.667" y="64.167" width="10.583" height="31.75" rx="5.291" ry="5.292"/><rect x="42.333" y="85.333" width="137.58" height="20.411" rx="10.583" ry="15.308"/><rect x="84.667" y="64.167" width="52.917" height="10.583" rx="10.583" ry="7.938"/></g><g fill="#B0BEC5"><rect transform="scale(1 -1)" x="105.83" y="-212.86" width="10.583" height="84.667" rx="10.583" ry="7.276"/><rect x="74.083" y="127.67" width="10.583" height="84.667" rx="10.583" ry="7.761"/><rect x="137.58" y="127.67" width="10.583" height="84.667" rx="10.583" ry="7.276"/></g></g></svg>
              { showConfirmation && <DeleteConfirm cancel={this.toggleConfirmation} myDelete={() => { this.toggleConfirmation(); onDeleteTag(); }} /> }
            </div>
          </div>
        )}
      </form>
    );
  }
}

export default TagForm;

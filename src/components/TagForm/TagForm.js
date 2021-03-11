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
    this.setFocus = this.setFocus.bind(this);
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

  /* Focuses on the first field */
  setFocus() {
    this.titleInput.current.focus();
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
        
        { action === 'create' && <Button clicked={this.createTag} ariaLabel="Create Tag">Create Tag</Button> }
        
        { action === 'update' && (
          <div className="tag-btn-wrapper">
            <Button clicked={this.updateTag} ariaLabel="Update Tag">Update</Button>
            <div className="tag-delete-wrapper">
              <Button type="delete" clicked={this.toggleConfirmation} />
              { showConfirmation && <DeleteConfirm cancel={this.toggleConfirmation} myDelete={() => { this.toggleConfirmation(); onDeleteTag(); }} /> }
            </div>
          </div>
        )}
      </form>
    );
  }
}

export default TagForm;

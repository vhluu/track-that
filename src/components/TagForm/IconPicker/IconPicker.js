import React, { Component } from 'react';
import { NimblePicker } from 'emoji-mart';
import data from 'emoji-mart/data/all.json';
import { isMac } from '../../../util/utility';
import '../../../sass/emoji-mart.scss';

import Button from '../../Button/Button';
import Icon from '../../Icon/Icon';
import './IconPicker.scss';

class IconPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showIconPicker: false,
      selectedIcon: props.defaultVal,
    };

    this.setIcon = this.setIcon.bind(this);
    this.toggleIconPicker = this.toggleIconPicker.bind(this);
    this.setPickerRef = this.setPickerRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  /* Handles selection of an emoji */
  setIcon(emoji) {
    console.log(emoji);
    let icon = {
      id: emoji.id,
      native: emoji.native
    };

    this.setState({
      selectedIcon: icon,
    });
    this.toggleIconPicker();

    const { onIconSelect } = this.props;
    onIconSelect(icon);
  }

  setPickerRef(node) {
    this.PickerRef = node;
  }

  /* Toggles the icon picker */
  toggleIconPicker() {
    this.setState((prevState) => ({
      showIconPicker: !(prevState.showIconPicker),
    }));
  }

  /* Closes the icon picker when clicking outside of it */
  handleClickOutside(event) {
    const { showIconPicker } = this.state;

    if (showIconPicker && this.PickerRef && !this.PickerRef.contains(event.target)) {
    this.toggleIconPicker();
    }
  }

  render() {
    const { showIconPicker, selectedIcon } = this.state;

    const pickerProps = isMac ? { native: true } : { set: 'apple' };

    return (
      <div className="tag-field-wrapper tag-icon-wrapper" ref={this.setPickerRef}>
        <label>Icon</label>
        <Button type="tag-field-icon" clicked={this.toggleIconPicker} ariaLabel="Open Icon Picker">{selectedIcon && <Icon data={selectedIcon} />}</Button>
        { showIconPicker && (
          <div className="tag-emoji-picker">
            <NimblePicker {...pickerProps} data={data} onSelect={this.setIcon} />
          </div>
        ) }
      </div>
    );
  }
}

export default IconPicker;

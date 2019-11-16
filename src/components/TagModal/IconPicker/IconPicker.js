import React, { Component } from 'react';
import 'emoji-mart/css/emoji-mart.css';
import data from 'emoji-mart/data/all.json';
import { NimblePicker } from 'emoji-mart';

class IconPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showIconPicker: false,
      selectedIcon: null,
    };

    this.setIcon = this.setIcon.bind(this);
    this.toggleIconPicker = this.toggleIconPicker.bind(this);
  }

  setIcon(emoji) {
    this.setState({
      selectedIcon: emoji.native,
    });
    this.toggleIconPicker();

    const { onIconSelect } = this.props;
    onIconSelect(emoji.native);
  }

  toggleIconPicker() {
    this.setState((prevState) => ({
      showIconPicker: !(prevState.showIconPicker),
    }));
  }

  render() {
    const { showIconPicker, selectedIcon } = this.state;
    return (
      <div className="tag-field-wrapper tag-icon-wrapper">
        <label>Icon</label>
        <div className="tag-field-icon" onClick={this.toggleIconPicker} role="button" tabIndex={0}>{selectedIcon}</div>
        { showIconPicker && (
          <div className="tag-emoji-picker">
            <NimblePicker set="apple" data={data} onSelect={this.setIcon} />
          </div>
        ) }
      </div>
    );
  }
}

export default IconPicker;

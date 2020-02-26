import React, { Component } from 'react';
import './Select.scss';

class Select extends Component {
  constructor(props) {
    super(props);
    const { value, options } = props;

    let label;
    if (options && value) { // find value in options to get label
      options.forEach((option) => {
        if (option.value === value) {
          label = option.label;
        }
      });
    }

    this.state = {
      open: false, // whether select dropdown menu is open
      currVal: value || '', // currently selected value
      currLabel: label,
    };

    this.toggleSelect = this.toggleSelect.bind(this);
    this.selectOption = this.selectOption.bind(this);
  }

  /* Toggles the select dropdown menu */
  toggleSelect() {
    this.setState((prevState) => ({
      open: !prevState.open,
    }));
  }

  /* Handles when user selects an option */
  selectOption(e) {
    console.log(e.target);
    const { onChange } = this.props;
    const currVal = e.target.getAttribute('data-value');
    const currLabel = e.target.textContent;

    if (onChange) onChange(currVal, currLabel); // pass value/label to onChange handler

    // update current value/label and close select dropdown
    this.setState({
      currVal,
      currLabel,
      open: false,
    });
  }


  render() {
    const { open, currVal, currLabel } = this.state;
    const { options } = this.props;
    const selectClass = open ? 'active' : '';

    return (
      <div className={`select ${selectClass}`}>
        <div className="option-current" onClick={this.toggleSelect} data-value={currVal}>{ currLabel }</div>
        <div className="options-wrapper">
          <div className="options">
            { options.map((option) => <div className={`option${currVal == option.value ? ' selected': ''}`} data-value={option.value} onClick={this.selectOption}>{ option.label }</div>) }
            { options.length === 0 && <div className="option">No Tags Available</div> }
          </div>
        </div>
      </div>
    );
  }
}

export default Select;

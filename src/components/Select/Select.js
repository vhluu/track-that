import React, { Component } from 'react';
import './Select.scss';

class Select extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      currVal: '',
      currLabel: null,
    };

    this.toggleSelect = this.toggleSelect.bind(this);
    this.selectOption = this.selectOption.bind(this);
  }

  toggleSelect(e) {
    this.setState((prevState) => ({
      open: !prevState.open,
    }));
  }

  selectOption(e) {
    console.log(e.target);
    const { onChange } = this.props;

    if (onChange) onChange(currVal, currLabel);

    this.setState({
      currVal: e.target.getAttribute('data-value'),
      currLabel: e.target.textContent,
      open: false,
    });
  }


  render() {
    const options = [ { label: '😃 hello', value: 't1' }, { label: '🌊 goodbye', value: 't2' } ];
    const { open, currVal, currLabel } = this.state;
    const selectClass = open ? 'active' : '';

    return (
      <div className={`select ${selectClass}`}>
        <div className="option-current" onClick={this.toggleSelect} data-value={currVal}>{ currLabel }</div>
        <div className="options-wrapper">
          <div className="options">
            { options.map((option) => <div className={`option${currVal == option.value ? ' selected': ''}`} data-value={option.value} onClick={this.selectOption}>{ option.label }</div>) }
          </div>
        </div>
      </div>
    );
  }
}

export default Select;

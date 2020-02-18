import React from 'react';
import './Select.scss';

function Select(props) {
  // const { options, value, onChange } = props;
  const options = [ { label: '😃 hello', value: 't1' }, { label: '🌊 goodbye', value: 't2' } ];
  return (
    <div className="select">
      <div className="option-current">{ (options && options[0]) ? options[0].label : 'No Tags!' }</div>
      <div className="options-wrapper">
        { options.map((option) => <div className="option" data-value={option.value}>{ option.label }</div>) }
      </div>
    </div>

    
  );
}

export default Select;

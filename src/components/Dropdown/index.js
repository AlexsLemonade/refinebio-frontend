import React from 'react';
import './Dropdown.scss';

const Dropdown = ({
  options = [],
  selectedOption = '',
  onChange,
  disabled = false,
  label = x => x
}) => {
  return (
    <div className="dropdown">
      <select
        className="dropdown__select"
        value={options.indexOf(selectedOption)}
        onChange={e => {
          if (onChange) {
            const index = parseInt(e.target.value, 10);
            onChange(options[index], index);
          }
        }}
        disabled={disabled}
      >
        {/* Set the value of each option to the index selected, to be able to return the correct selected option
        on the `onChange` handler */}
        {options.map((option, index) => (
          <option key={index} value={index}>
            {label(option)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;

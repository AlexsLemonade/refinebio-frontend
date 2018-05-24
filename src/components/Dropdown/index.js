import React from 'react';
import './Dropdown.scss';

const Dropdown = ({ options = [], selectedOption = '', onChange }) => {
  return (
    <div className="dropdown">
      <select
        className="dropdown__select"
        value={options.indexOf(selectedOption)}
        onChange={e => onChange && onChange(options[parseInt(e.target.value)])}
      >
        {/* Set the value of each option to the index selected, to be able to return the correct selected option
        on the `onChange` handler */}
        {options.map((option, index) => (
          <option key={index} value={index}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;

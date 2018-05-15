import React from 'react';
import './Dropdown.scss';

const Dropdown = ({ options = [], selectedOption = '' }) => {
  return (
    <div className="dropdown">
      <button className="dropdown__selected">{selectedOption}</button>
      <ul className="dropdown__options">
        {options.map((option, i) => (
          <li key={i}>
            <button className="dropdown__option">{option}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;

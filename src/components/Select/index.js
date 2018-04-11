import React from 'react';

const Select = ({ input, options, disabled = false }) => {
  return (
    <div className="select">
      <select className="select__dropdown" {...input} disabled={disabled}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;

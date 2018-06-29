import React from 'react';
import './Checkbox.scss';

const Checkbox = ({ name, onToggle, checked, children, className }) => (
  <div className={`checkbox ${className}`}>
    <input
      type="checkbox"
      className="checkbox__input"
      name={name}
      id={name}
      checked={checked}
      onChange={onToggle}
    />
    <label className="checkbox__label" htmlFor={name}>
      {children ? children : name}
    </label>
  </div>
);

export default Checkbox;

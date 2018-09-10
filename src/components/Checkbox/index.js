import React from 'react';
import './Checkbox.scss';

const Checkbox = ({
  name,
  onToggle,
  checked,
  children,
  className,
  disabled
}) => (
  <div
    className={`checkbox ${!!className ? className : ''} ${
      disabled ? 'checkbox--disabled' : ''
    }`}
  >
    <input
      type="checkbox"
      className="checkbox__input"
      disabled={disabled}
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

import React from 'react';
import './Radio.scss';

const Radio = ({
  name,
  onToggle,
  checked,
  children,
  className,
  disabled,
  onClick,
  readOnly
}) => (
  <div className={`radio ${!!className ? className : ''}`}>
    <input
      type="radio"
      className="radio__input"
      disabled={disabled}
      name={name}
      id={name}
      checked={checked}
      onChange={onToggle}
      readOnly={readOnly}
    />
    <label className="radio__label" htmlFor={name} onClick={onClick}>
      {children ? children : name}
    </label>
  </div>
);

export default Radio;

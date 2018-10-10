import React from 'react';
import './Radio.scss';
import classnames from 'classnames';

const Radio = ({
  name,
  onChange,
  checked,
  children,
  className,
  disabled,
  onClick,
  readOnly
}) => (
  <div className={classnames('radio', className)}>
    <input
      type="radio"
      className="radio__input"
      disabled={disabled}
      name={name}
      id={name}
      checked={checked}
      onChange={onChange}
      readOnly={readOnly}
    />
    <label className="radio__label" htmlFor={name} onClick={onClick}>
      {children ? children : name}
    </label>
  </div>
);

export default Radio;

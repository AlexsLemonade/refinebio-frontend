import React from 'react';
import './Checkbox.scss';
import classnames from 'classnames';

const Checkbox = ({
  name,
  onChange,
  checked,
  children,
  className,
  disabled,
  onClick,
  readOnly
}) => (
  <div
    className={classnames('checkbox', className, {
      'checkbox--disabled': disabled
    })}
  >
    <input
      type="checkbox"
      className="checkbox__input"
      disabled={disabled}
      name={name}
      id={name}
      checked={checked}
      onChange={onChange}
      readOnly={readOnly}
    />
    <label className="checkbox__label" htmlFor={name} onClick={onClick}>
      {children ? children : name}
    </label>
  </div>
);

export default Checkbox;

/**
 * Checkbox component to be used inside react forms
 */
export const CheckboxField = ({ input, children }) => (
  <Checkbox {...input} checked={input.value}>
    {children}
  </Checkbox>
);

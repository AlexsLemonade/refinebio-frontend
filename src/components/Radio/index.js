import React from 'react';

import classnames from 'classnames';

const Radio = ({
  name,
  onChange,
  checked,
  children,
  className,
  disabled,
  onClick,
  readOnly,
  onBlur,
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
      onBlur={onBlur}
    />
    <label className="radio__label" htmlFor={name} onClick={onClick}>
      {children || name}
    </label>
  </div>
);

export default Radio;

export const RadioField = ({
  field: { name, value: fieldValue, onBlur },
  form,
  label,
  className,
  value,
}) => (
  <Radio
    name={name}
    className={className}
    checked={fieldValue === value}
    onClick={() => {
      form.setFieldValue(name, value);
    }}
    readOnly
    onBlur={onBlur}
  >
    {label}
  </Radio>
);

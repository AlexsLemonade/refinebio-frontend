import React from 'react';

import classnames from 'classnames';

const Checkbox = ({
  name,
  onChange,
  checked,
  children,
  className,
  disabled,
  onClick,
  readOnly,
  error,
}) => (
  <div
    className={classnames('checkbox', className, {
      'checkbox--disabled': disabled,
      'checkbox--error': error,
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
      readOnly={readOnly || !onChange}
    />
    <label
      id={name}
      className="checkbox__label"
      htmlFor={name}
      onClick={onClick}
    >
      {children || name}
    </label>
  </div>
);

export default Checkbox;

/**
 * Checkbox component to be used inside a formik's Field
 */
export const CheckboxField = ({
  field,
  form: { errors, touched },
  label,
  className,
}) => (
  <React.Fragment>
    {errors[field.name] && <p className="color-error">{errors[field.name]}</p>}
    <Checkbox
      {...field}
      error={touched && !!errors[field.name]}
      className={className}
    >
      {label}
    </Checkbox>
  </React.Fragment>
);

import React from 'react';
import './Button.scss';
import classnames from 'classnames';

const Button = ({
  text,
  buttonStyle,
  isDisabled = false,
  className,
  children,
  type = 'button',
  ...props
}) => {
  const buttonStyleClass = buttonStyle ? `button--${buttonStyle}` : '';
  /* eslint-disable react/button-has-type */
  return (
    <button
      {...props}
      type={type}
      className={classnames('button', buttonStyleClass, className)}
      disabled={isDisabled}
    >
      {text || children}
    </button>
  );
};

export default Button;

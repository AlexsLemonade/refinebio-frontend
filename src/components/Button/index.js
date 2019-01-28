import React from 'react';
import './Button.scss';
import classnames from 'classnames';

const Button = ({
  text,
  buttonStyle,
  isDisabled = false,
  className,
  children,
  ...props
}) => {
  const buttonStyleClass = buttonStyle ? `button--${buttonStyle}` : '';
  return (
    <button
      {...props}
      className={classnames('button', buttonStyleClass, className)}
      disabled={isDisabled}
    >
      {text || children}
    </button>
  );
};

export default Button;

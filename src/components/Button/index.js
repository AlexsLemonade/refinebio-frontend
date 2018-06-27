import React from 'react';
import './Button.scss';

const Button = ({
  text,
  buttonStyle,
  onClick,
  isDisabled = false,
  className,
  children
}) => {
  const buttonStyleClass = buttonStyle ? `button--${buttonStyle}` : '';
  return (
    <button
      className={`button ${buttonStyleClass} ${className || ''}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {text || children}
    </button>
  );
};

export default Button;

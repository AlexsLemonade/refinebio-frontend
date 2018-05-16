import React from 'react';
import './Button.scss';

const Button = ({ text, buttonStyle, onClick, className }) => {
  const buttonStyleClass = buttonStyle ? `button--${buttonStyle}` : '';
  return (
    <button
      className={`button ${buttonStyleClass} ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;

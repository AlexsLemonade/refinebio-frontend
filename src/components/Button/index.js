import React from 'react';
import './Button.scss';

const Button = ({ text, buttonStyle, onClick }) => {
  const buttonStyleClass = buttonStyle ? `button--${buttonStyle}` : '';
  return (
    <button className={`button ${buttonStyleClass}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;

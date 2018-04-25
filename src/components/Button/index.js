import React from 'react';
import './Button.scss';

const Button = ({ text, buttonStyle }) => {
  const buttonStyleClass = buttonStyle ? `button--${buttonStyle}` : '';
  return <button className={`button ${buttonStyleClass}`}>{text}</button>;
};

export default Button;

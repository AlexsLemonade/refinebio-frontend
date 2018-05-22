import React from 'react';
import './Input.scss';

type Props = {
  value: string,
  onChange: (newValue: string) => void
};

const Input = (props: Props) => (
  <input type="text" {...props} className={`input ${props.className || ''}`} />
);

export default Input;

import React from 'react';
import './Input.scss';

type Props = {
  value: string,
  onChange: (newValue: string) => void
};

const Input = ({ onChange, className = 'input', ...props }: Props) => (
  <input
    type="text"
    {...props}
    className={className}
    onChange={e => onChange(e.target.value)}
  />
);

export default Input;

// Use the input component with a `Field` component inside forms
// ref: https://redux-form.com/7.3.0/docs/faq/customcomponent.md/
export const InputField = ({ input: { value, onChange }, className = '' }) => (
  <Input className={className} value={value} onChange={onChange} />
);

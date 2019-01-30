import React from 'react';
import './Input.scss';
import Button from '../Button';
import classnames from 'classnames';

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

/**
 * Input button with clear icon
 */
export const InputClear = ({ onChange, value, className, ...props }) => (
  <div className="input-wrap">
    <Input
      value={value}
      onChange={onChange}
      className={classnames('input input-wrap__input', className)}
      {...props}
    />
    {value && (
      <Button
        className="input-wrap__clear"
        onClick={() => onChange('')}
        buttonStyle="transparent"
      >
        <i className="icon ion-close" />
      </Button>
    )}
  </div>
);

export const InputSearch = ({ onChange, value, className, ...props }) => (
  <div className={classnames('input-wrap', className)}>
    <Input
      value={value}
      onChange={onChange}
      className="input input-wrap__input"
      {...props}
    />
    <div className="input-wrap__clear">
      <i className="icon ion-search" />
    </div>
  </div>
);

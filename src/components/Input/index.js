import React from 'react';

import classnames from 'classnames';
import { IoMdClose, IoMdSearch } from 'react-icons/io';
import Button from '../Button';

const Input = ({ onChange, className = 'input', ...props }) => (
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
        <IoMdClose className="icon" />
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
      <IoMdSearch className="icon" />
    </div>
  </div>
);

// @flow
import React from 'react';

type Option = {
  value: 'string',
  label: 'string'
};

type FormInput = {
  name: string,
  value: ?string
};

type Props = {
  input: FormInput,
  options: Array<Option>,
  disabled: boolean
};

const Select = ({ input, options, disabled = false }: Props) => {
  return (
    <div className="select">
      <select className="select__dropdown" {...input} disabled={disabled}>
        {options.map((option, i) => (
          <option key={i} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;

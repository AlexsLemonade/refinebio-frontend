// @flow
import React from 'react';
import Dropdown from '../Dropdown';
import './TimeRangeSelect.scss';

type Props = {
  selectedTimeRange: (value: number) => {},
  options: Array<{ value: number, label: string }>
};

let TimeRangeSelect = ({ selectedOption, options, onChange }: Props) => (
  <div className="time-range-select">
    <div className="time-range-select__field">
      <label className="time-range-select__label" htmlFor="timeRange">
        View:{' '}
      </label>

      <Dropdown
        className="time-range-select__dropdown"
        selectedOption={options.find(x => x.value === selectedOption).label}
        options={options.map(x => x.label)}
        onChange={selectedLabel => {
          const selectedValue = options.find(x => x.label === selectedLabel)
            .value;
          onChange(selectedValue);
        }}
      />
    </div>
  </div>
);
export default TimeRangeSelect;

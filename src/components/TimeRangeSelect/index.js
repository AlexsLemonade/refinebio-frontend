// @flow
import React from 'react';
import Dropdown from '../Dropdown';

// type Props = {
//   options: Array<{ value: number, label: string }>,
// };

const TimeRangeSelect = ({ selectedOption, options, onChange }) => (
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

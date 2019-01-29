// @flow
import React from 'react';
import Select from '../Select';
import './TimeRangeSelect.scss';

type Props = {
  selectedTimeRange: (value: number) => {},
  options: Array<{ value: number, label: string }>
};

let TimeRangeSelect = ({ selectedTimeRange, options }: Props) => (
  <div className="time-range-select">
    <div className="time-range-select__field">
      <label className="time-range-select__label" htmlFor="timeRange">
        Time Range:{' '}
      </label>

      <Select
        className="time-range-select__dropdown"
        options={options}
        component={Select}
        onChange={e => selectedTimeRange(e.target.value)}
      />
    </div>
  </div>
);
export default TimeRangeSelect;

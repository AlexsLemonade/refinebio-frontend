// @flow
import React from 'react';
import { reduxForm, Field } from 'redux-form';
import Select from '../Select';
import './TimeRangeSelect.scss';

type Props = {
  selectedTimeRange: (value: number) => {},
  options: Array<{ value: number, label: string }>
};

const TimeRangeSelect = (props: Props) => {
  function handleChange(e) {
    props.selectedTimeRange(e.target.value);
  }

  return (
    <div className="time-range-select">
      <div className="time-range-select__field">
        <label className="time-range-select__label" htmlFor="timeRange">
          Time Range:{' '}
        </label>
        <Field
          className="time-range-select__dropdown"
          name="timeRange"
          options={props.options}
          component={Select}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default reduxForm({
  form: 'timeRange'
})(TimeRangeSelect);

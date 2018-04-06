import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import './TimeRangeSelect.scss';

const Select = ({ input, options, disabled = false }) => {
  return (
    <div className="select">
      <select className="select__dropdown" {...input} disabled={disabled}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const TimeRangeSelect = props => {
  function handleChange(e) {
    props.updatedTimeRange(e.target.value);
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

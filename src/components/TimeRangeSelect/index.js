import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import './TimeRangeSelect.scss';

const Select = ({ input, options, disabled, onChange }) => {
  console.log(input);
  return (
    <div>
      <select {...input} disabled={disabled}>
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
      <label htmlFor="timeRange">Time Range: </label>
      <Field
        name="timeRange"
        options={props.options}
        component={Select}
        onChange={handleChange}
      />
    </div>
  );
};

export default reduxForm({
  form: 'timeRange'
})(TimeRangeSelect);

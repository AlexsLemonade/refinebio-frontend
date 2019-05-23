import React from 'react';
import spinner from '../common/images/spinner.gif';
import './Spinner.scss';

export default function Spinner() {
  return (
    <div className="spinner">
      <img src={spinner} width="59" height="54" alt="loading" />
    </div>
  );
}

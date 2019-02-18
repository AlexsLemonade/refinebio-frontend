import React from 'react';
import styles from './Spinner.scss';
import spinner from '../common/images/spinner.gif';

export default function Spinner() {
  return (
    <div className={styles.spinner}>
      <img src={spinner} width="59" height="54" alt="loading indicator" />
    </div>
  );
}

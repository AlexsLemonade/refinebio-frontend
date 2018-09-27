import React from 'react';
import Refinebiospinner from '@haiku/dvprasad-refinebiospinner/react';
import styles from './Spinner.scss';

export default function Spinner() {
  return (
    <div className={styles.spinner}>
      <Refinebiospinner loop={true} />
    </div>
  );
}

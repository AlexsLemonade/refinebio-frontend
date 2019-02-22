import React from 'react';
import { IoIosWarning } from 'react-icons/io';
import classnames from 'classnames';

export default function({ className, children }) {
  return (
    <p className={classnames('error', className)}>
      <IoIosWarning /> {children}
    </p>
  );
}

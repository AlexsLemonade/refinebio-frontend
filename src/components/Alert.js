import React from 'react';
import { IoIosWarning } from 'react-icons/io';
import Button from './Button';
import './Alert.scss';
import { useLocalStorage } from '../common/hooks';

export default function Alert({ children, dismissableKey = false }) {
  const [dismissed, setDismissed] = useLocalStorage(
    `alert/${dismissableKey}`,
    false
  );

  if (dismissed) return null;

  return (
    <div className="alert">
      <IoIosWarning className="alert__icon" />
      {children}
      {dismissableKey && (
        <Button
          text="Dismiss"
          buttonStyle="link"
          className="alert__dismiss"
          onClick={() => setDismissed(true)}
        />
      )}
    </div>
  );
}

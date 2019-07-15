import React from 'react';
import './Button.scss';
import classnames from 'classnames';
import { useWaitForAsync } from '../../common/hooks';

const Button = ({
  type = 'button',
  onClick,
  className = false,
  buttonStyle = false,
  isDisabled = false,
  text,
  children,
  ...props
}) => {
  const [loading, buttonClick] = useWaitForAsync(onClick);
  /* eslint-disable react/button-has-type */
  return (
    <button
      {...props}
      type={type}
      onClick={buttonClick}
      disabled={isDisabled}
      className={classnames({
        button: true,
        [className]: className,
        [`button--${buttonStyle}`]: buttonStyle,
        'button--loading': loading,
      })}
    >
      {text || children}
    </button>
  );
};

export default Button;

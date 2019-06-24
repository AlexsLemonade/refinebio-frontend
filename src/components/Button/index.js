import React from 'react';
import './Button.scss';
import classnames from 'classnames';

const Button = ({
  text,
  buttonStyle,
  isDisabled = false,
  className = '',
  children,
  type = 'button',
  onClick,
  ...props
}) => {
  const loadingRef = React.useRef(false);
  const promiseRef = React.useRef();

  const buttonClick = () => {
    if (typeof onClick === 'function') {
      if (loadingRef.current) return promiseRef.curent;
      const maybePromise = onClick();
      if (maybePromise && typeof maybePromise.then === 'function') {
        promiseRef.current = maybePromise;
        loadingRef.current = true;
        maybePromise.then(() => {
          promiseRef.current = undefined;
          loadingRef.current = false;
        });
      }
      return maybePromise;
    }
    return onClick;
  };

  const { current: isLoading } = loadingRef;
  const buttonStyleClass = buttonStyle ? `button--${buttonStyle}` : '';
  /* eslint-disable react/button-has-type */
  return (
    <button
      {...props}
      onClick={buttonClick}
      type={type}
      className={classnames({
        button: true,
        [buttonStyleClass]: true,
        [className]: true,
        'button--loading': isLoading,
      })}
      disabled={isDisabled}
    >
      {text || children}
    </button>
  );
};

export default Button;

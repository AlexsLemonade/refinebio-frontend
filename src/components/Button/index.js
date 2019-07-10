import React from 'react';
import './Button.scss';
import classnames from 'classnames';

const useWaitForAsync = func => {
  const mountedRef = React.useRef(true);
  const [waiting, setWaiting] = React.useState(false);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, [waiting]);

  return [
    waiting,
    async (...args) => {
      setWaiting(true);
      func && (await func(...args));
      if (mountedRef.current) setWaiting(false);
    },
  ];
};

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

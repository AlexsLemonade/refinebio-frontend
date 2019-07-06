import React from 'react';
import './Button.scss';
import classnames from 'classnames';

const useWaitForAsync = func => {
  const activeRef = React.useRef(true);
  const [waiting, setWaiting] = React.useState(false);

  React.useEffect(() => {
    activeRef.current = true;
    return () => {
      activeRef.current = false;
    };
  }, [waiting]);

  return [
    waiting,
    async (...args) => {
      if (typeof func === 'function') {
        setWaiting(true);
        await func(...args);
        if (activeRef.current) setWaiting(false);
      }
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

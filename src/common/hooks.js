import React from 'react';
import history from '../history';
import { getQueryParamObject } from './helpers';

/**
 * Calculate values from a dom node
 * @param {*} ref React ref to the dom node
 * @param {*} fn Function that calculates what's needed. Eg `el => el.getClientBoundingRect()`
 */
export function useDom(ref, fn) {
  const [result, setResult] = React.useState(null);

  React.useEffect(() => {
    if (ref.current) {
      setResult(fn(ref.current));
    }
  });

  return result;
}

/**
 * Thanks to https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
export function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  React.useEffect(
    () => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    },
    [delay]
  );
}

export function useHistory() {
  return {
    pathname: history.location.pathname,
    params: getQueryParamObject(history.location.search)
  };
}

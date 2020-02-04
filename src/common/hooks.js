import React from 'react';
// import history from '../history';
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
  }, [ref, fn]);

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
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return null;
  }, [delay]);
}

export function useHistory() {
  // TODOX history

  return {
    pathname: '/',
    params: {},
  };

  // return {
  //   pathname: history.location.pathname,
  //   params: getQueryParamObject(history.location.search),
  // };
}

/**
 * Thanks to https://usehooks.com/useLocalStorage
 * @param {*} key
 * @param {*} initialValue
 */
export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Get a state variable that's true while passed in function is being executed asynchronously.
 * Returns array containing waiting state and wrapped function that updates waiting state.
 * @param {*} func Function that will be wrapped.
 */
export function useWaitForAsync(func) {
  const mountedRef = React.useRef(true);
  const [waiting, setWaiting] = React.useState(false);

  React.useEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );

  return [
    waiting,
    async (...args) => {
      setWaiting(true);
      func && (await func(...args));
      if (mountedRef.current) setWaiting(false);
    },
  ];
}

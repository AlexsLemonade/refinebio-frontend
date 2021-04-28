import React from 'react';
import { isServer } from './helpers';

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
  }, [ref]);

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
      if (isServer) {
        return initialValue;
      }

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
      if (!isServer) {
        if (valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Same as useLocalStrage but updates state when local storage changes
 */

export function useWatchedLocalStorage(key, initialValue) {
  const getLocalStore = () => {
    if (!isServer) {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : undefined;
    }
    return undefined;
  };

  const setLocalStore = newValue => {
    if (!isServer) {
      if (newValue !== undefined) {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      } else {
        window.localStorage.removeItem(key);
      }
    }
  };

  const [value, setValue] = React.useState(
    () => getLocalStore() || initialValue
  );

  const setValueItem = newValue => {
    setValue(newValue);
    setLocalStore(newValue);
  };

  React.useEffect(() => {
    const newValue = getLocalStore();
    if (value !== newValue) {
      setValue(newValue || initialValue);
    }
  });

  // handle events from other windows
  React.useEffect(() => {
    const handleStorage = event => {
      const sameKey = event.key === key;
      const newNewValue = event.newValue !== value;
      const notNull = event.newValue !== null;
      if (sameKey && newNewValue && notNull) {
        setValue(JSON.parse(event.newValue));
      }
    };

    if (!isServer) {
      window.addEventListener('storage', handleStorage, false);
    }
    return () => {
      if (!isServer) {
        window.removeEventListener('storage', handleStorage, false);
      }
    };
  }, [value, setValue, key]);

  // return interface
  return [value, setValueItem];
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
      if (func) {
        await func(...args);
      }
      if (mountedRef.current) setWaiting(false);
    },
  ];
}

import React from 'react';

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

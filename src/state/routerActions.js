/** Copied from https://github.com/reactjs/react-router-redux/blob/master/src/actions.js */

export const CALL_HISTORY_METHOD = 'refinebio/CALL_HISTORY_METHOD';

function updateLocation(method) {
  return (...args) => ({
    type: CALL_HISTORY_METHOD,
    payload: { method, args },
  });
}

/**
 * These actions correspond to the history API.
 * The associated routerMiddleware will capture these events before they get to
 * your reducer and reissue them as the matching function on your history.
 */
export const push = updateLocation('push');
export const replace = updateLocation('replace');
export const goBack = updateLocation('back');

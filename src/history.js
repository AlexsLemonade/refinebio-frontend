
import createHistory from 'history/createBrowserHistory';

// Thanks to https://github.com/fabe/gatsby-universal/issues/4
// https://github.com/fabe/gatsby-universal/blob/8f65ed5a1500c17b4c3f5215ee204cbfb5616553/gatsby-browser.js#L9-L48
const getUserConfirmation = (location, callback) => {
  const [pathname, action] = location.split('|');

  // Check if user wants to navigate to the same page.
  // If so, we don't want to trigger the page transitions.
  // We have to check the `action`, because the pathnames
  // are the same when going back in history 🤷‍
  if (pathname === window.location.pathname && action === 'PUSH') {
    callback(false);
    return;
  }

  callback(true);
};

let history;
if (typeof document !== 'undefined') {
  history = createHistory({ getUserConfirmation });

  // `block` must return a string to conform.
  // We send both the pathname and action to `getUserConfirmation`.
  history.block((location, action) => `${location.pathname}|${action}`);
}

export default history;


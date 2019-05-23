import createHistory from 'history/createBrowserHistory';
import ReactGA from 'react-ga';

// Thanks to https://github.com/fabe/gatsby-universal/issues/4
// https://github.com/fabe/gatsby-universal/blob/8f65ed5a1500c17b4c3f5215ee204cbfb5616553/gatsby-browser.js#L9-L48
const getUserConfirmation = (location, callback) => {
  const [newUrl, action] = location.split('|');

  // Check if user wants to navigate to the same page.
  // If so, we don't want to trigger the page transitions.
  // We have to check the `action`, because the pathnames
  // are the same when going back in history 🤷‍
  const currentUrl = `${window.location.pathname}${window.location.search}`;
  if (newUrl === currentUrl && action === 'PUSH') {
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
  history.block((location, action) => {
    return `${location.pathname}${location.search}|${action}`;
  });
}

if (process.env.NODE_ENV === 'production') {
  // Setup Google Analytics on production
  // https://github.com/react-ga/react-ga/issues/122
  // https://github.com/open-austin/budgetparty/issues/163
  // https://github.com/open-austin/budgetparty/commit/9d07cca4e73faadbb245e0323bd031dd8c93704d
  ReactGA.initialize('UA-6025776-8');
  // Register the initial pageview
  registerPageView(window.location);

  history.listen(location => registerPageView(location));
}

history.listen((location, action) => {
  // ref https://github.com/ReactTraining/history#listening
  // reset the scroll position when the user navigates to a new page
  // except when the action is 'POP', for this case the scroll restoration
  // will take care
  if (action !== 'POP') {
    window.scrollTo(0, 0);
  }
});

function registerPageView(location) {
  const url = location.pathname + location.search;
  ReactGA.set({ page: url });
  ReactGA.pageview(url);
}

export default history;

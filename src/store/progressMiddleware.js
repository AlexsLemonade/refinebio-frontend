import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  minimum: 0.65,
});

/**
 * This counts the number of async actions that have been started. The progress bar is only displayed
 * on the first one. And it's finished when the last async action is done.
 */
let progressStackCount = 0;

/**
 * This middleware intercepts all asynchonous actions, and shows the top progress bar when there's an
 * async action pending.
 */
const progressMiddleware = ({ dispatch, getState }) => next => async action => {
  // async actions are functions
  if (typeof action === 'function') {
    if (progressStackCount === 0) {
      NProgress.start();
    }
    progressStackCount += 1;
    let result;

    try {
      result = await next(action);
    } finally {
      progressStackCount -= 1;
      if (progressStackCount === 0) {
        NProgress.done();
      }
    }

    return result;
  }

  return next(action);
};

export default progressMiddleware;

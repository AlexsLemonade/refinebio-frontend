/**
 * This middleware allows for dispatched actions to be called successively, FIFO.
 * Use by passing and action of type {queuedAction: func, queueChannel: 'CHANNEL_NAME_ACTION_TYPE'})
 * The action passe will be defered until
 */

const queueMiddleware = ({ dispatch, getState }) => {
  const queues = {};
  return next => async action => {
    const { queuedAction, queueChannel } = action;
    const isFunction = typeof queuedAction === 'function';
    const isObject = typeof queuedAction === 'object';
    const isQueueChannel = typeof queueChannel === 'string';
    const didQueue = (isFunction || isObject) && isQueueChannel;

    if (!didQueue) return next(action);

    const queue = Array.isArray(queues[queueChannel])
      ? queues[queueChannel]
      : (queues[queueChannel] = []);

    const promise = new Promise(async (resolve, reject) => {
      const resolveQueuedAction = async () => {
        if (typeof queuedAction === 'function') {
          try {
            const result = await queuedAction(dispatch, getState);
            return resolve(result);
          } catch (e) {
            return reject(e);
          }
        }
        // wasnt a function?
        return resolve(() => next(queuedAction));
      };
      // resolve now if queue is empty
      if (queue.length === 0) return resolveQueuedAction();
      // resolve when last promise in stack resolves
      return queue[queue.length - 1].then(resolveQueuedAction);
    });
    // enqueue
    queue.push(promise);
    // dequeue
    promise.then(() => queue.shift());

    return promise;
  };
};

export default queueMiddleware;

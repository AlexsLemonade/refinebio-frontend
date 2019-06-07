import React from 'react';
import isEqual from 'lodash/isEqual';
import { REPORT_ERROR } from '../../state/reportError';

// Component that abstracts the logic of loading content from the server before
// displaying something,
// Example Usage:
// <Loader fetch={()=>fetch('www.google.com', {param: 1})}>
//    {(data, isLoading)=>
//      ... content here, check that `isLoading === false` before using `data`
//    }
// </Loader>
export default class Loader extends React.Component {
  _mounted = true;

  state = {
    error: null,
    isLoading: true,
    data: null,
  };

  componentDidMount() {
    this._fetchData();
  }

  componentDidUpdate(prevProps) {
    // the property `updateProps` can be used to easily refresh the data in the loader
    // just add values that should trigger an update, and the component will take care
    // when they change
    if (!isEqual(prevProps.updateProps, this.props.updateProps)) {
      this._fetchData();
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    return this.props.children({
      ...this.state,
      // for some cases might be more convenient to use `hasError`
      hasError: !!this.state.error,
    });
  }

  refresh() {
    return this._fetchData();
  }

  async _fetchData() {
    this.setState({ error: null, isLoading: true });

    let data;
    try {
      data = await this.props.fetch();
    } catch (error) {
      this.setState({ isLoading: false, error });
      return;
    }

    if (data && data.type === REPORT_ERROR) {
      this.setState({ error: true });
    } else if (this._mounted) {
      /**
       * In some cases, if the `Loaded` component gets unmounted before the `fetch` request above
       * finishes we get a warning. Since `setState` can only be called on mounted components.
       * This check removes that warning.
       * It might be worth mentioning that when the instance of a component is unmounted it will
       * never be mounted again ref: https://github.com/facebook/react/issues/12111#issuecomment-361296432
       */
      this.setState({ isLoading: false, data });
    }
  }
}

/**
 * https://www.robinwieruch.de/react-hooks-fetch-data/
 * @param {*} state
 * @param {*} action
 */
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        hasError: false,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: null,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
      };
    default:
      throw new Error();
  }
};

/**
 *
 * @param {*} fetch Async function that returns data
 * @param {*} updateProps Similar to `useEffect` dependencies, you can add any values here that invalidate the result of `fetch`
 */
export function useLoader(fetch, updateProps = []) {
  // memoize the fetch
  const fetchRef = React.useRef(fetch);
  React.useEffect(() => {
    fetchRef.current = fetch;
  }, [fetchRef, fetch]); // updates more often than needed but its never stale and doesnt affect rendering because its in a ref
  // const {current: updatePropsMemo} = updatePropsRef;
  // Using a reducer helps remove the `state` dependency from the effect below
  // React guarantees that `dispatch` is unique accross renders.
  // https://overreacted.io/a-complete-guide-to-useeffect/#why-usereducer-is-the-cheat-mode-of-hooks
  const [state, dispatch] = React.useReducer(dataFetchReducer, {
    error: null,
    isLoading: true,
    data: null,
  });

  const fetchDataCallback = React.useCallback(async () => {
    dispatch({ type: 'FETCH_INIT' });

    try {
      const data = await fetchRef.current();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: error });
    }
  }, [fetchRef]); // never changes
  // useLoader will fetch Data when updateProps changes
  React.useEffect(() => {
    fetchDataCallback();
  }, [fetchDataCallback, ...updateProps]); // eslint-disable-line react-hooks/exhaustive-deps
  // returned for use in your component
  return {
    ...state,
    hasError: !!state.error,
    refresh: fetchDataCallback,
  };
}

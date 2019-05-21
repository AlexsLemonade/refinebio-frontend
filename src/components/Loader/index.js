import React from 'react';
import isEqual from 'lodash/isEqual';
import { REPORT_ERROR } from '../../state/reportError';

// Component abtract the logic of loading content from the server before
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

export function useLoader(fetch, updateProps = []) {
  const [state, setState] = React.useState({
    error: null,
    isLoading: true,
    data: null,
  });

  // ref that is active while the component is mounted
  // thanks to https://medium.com/@pshrmn/react-hook-gotchas-e6ca52f49328
  const mounted = React.useRef(1);
  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchDataCallback = React.useCallback(
    async function fetchData(version) {
      setState({ ...state, isLoading: true, error: null });

      try {
        const data = await fetch();

        // before modifying the state ensure that the component is still mounted
        // and that no other `fetch` calls have been made. In which case this response
        // would be obsolete.
        if (!mounted.current || version !== mounted.current) return;
        setState({ error: null, isLoading: false, data });
      } catch (error) {
        if (!mounted.current || version !== mounted.current) return;
        setState({ ...state, isLoading: false, error });
      }
    },
    [fetch, state]
  );

  React.useEffect(
    () => {
      mounted.current += 1;
      fetchDataCallback(mounted.current);
    },
    [fetchDataCallback, ...updateProps] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return {
    ...state,
    hasError: !!state.error,
    refresh: async () => {
      mounted.current += 1;
      await fetchDataCallback(mounted.current);
    },
  };
}

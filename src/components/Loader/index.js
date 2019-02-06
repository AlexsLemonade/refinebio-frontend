import React from 'react';
import { REPORT_ERROR } from '../../state/reportError';
import isEqual from 'lodash/isEqual';

// Component abtract the logic of loading content from the server before displaying something,
// Example Usage:
// <Loader fetch={()=>fetch('www.google.com', {param: 1})}>
//    {(data, isLoading)=>
//      ... content here, check that `isLoading === false` before using `data`
//    }
// </Loader>
export default class Loader extends React.Component {
  _mounted = true;

  state = {
    hasError: false,
    isLoading: true,
    data: null
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
    return this.props.children(this.state);
  }

  refresh() {
    return this._fetchData();
  }

  async _fetchData() {
    this.setState({ hasError: false, isLoading: true });

    let data;
    try {
      data = await this.props.fetch();
    } catch (e) {
      this.setState({ isLoading: false, hasError: true });
      return;
    }

    if (data && data.type === REPORT_ERROR) {
      this.setState({ hasError: true });
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

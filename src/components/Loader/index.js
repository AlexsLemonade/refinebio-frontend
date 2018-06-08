import React from 'react';
import { REPORT_ERROR } from '../../state/reportError';

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

  async componentDidMount() {
    this.setState({ isLoading: true });
    const data = await this.props.fetch();

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

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    return this.props.children(this.state);
  }
}

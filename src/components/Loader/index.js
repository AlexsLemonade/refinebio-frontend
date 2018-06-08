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
    } else {
      this.setState({ isLoading: false, data });
    }
  }

  render() {
    return this.props.children(this.state);
  }
}

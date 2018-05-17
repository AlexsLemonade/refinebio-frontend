import React from 'react';

// Component abtract the logic of loading content from the server before displaying something,
// Example Usage:
// <Loader fetch={()=>fetch('www.google.com', {param: 1})}>
//    {(data, isLoading)=>
//      ... content here, check that `isLoading === false` before using `data`
//    }
// </Loader>
export default class Loader extends React.Component {
  state = {
    isLoading: true,
    data: null
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    let data = await this.props.fetch();
    this.setState({ isLoading: false, data });
  }

  render() {
    return this.props.children(this.state);
  }
}

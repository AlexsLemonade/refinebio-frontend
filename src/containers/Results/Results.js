import React, { Component } from 'react';

class Results extends Component {
  componentWillMount() {}

  render() {
    const { location } = this.props;

    const q = location.search.substr(1).replace(/q=/, '');
    return <div>Results for {q}</div>;
  }
}

export default Results;

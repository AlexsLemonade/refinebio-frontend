import React from 'react';
import { connect } from 'react-redux';
import { fetchPlatforms } from '../state/platforms';

/**
 * Renders the pretty name of a platform
 */
class Platform extends React.Component {
  componentDidMount() {
    this.props.fetchPlatforms();
  }

  render() {
    if (
      !this.props.platforms ||
      !this.props.platforms[this.props.accessionCode]
    ) {
      return this.props.accessionCode;
    }

    return this.props.platforms[this.props.accessionCode].pretty_name;
  }
}
Platform = connect(
  ({ platforms }) => ({ platforms }),
  { fetchPlatforms }
)(Platform);
export default Platform;

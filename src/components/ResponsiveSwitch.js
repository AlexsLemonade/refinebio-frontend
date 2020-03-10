import React from 'react';

// This constant should be synced with the media queries that determine what width is
// for desktop
const DESKTOP_LIMIT = 1024;
const MOBILE_LIMIT = 768;

/**
 * thanks to https://goshakkk.name/different-mobile-desktop-tablet-layouts-react/
 */
export default class ResponsiveSwitch extends React.Component {
  state = {
    width: 1280, // assume desktop on the server
  };

  componentWillMount() {}

  componentDidMount() {
    this.setState({
      width: window.innerWidth,
    });
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  // make sure to remove the listener
  // when the component is not mounted anymore
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  render() {
    const { mobile, desktop } = this.props;
    const isMobile = this.state.width < this._getLimit();

    if (isMobile) {
      return mobile();
    }
    return desktop();
  }

  _getLimit() {
    if (this.props.break === 'mobile') {
      return MOBILE_LIMIT;
    }

    return DESKTOP_LIMIT;
  }
}

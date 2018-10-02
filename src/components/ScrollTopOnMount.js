import React from 'react';

/**
 * Scroll to the top of the page when the component is mounted, useful for long pages
 * thanks to https://reacttraining.com/react-router/web/guides/scroll-restoration/scroll-to-top
 */
class ScrollTopOnMount extends React.Component {
  componentDidMount() {
    const { hash } = window.location;
    if (hash === '') {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

export default ScrollTopOnMount;

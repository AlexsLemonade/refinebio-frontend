import React from 'react';

/**
 * Scroll to the top of the page when the component is mounted, useful for long pages
 * thanks to https://reacttraining.com/react-router/web/guides/scroll-restoration/scroll-to-top
 */
export default class ScrollTopOnMount extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return null;
  }
}

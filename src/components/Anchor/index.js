import React from 'react';

/**
 * Creates an anchor class that scrolls to its possition if the correct hash has been specified
 * Only when the component is loaded
 */
export default class Anchor extends React.Component {
  componentDidMount() {
    // thanks to https://github.com/ReactTraining/react-router/issues/394#issuecomment-220221604
    const { hash } = window.location;
    const id = hash.replace('#', '');
    if (id === this.props.name) {
      setTimeout(() => {
        const offset = this.element.offsetTop;
        // Substract the top bar height from the element's position
        window.scrollTo({ top: offset - this._topBarHeight() });
      }, 0);
    }
  }

  render() {
    return <div ref={x => (this.element = x)}>{this.props.children()}</div>;
  }

  /**
   * To work properly this component needs to measure the height of the header, to be able to calculate
   * the correct position of the scrollbar when navigating to an element in the screen.
   *
   * This method is probably an anti-pattern in React, since it creates a dependency between this component and
   * the header component that is in other place. A better solution could take advantage of the React Context API
   * but that seemed overcomplicated for this use case.
   */
  _topBarHeight() {
    return document.getElementsByClassName('js-header')[0].offsetHeight;
  }
}

import React from 'react';

/**
 * This constant is used to correct the scroll bar position when navigating to an anchor
 * Since we want the target element to appear below the scrollbar
 */
const TOP_BAR_HEIGHT = 110;

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
        window.scrollTo({ top: offset - TOP_BAR_HEIGHT });
      }, 0);
    }
  }

  render() {
    return <a ref={x => (this.element = x)} name={this.props.name} />;
  }
}

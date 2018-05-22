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
        this.element.scrollIntoView();
      }, 0);
    }
  }

  render() {
    return <a ref={x => (this.element = x)} name={this.props.name} />;
  }
}

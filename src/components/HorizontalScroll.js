import React from 'react';
import './HorizontalScroll.scss';

/**
 * Adds buttons to modify the horizontal scroll position of an element. It's usually
 * the container of the children, unless a specific `targetSelector` is passed.
 */
export default class HorizontalScroll extends React.Component {
  state = {
    disableLeftButton: false,
    disableRightButton: false
  };

  componentDidMount() {
    this._getElement().addEventListener(
      'scroll',
      this.disableScrollButtonsIfNecessary
    );

    window.addEventListener('resize', this.disableScrollButtonsIfNecessary);
  }

  componentWillUnmount() {
    this._getElement().removeEventListener(
      'scroll',
      this.disableScrollButtonsIfNecessary
    );
    window.removeEventListener('resize', this.disableScrollButtonsIfNecessary);
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.disableScrollButtonsIfNecessary();
    }
  }

  getMaxScrollPosition = () => {
    const element = this._getElement();
    return element.scrollWidth - element.clientWidth;
  };

  disableScrollButtonsIfNecessary = () => {
    const element = this._getElement();
    this.setState({
      disableLeftButton: element.scrollLeft <= 0,
      disableRightButton: element.scrollLeft >= this.getMaxScrollPosition()
    });
  };

  scrollLeft = () => {
    this._getElement().scrollBy({
      top: 0,
      left: -100,
      behavior: 'smooth'
    });
  };

  scrollRight = () => {
    this._getElement().scrollBy({
      top: 0,
      left: 100,
      behavior: 'smooth'
    });
  };

  render() {
    return (
      <div className="horizontal-scroll">
        <div
          className={`horizontal-scroll__left ${
            this.state.disableLeftButton ? 'horizontal-scroll__disabled' : ''
          }`}
          onClick={this.scrollLeft}
        >
          <div className="horizontal-scroll__button">{'<'}</div>
        </div>

        <div
          className="horizontal-scroll__content"
          ref={x => (this._targetContainer = x)}
        >
          {this.props.children}
        </div>

        <div
          className={`horizontal-scroll__right ${
            this.state.disableRightButton ? 'horizontal-scroll__disabled' : ''
          }`}
          onClick={this.scrollRight}
        >
          <div className="horizontal-scroll__button">{'>'}</div>
        </div>
      </div>
    );
  }

  _getElement() {
    let result = this._targetContainer;

    if (result && this.props.targetSelector) {
      result = result.querySelector(this.props.targetSelector);
    }

    return result;
  }
}

import React, { useRef } from 'react';
import './HorizontalScroll.scss';
import classnames from 'classnames';
import useVisibility from 'react-use-visibility';

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
          className="horizontal-scroll__content"
          ref={x => (this._targetContainer = x)}
        >
          {this.props.children}
        </div>
        <ButtonLeft
          onClick={this.scrollLeft}
          disabled={this.state.disableLeftButton}
        />
        <ButtonRight
          onClick={this.scrollRight}
          disabled={this.state.disableRightButton}
        />
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

function ButtonLeft({ onClick, disabled }) {
  return (
    <div
      className={classnames({
        'horizontal-scroll__left': true,
        'horizontal-scroll__disabled': disabled
      })}
      onClick={onClick}
    >
      <div className="horizontal-scroll__button">{'<'}</div>
    </div>
  );
}

function ButtonRight({ onClick, disabled }) {
  const ref = useRef();
  const isVisible = useVisibility(ref.current);

  return (
    <div
      className={classnames({
        'horizontal-scroll__right': true,
        'horizontal-scroll__disabled': disabled
      })}
      onClick={onClick}
    >
      <div
        ref={ref}
        className={classnames({
          'horizontal-scroll__button': true,
          'horizontal-scroll__button--animate': isVisible
        })}
      >
        {'>'}
      </div>
    </div>
  );
}

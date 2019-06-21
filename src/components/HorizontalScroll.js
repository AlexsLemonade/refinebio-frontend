import React, { useRef } from 'react';
import './HorizontalScroll.scss';
import classnames from 'classnames';
import useVisibility from 'react-use-visibility';

/**
 * Keep track of a global timer for nudging the user to view the
 * right scroll button. This resets every 10min starting after the
 * first time it is animated.
 */
let showAnimation = true;
let animationTimer = false;
const didAnimate = () => {
  showAnimation = false;
  animationTimer =
    animationTimer ||
    setInterval(() => {
      showAnimation = true;
    }, 10 * 60 * 1000);
};

/**
 * Adds buttons to modify the horizontal scroll position of an element. It's usually
 * the container of the children, unless a specific `targetSelector` is passed.
 */
export default class HorizontalScroll extends React.Component {
  state = {
    disableLeftButton: false,
    disableRightButton: false,
  };

  componentDidMount() {
    this.getElement().addEventListener(
      'scroll',
      this.disableScrollButtonsIfNecessary
    );

    window.addEventListener('resize', this.disableScrollButtonsIfNecessary);
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.disableScrollButtonsIfNecessary();
    }
  }

  componentWillUnmount() {
    this.getElement().removeEventListener(
      'scroll',
      this.disableScrollButtonsIfNecessary
    );
    window.removeEventListener('resize', this.disableScrollButtonsIfNecessary);
  }

  getElement() {
    let result = this.targetContainer;

    if (result && this.props.targetSelector) {
      result = result.querySelector(this.props.targetSelector);
    }

    return result;
  }

  getMaxScrollPosition = () => {
    const element = this.getElement();
    return element.scrollWidth - element.clientWidth;
  };

  disableScrollButtonsIfNecessary = () => {
    const element = this.getElement();
    this.setState({
      disableLeftButton: element.scrollLeft <= 0,
      disableRightButton: element.scrollLeft >= this.getMaxScrollPosition(),
    });
  };

  scrollLeft = () => {
    this.getElement().scrollBy({
      top: 0,
      left: -100,
      behavior: 'smooth',
    });
  };

  scrollRight = () => {
    this.getElement().scrollBy({
      top: 0,
      left: 100,
      behavior: 'smooth',
    });
  };

  render() {
    return (
      <div className="horizontal-scroll">
        <div
          className="horizontal-scroll__content"
          ref={x => {
            this.targetContainer = x;
          }}
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
}

function ButtonLeft({ onClick, disabled }) {
  return (
    <button
      type="button"
      className={classnames({
        'horizontal-scroll__left': true,
        'horizontal-scroll__disabled': disabled,
      })}
      onClick={onClick}
    >
      <div className="horizontal-scroll__button">{'<'}</div>
    </button>
  );
}

function ButtonRight({ onClick, disabled }) {
  const ref = useRef();
  const isVisible = useVisibility(ref.current);
  const animate = showAnimation && (isVisible && !disabled);

  React.useEffect(() => {
    if (animate) didAnimate();
  }, [animate]);

  return (
    <button
      type="button"
      className={classnames({
        'horizontal-scroll__right': true,
        'horizontal-scroll__disabled': disabled,
      })}
      onClick={onClick}
    >
      <div
        ref={ref}
        className={classnames({
          'horizontal-scroll__button': true,
          'horizontal-scroll__button--animate': animate,
        })}
      >
        {'>'}
      </div>
    </button>
  );
}

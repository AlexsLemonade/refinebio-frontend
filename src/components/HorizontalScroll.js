import React from 'react';

export default class HorizontalScroll extends React.Component {
  state = {};

  componentDidMount() {
    document
      .querySelector('.samples-table__scroll-right')
      .addEventListener('click', this.scrollRight);

    document
      .querySelector('.samples-table__scroll-left')
      .addEventListener('click', this.scrollLeft);

    document
      .querySelector('.rt-table')
      .addEventListener('scroll', this.disableScrollButtonsIfNecessary);

    // This is apparently the idiomatic way to trigger a callback if a specific attribute changed.
    // This detects resizing on the react-table because while the table is resizing the inline
    // style for max-width changes on '.rt-thead'.
    this.state.resizeObserver = new MutationObserver(
      this.disableScrollButtonsIfNecessary
    );
    this.state.resizeObserver.observe(document.querySelector('.rt-thead'), {
      attributes: true,
      attributeFilter: ['style']
    });
  }

  componentDidUpdate(prevProps) {
    this.disableScrollButtonsIfNecessary();
  }

  getMaxScrollPosition = () => {
    const element = document.querySelector('.rt-table');
    return element.scrollWidth - element.clientWidth;
  };

  disableScrollButtonsIfNecessary = () => {
    const element = document.querySelector('.rt-table');
    if (element.scrollLeft <= 0) {
      document
        .querySelector('.samples-table__scroll-left')
        .classList.add('samples-table__scroll--disabled');
    } else {
      document
        .querySelector('.samples-table__scroll-left')
        .classList.remove('samples-table__scroll--disabled');
    }

    if (element.scrollLeft >= this.getMaxScrollPosition()) {
      document
        .querySelector('.samples-table__scroll-right')
        .classList.add('samples-table__scroll--disabled');
    } else {
      document
        .querySelector('.samples-table__scroll-right')
        .classList.remove('samples-table__scroll--disabled');
    }
  };

  scrollLeft = () => {
    document.querySelector('.rt-table').scrollBy({
      top: 0,
      left: -100,
      behavior: 'smooth'
    });
  };

  scrollRight = () => {
    document.querySelector('.rt-table').scrollBy({
      top: 0,
      left: 100,
      behavior: 'smooth'
    });
  };

  render() {
    return (
      <div>
        <div className="samples-table__scroll-left">
          <div className="samples-table__scroll-button">{'<'}</div>
        </div>
        {this.props.children}
        <div
          ref={x => this._scrollRight}
          className="samples-table__scroll-right"
        >
          <div className="samples-table__scroll-button">{'>'}</div>
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';
import './Toggle.scss';
import classnames from 'classnames';

class Toggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
    };
  }

  handleToggle = tabIndex => {
    const { onToggle } = this.props;

    this.setState({
      activeTabIndex: tabIndex,
    });

    if (onToggle) {
      onToggle(tabIndex);
    }
  };

  render() {
    const { tabs } = this.props;

    return (
      <div className={classnames('toggle', this.props.className)}>
        <ul className="toggle__container">
          {tabs.map(
            (tab, i) =>
              !!tab && (
                <li key={tab.toString()} className="toggle__item">
                  <button
                    type="button"
                    className={`toggle__button ${
                      i === this.state.activeTabIndex
                        ? 'toggle__button--active'
                        : ''
                    }`}
                    onClick={() => this.handleToggle(i)}
                  >
                    {tab}
                  </button>
                </li>
              )
          )}
        </ul>
      </div>
    );
  }
}

export default Toggle;

import React, { Component } from 'react';
import './Toggle.scss';

class Toggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0
    };
  }

  handleToggle = tabIndex => {
    const { onToggle } = this.props;

    this.setState({
      activeTabIndex: tabIndex
    });

    if (onToggle) {
      onToggle(tabIndex);
    }
  };

  render() {
    const { tabs } = this.props;

    return (
      <div className="toggle">
        <ul className="toggle__container">
          {tabs.map((tab, i) => (
            <li
              key={i}
              className={`toggle__item ${
                i === this.state.activeTabIndex ? 'toggle__item--active' : ''
              }`}
            >
              <button onClick={() => this.handleToggle(i)}>{tab}</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Toggle;

import React from 'react';
import Toggle from '../Toggle';

/**
 * Renders a simple tab control with a `Toggle` at the top, each tab item can be specified
 * as children of this component. At any given time only one of those childrens will be rendered
 * The one that has the same index as the selected tab.
 */
export default class TabControl extends React.Component {
  state = {
    tabIndex: 0
  };

  handleTabChange = tabIndex => {
    this.setState({
      tabIndex
    });
  };

  render() {
    return (
      <div>
        <Toggle tabs={this.props.tabs} onToggle={this.handleTabChange} />
        {React.Children.toArray(this.props.children)[this.state.tabIndex]}
      </div>
    );
  }
}

import React from 'react';
import Toggle from '../Toggle';

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

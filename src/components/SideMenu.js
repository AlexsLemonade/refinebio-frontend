import React from 'react';
import Modal from 'react-modal';
import classnames from 'classnames';

import './SideMenu.scss';

export default class SideMenu extends React.Component {
  state = {
    menuOpen: false,
  };

  showMenu = () => this.setState({ menuOpen: true });

  hideMenu = () => this.setState({ menuOpen: false });

  render() {
    return (
      <React.Fragment>
        {this.props.component(this.showMenu)}

        <Modal
          isOpen={this.state.menuOpen}
          onRequestClose={this.hideMenu}
          overlayClassName="modal-backdrop"
          className={classnames('side-menu', {
            'side-menu--top': this.props.orientation === 'top',
          })}
          bodyOpenClassName="modal-open"
        >
          <div className="side-menu__content">
            {this.props.children({
              hideMenu: this.hideMenu,
            })}
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

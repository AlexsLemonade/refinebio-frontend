import React from 'react';
import Modal from 'react-modal';
import Button from '../Button';

import './Modal.scss';

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

// This class makes it easier to create a Component that displays a modal dialog.
// It abstracts the functionality that saves the state wether the dialog is open or not.
// Example usage:
//   <ModalManager component={(showModal)=><Button buttonStyle="secondary" text="Share" onClick={showModal} />}
//                 modalProps={{center: true, className: 'share-link-modal'}}>
//     {() => <div>
//       <h1 className="share-link-modal__title">Sharable Link</h1>
//       <InputCopy value="Url to be copied, connect redux" />
//     </div>}
//   </ModalManager>
export default class ModalManager extends React.Component {
  static defaultProps = {
    // set custom properties to the modal
    modalProps: {
      // center the modal vertically in the page
      center: false,

      // Prevents the modal from being bigger than the screen when true
      fillPage: false
    }
  };

  state = {
    modalOpen: false
  };

  showModal = () => this.setState({ modalOpen: true });

  hideModal = () => this.setState({ modalOpen: false });

  render() {
    return (
      <React.Fragment>
        {this.props.component(this.showModal)}
        <Modal
          {...this.props.modalProps}
          isOpen={this.state.modalOpen}
          onRequestClose={this.hideModal}
          overlayClassName={`modal-backdrop ${
            this.props.modalProps.center
              ? 'modal-backdrop--center'
              : 'modal-backdrop--top'
          }`}
          className={`modal ${this.props.modalProps.className || ''}  ${
            this.props.modalProps.fillPage ? 'modal--fill-page' : ''
          }`}
          bodyOpenClassName="modal-open"
        >
          {this.props.children({
            hideModal: this.hideModal
          })}

          <Button
            className="modal__close"
            onClick={this.hideModal}
            buttonStyle="transparent"
          >
            <i className="icon ion-close" />
          </Button>
        </Modal>
      </React.Fragment>
    );
  }
}

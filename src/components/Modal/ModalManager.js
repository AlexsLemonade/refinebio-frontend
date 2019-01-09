import React from 'react';
import Modal from 'react-modal';
import Button from '../Button';
import classnames from 'classnames';

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
    modalOpen: false,
    modalLevel: 0
  };

  render() {
    return (
      <ModalContext.Consumer>
        {({ level, stackModal, popModal }) => {
          const showModal = () => {
            this.setState({ modalOpen: true, modalLevel: level + 1 });
            stackModal();
          };

          const hideModal = () => {
            this.setState({ modalOpen: false });
            popModal();
          };

          return (
            <React.Fragment>
              {this.props.component(showModal)}

              <Modal
                {...this.props.modalProps}
                isOpen={this.state.modalOpen}
                onRequestClose={hideModal}
                overlayClassName={classnames('modal-backdrop', {
                  // This is the trick to multiple stacked modals, all are part of the DOM but only the last
                  // one is displayed. Others are hidden with this class.
                  hidden: this.state.modalLevel !== level,
                  'modal-backdrop--center': this.props.modalProps.center,
                  'modal-backdrop--top': !this.props.modalProps.center
                })}
                className={`modal ${this.props.modalProps.className || ''}  ${
                  this.props.modalProps.fillPage ? 'modal--fill-page' : ''
                }`}
                bodyOpenClassName="modal-open"
              >
                <div className="modal__content">
                  {this.props.children({
                    hideModal: hideModal
                  })}

                  {level > 1 && (
                    <Button
                      className="modal__back"
                      onClick={hideModal}
                      buttonStyle="link"
                    >
                      {'< Back'}
                    </Button>
                  )}

                  <Button
                    className="modal__close"
                    onClick={hideModal}
                    buttonStyle="transparent"
                  >
                    <i className="icon ion-close" />
                  </Button>
                </div>
              </Modal>
            </React.Fragment>
          );
        }}
      </ModalContext.Consumer>
    );
  }
}

const ModalContext = React.createContext({
  level: 0,
  stackModal: () => {},
  popModal: () => {}
});

// Provider for React Context https://reactjs.org/docs/context.html
// This wraps the entire application so that all modal dialogs have access to it.
export class ModalStackProvider extends React.Component {
  state = {
    level: 0
  };

  stackModal = () => this.setState(state => ({ level: state.level + 1 }));

  popModal = () =>
    this.setState(state => {
      return { level: state.level - 1 };
    });

  render() {
    return (
      <ModalContext.Provider
        value={{
          ...this.state,
          stackModal: this.stackModal,
          popModal: this.popModal
        }}
      >
        {this.props.children}
      </ModalContext.Provider>
    );
  }
}

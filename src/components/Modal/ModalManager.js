import React from 'react';
import Modal from 'react-modal';
import classnames from 'classnames';
import { IoMdClose } from 'react-icons/io';
import Button from '../Button';

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('body');

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
      fillPage: false,
    },
  };

  state = {
    modalOpen: false,
    childOpen: false,
  };

  render() {
    return (
      <ModalContext.Consumer>
        {({ hasParent, stackModal, popModal, onBack }) => {
          const handleShowModal = () => {
            this.setState({ modalOpen: true });
            stackModal();
          };
          const handleHideModal = () => {
            this.setState({ modalOpen: false, childOpen: false });
            popModal();
          };
          const handleBack = () => {
            this.setState({ modalOpen: false, childOpen: false });
            onBack();
          };

          return (
            <React.Fragment>
              {this.props.component(handleShowModal)}

              <Modal
                {...this.props.modalProps}
                isOpen={this.state.modalOpen}
                onRequestClose={handleHideModal}
                overlayClassName={classnames('modal-backdrop', {
                  // This is the trick to multiple stacked modals, all are part of the DOM but only the last
                  // one is displayed. Others are hidden with this class.
                  hidden: this.state.childOpen,
                  'modal-backdrop--center': this.props.modalProps.center,
                  'modal-backdrop--top': !this.props.modalProps.center,
                })}
                className={`modal ${this.props.modalProps.className || ''}  ${
                  this.props.modalProps.fillPage ? 'modal--fill-page' : ''
                }`}
                bodyOpenClassName="modal-open"
              >
                <div className="modal__content">
                  {/* Add a new contect for child modals */}
                  <ModalStackProvider
                    onOpen={() => this.setState({ childOpen: true })}
                    onClose={handleHideModal}
                    onBack={() =>
                      this.setState({ modalOpen: true, childOpen: false })
                    }
                    hasParent
                  >
                    {this.props.children({
                      hideModal: handleHideModal,
                    })}
                  </ModalStackProvider>

                  {hasParent && (
                    <Button
                      className="modal__back"
                      onClick={handleBack}
                      buttonStyle="link"
                    >
                      {'< Back'}
                    </Button>
                  )}

                  <Button
                    className="modal__close"
                    onClick={handleHideModal}
                    buttonStyle="transparent"
                  >
                    <IoMdClose className="icon" />
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
  hasParent: false,
  stackModal: () => {},
  popModal: () => {},
  onBack: () => {},
});

// Provider for React Context https://reactjs.org/docs/context.html
// Modal dialogs will have to comunicate with the parent modal dialog,
export function ModalStackProvider({
  children,
  hasParent,
  onOpen,
  onClose,
  onBack,
}) {
  return (
    <ModalContext.Provider
      value={{
        hasParent,
        stackModal: () => onOpen && onOpen(),
        popModal: () => onClose && onClose(),
        onBack: () => onBack && onBack(),
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

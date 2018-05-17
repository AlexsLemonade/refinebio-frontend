import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.scss';
import Button from '../Button';

type Props = {
  // Determines wether the modal is displayed or not. Note that the modal is only added to the DOM
  // when its being displayed
  isOpen: boolean,
  // Set to true for modals that should be centered
  center: boolean,
  // This callback is called when the user wants to close the dialog.
  onClose: () => void
};

const modalRoot = document.body;

// Generic Modal Component
// thanks to https://reactjs.org/docs/portals.html
export default class Modal extends React.Component {
  constructor(props: Props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
    this._addBodyClass();
  }

  componentDidUpdate() {
    this._addBodyClass();
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this._renderContent(), this.el);
  }

  // As a side effect of oppening the modal we need to add the class `modal-open` to the body
  // if there's a modal dialog open. This removes the scroll bars from the body, leaving only
  // the ones from the dialog (if they are needed).
  _addBodyClass() {
    if (this.props.isOpen) {
      modalRoot.classList.add('modal-open');
    } else {
      modalRoot.classList.remove('modal-open');
    }
  }

  _renderContent() {
    // Ensure the children of the components are only rendered if the modal is open
    if (!this.props.isOpen) {
      return <div />;
    }

    return (
      <div>
        <div className="modal-backdrop" />

        <div
          className={`modal ${
            this.props.center ? 'modal--center' : 'modal--top'
          }`}
          // Check that clicks were originated exactly on the `.modal` element, aka outside of the
          // modal dialog. Clicks inside of the modal dialog will trigger this handler too.
          onClick={e => e.target === e.currentTarget && this._closeModal()}
        >
          <div className={`modal__dialog ${this.props.className}`}>
            {this.props.children}

            <Button
              className="modal__close"
              onClick={() => this._closeModal()}
              buttonStyle="transparent"
            >
              <i className="icon ion-close" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  _closeModal() {
    this.props.onClose && this.props.onClose();
  }
}

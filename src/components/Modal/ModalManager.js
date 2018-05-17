import React from 'react';
import Modal from './index';

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
  state = {
    modalOpen: false
  };

  render() {
    return (
      <React.Fragment>
        {this.props.component(() => this.setState({ modalOpen: true }))}
        <Modal
          {...this.props.modalProps}
          key="2"
          isOpen={this.state.modalOpen}
          onClose={() => this.setState({ modalOpen: false })}
        >
          {this.props.children()}
        </Modal>
      </React.Fragment>
    );
  }
}

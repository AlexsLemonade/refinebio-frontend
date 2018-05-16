import React from 'react';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import Modal from '../../components/Modal';
import InputCopy from '../../components/InputCopy';
import './DownloadBar.scss';

const DownloadBar = () => {
  return (
    <div className="downloads__bar">
      <ShareButton />

      <div className="downloads__actions">
        <div className="downloads__fieldset">
          <label className="downloads__label">
            Aggregate
            <Dropdown
              options={['Experiments', 'Samples']}
              selectedOption={'Experiments'}
            />
          </label>
          <label className="downloads__label">
            Transformation
            <Dropdown options={['None', 'Samples']} selectedOption={'None'} />
          </label>
        </div>
        <Button text="Download" />
      </div>
    </div>
  );
};

export default DownloadBar;

// The state of the modal could be saved in the Redux store, but since is not needed anywhere else in the app
// it may be better to store in the component's state instead.
class ShareButton extends React.Component {
  state = {
    shareModalOpen: false
  };

  render() {
    return (
      <div>
        <Button
          buttonStyle="secondary"
          text="Share"
          onClick={() =>
            this.setState({ shareModalOpen: !this.state.shareModalOpen })
          }
        />

        <Modal
          isOpen={this.state.shareModalOpen}
          center={true}
          onClose={() => this.setState({ shareModalOpen: false })}
          className="share-link-modal"
        >
          <h1 className="share-link-modal__title">Sharable Link</h1>
          <InputCopy value="Url to be copied, connect redux" />
        </Modal>
      </div>
    );
  }
}

import React from 'react';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import ModalManager from '../../components/Modal/ModalManager';
import InputCopy from '../../components/InputCopy';
import './DownloadBar.scss';
import { connect } from 'react-redux';

let DownloadBar = ({ dataSetId, shareUrl }) => {
  return (
    <div className="downloads__bar">
      <ModalManager
        component={showModal => (
          <Button buttonStyle="secondary" text="Share" onClick={showModal} />
        )}
        modalProps={{ center: true, className: 'share-link-modal' }}
      >
        {() => (
          <div>
            <h1 className="share-link-modal__title">Sharable Link</h1>
            <InputCopy
              value={`${window.location.origin}/download/${dataSetId}`}
            />
          </div>
        )}
      </ModalManager>

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

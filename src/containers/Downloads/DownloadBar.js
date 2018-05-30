import React from 'react';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import ModalManager from '../../components/Modal/ModalManager';
import InputCopy from '../../components/InputCopy';
import './DownloadBar.scss';
import { startDownload } from '../../state/download/actions';
import { connect } from 'react-redux';
import { getDomain } from '../../common/helpers';

let DownloadBar = ({ dataSetId, shareUrl, startDownload }) => {
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
            <InputCopy value={`${getDomain()}/download/${dataSetId}`} />
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
        <Button text="Download" onClick={startDownload} />
      </div>
    </div>
  );
};
DownloadBar = connect(state => ({}), {
  startDownload
})(DownloadBar);
export default DownloadBar;

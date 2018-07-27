import React from 'react';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import ModalManager from '../../components/Modal/ModalManager';
import InputCopy from '../../components/InputCopy';
import './DownloadBar.scss';
import { startDownload } from '../../state/download/actions';
import { connect } from 'react-redux';
import { getDomain } from '../../common/helpers';
import { Link } from 'react-router-dom';

let DownloadBar = ({ dataSetId, aggregation, aggregationOnChange }) => {
  return (
    <div className="downloads__bar">
      <ModalManager
        component={showModal => (
          <Button
            buttonStyle="secondary"
            text="Share Dataset"
            onClick={showModal}
          />
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
              // If there is no aggregationOnChange function, the DownloadBar
              // is immutable, so the only option is the current one. This
              // happens when viewing a shared dataset.
              options={
                aggregationOnChange ? ['Experiment', 'Species'] : [aggregation]
              }
              selectedOption={aggregation}
              onChange={aggregationOnChange}
              // The dropdown should also be disabled if there is no
              // aggregationOnChange function
              disabled={!aggregationOnChange}
            />
          </label>
        </div>
        <Link className="button" to={`/dataset/${dataSetId}`}>
          Download
        </Link>
      </div>
    </div>
  );
};
DownloadBar = connect(state => ({}), {
  startDownload
})(DownloadBar);
export default DownloadBar;

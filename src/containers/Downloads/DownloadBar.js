import React from 'react';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import ModalManager from '../../components/Modal/ModalManager';
import InputCopy from '../../components/InputCopy';
import './DownloadBar.scss';
import { startDownload } from '../../state/download/actions';
import { clearDataSet } from '../../state/download/actions';
import { connect } from 'react-redux';
import { getDomain } from '../../common/helpers';
import { Link } from 'react-router-dom';

let DownloadBar = ({
  dataSetId,
  aggregation,
  aggregationOnChange,
  clearDataSet
}) => {
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
            <InputCopy
              value={`${getDomain()}/download/${dataSetId}?aggregation=${aggregation.toUpperCase()}`}
            />
          </div>
        )}
      </ModalManager>

      <ModalManager
        component={showModal => (
          <Button
            buttonStyle="secondary"
            text="Remove Dataset"
            onClick={showModal}
          />
        )}
        modalProps={{ center: true }}
      >
        {({ hideModal }) => (
          <div>
            <h1>Are you sure you want to remove the dataset?</h1>
            <div className="downloads__fieldset">
              <Button
                buttonStyle="secondary"
                text="Yes"
                onClick={clearDataSet}
              />
              <Button
                buttonStyle="secondary"
                text="Cancel"
                onClick={hideModal}
              />
            </div>
          </div>
        )}
      </ModalManager>

      <div className="downloads__actions">
        <div className="downloads__fieldset">
          <label className="downloads__label">
            Aggregate
            <Dropdown
              options={['Experiment', 'Species']}
              selectedOption={aggregation}
              onChange={aggregationOnChange}
            />
          </label>
        </div>
        <Link
          className="button"
          to={`/dataset/${dataSetId}?aggregation=${aggregation.toUpperCase()}`}
        >
          Download
        </Link>
      </div>
    </div>
  );
};

DownloadBar = connect(state => ({}), {
  startDownload,
  clearDataSet
})(DownloadBar);

export default DownloadBar;

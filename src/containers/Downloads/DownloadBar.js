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
import HelpIcon from '../../common/icons/help.svg';

let DownloadBar = ({
  dataSetId,
  aggregation,
  aggregationOnChange,
  transformation,
  transformationOnChange
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
            <InputCopy value={`${getDomain()}/download/${dataSetId}`} />
          </div>
        )}
      </ModalManager>

      <div className="downloads__actions">
        <div className="downloads__fieldset">
          <label className="downloads__label">
            Aggregate
            <a
              href="https://refine.bio" // XXX: replace with link to docs
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="downloads__help-icon"
                src={HelpIcon}
                alt="What does aggregate mean?"
              />
            </a>
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
          <label className="downloads__label">
            Transformation
            <a
              href="https://refine.bio" // XXX: replace with link to docs
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="downloads__help-icon"
                src={HelpIcon}
                alt="What does transformation mean?"
              />
            </a>
            <Dropdown
              // If there is no transformationOnChange function, the DownloadBar
              // is immutable, so the only option is the current one. This
              // happens when viewing a shared dataset.
              options={
                transformationOnChange
                  ? ['None', 'Standard', 'Minmax']
                  : [transformation]
              }
              selectedOption={transformation}
              onChange={transformationOnChange}
              // The dropdown should also be disabled if there is no
              // transformationOnChange function
              disabled={!transformationOnChange}
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
DownloadBar = connect(
  state => ({}),
  {
    startDownload
  }
)(DownloadBar);
export default DownloadBar;

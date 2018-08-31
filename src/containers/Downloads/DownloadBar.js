import { connect } from 'react-redux';
import React from 'react';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import ModalManager from '../../components/Modal/ModalManager';
import InputCopy from '../../components/InputCopy';
import './DownloadBar.scss';
import { getDomain } from '../../common/helpers';
import { Link } from 'react-router-dom';
import HelpIcon from '../../common/icons/help.svg';
import {
  getTransformationNameFromOption,
  getTransformationOptionFromName
} from './transformation';
import { formatSentenceCase } from '../../common/helpers';
import {
  editAggregation,
  editTransformation
} from '../../state/download/actions';

let DownloadBar = ({
  dataSetId,
  aggregate_by,
  scale_by,
  editAggregation,
  editTransformation
}) => {
  const aggregation = formatSentenceCase(aggregate_by);

  const transformation = getTransformationOptionFromName(
    formatSentenceCase(scale_by)
  );

  return (
    <div className="downloads__bar">
      <ShareDatasetButton dataSetId={dataSetId} />

      <div className="downloads__actions">
        <div className="downloads__fieldset">
          <label className="downloads__label">
            Aggregate
            <a
              href="https://refine.bio" // XXX: replace with link to docs
              target="_blank"
              rel="noopener noreferrer"
              title="What is this?"
            >
              <img
                className="downloads__help-icon"
                src={HelpIcon}
                alt="What does aggregate mean?"
              />
            </a>
            <Dropdown
              options={['Experiment', 'Species']}
              selectedOption={aggregation}
              onChange={aggregation =>
                editAggregation({ dataSetId, aggregation })
              }
            />
          </label>
          <label className="downloads__label">
            Transformation
            <a
              href="https://refine.bio" // XXX: replace with link to docs
              target="_blank"
              rel="noopener noreferrer"
              title="What is this?"
            >
              <img
                className="downloads__help-icon"
                src={HelpIcon}
                alt="What does transformation mean?"
              />
            </a>
            <Dropdown
              options={['None', 'Z-score', 'Zero to One']}
              selectedOption={transformation}
              onChange={transformation =>
                editTransformation({
                  dataSetId,
                  transformation: getTransformationNameFromOption(
                    transformation
                  )
                })
              }
            />
          </label>
        </div>
        <Link className="button" to={`/download?start=true`}>
          Download
        </Link>
      </div>
    </div>
  );
};
DownloadBar = connect(
  () => ({}),
  {
    editAggregation,
    editTransformation
  }
)(DownloadBar);
export default DownloadBar;

export function ShareDatasetButton({ dataSetId }) {
  return (
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
          <InputCopy value={`${getDomain()}/dataset/${dataSetId}`} />
        </div>
      )}
    </ModalManager>
  );
}

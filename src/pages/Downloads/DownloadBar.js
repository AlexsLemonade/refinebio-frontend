import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import ModalManager from '../../components/Modal/ModalManager';
import InputCopy from '../../components/InputCopy';
import './DownloadBar.scss';
import { getDomain, formatSentenceCase } from '../../common/helpers';
import HelpIconImage from '../../common/icons/help.svg';
import {
  getTransformationNameFromOption,
  getTransformationOptionFromName,
} from './transformation';
import {
  editAggregation,
  editTransformation,
  editQuantileNormalize,
} from '../../state/download/actions';
import Checkbox from '../../components/Checkbox';
import Alert from '../../components/Alert';

let DownloadBar = ({
  dataSetId,
  aggregate_by,
  scale_by,
  quantile_normalize,
  editAggregation,
  editTransformation,
  editQuantileNormalize,
}) => {
  const [advancedOptions, setAdvancedOptions] = React.useState(
    !quantile_normalize
  );
  const aggregation = formatSentenceCase(aggregate_by);

  const transformation = getTransformationOptionFromName(
    formatSentenceCase(scale_by)
  );

  return (
    <div className="downloads__bar">
      <div className="flex-row mb-2">
        <div className="downloads__heading">My Dataset</div>

        <div>
          <ShareDatasetButton dataSetId={dataSetId} />
        </div>
      </div>

      <div className="downloads__actions">
        <div className="downloads__fieldset">
          <label htmlFor="aggregation" className="downloads__label">
            <div className="downloads__label-text">
              Aggregate{' '}
              <HelpIcon
                alt="What does aggregate mean?"
                url="http://docs.refine.bio/en/latest/main_text.html#aggregations"
              />
            </div>{' '}
            <Dropdown
              name="aggregation"
              options={['Experiment', 'Species']}
              selectedOption={aggregation}
              onChange={aggregation =>
                editAggregation({ dataSetId, aggregation })
              }
            />
          </label>
          <label htmlFor="transformation" className="downloads__label">
            <div className="downloads__label-text">
              Transformation{' '}
              <HelpIcon
                alt="What does transformation mean?"
                url="http://docs.refine.bio/en/latest/main_text.html#transformations"
              />
            </div>{' '}
            <Dropdown
              name="transformation"
              options={['None', 'Z-score', 'Zero to One']}
              selectedOption={transformation}
              onChange={transformation =>
                editTransformation({
                  dataSetId,
                  transformation: getTransformationNameFromOption(
                    transformation
                  ),
                })
              }
            />
          </label>
          <button
            type="button"
            className="link flex-row"
            onClick={() => setAdvancedOptions(!advancedOptions)}
          >
            Advanced Options{' '}
            {advancedOptions ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
        </div>
        <div className="flex-button-container flex-button-container--left">
          <Link className="button" to="/download?start=true">
            Download
          </Link>
        </div>
      </div>

      {advancedOptions && (
        <div className="downloads__advanced-options">
          <p>
            <b>Advanced Options</b>
          </p>

          {!quantile_normalize && (
            <Alert dismissableKey={`skip_quantile_normalization_${dataSetId}`}>
              Skipping quantile normalization will make your dataset less
              comparable to other refine.bio data
            </Alert>
          )}

          <Checkbox
            onClick={() =>
              editQuantileNormalize({
                dataSetId,
                quantile_normalize: !quantile_normalize,
              })
            }
            checked={!quantile_normalize}
          >
            <span>Skip quantile normalization for RNA-seq samples</span>
            <HelpIcon
              alt="What is quantile normalization?"
              url="http://docs.refine.bio/en/latest/main_text.html#transformations"
            />
          </Checkbox>
        </div>
      )}
    </div>
  );
};
DownloadBar = connect(
  null,
  {
    editAggregation,
    editTransformation,
    editQuantileNormalize,
  }
)(DownloadBar);
export default DownloadBar;

function HelpIcon({ url = 'http://docs.refine.bio/', alt = '' }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title="What is this?"
      className="downloads__help-icon"
    >
      <img src={HelpIconImage} alt={alt} />
    </a>
  );
}

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
          <h1 className="share-link-modal__title">Shareable Link</h1>
          <InputCopy value={`${getDomain()}/dataset/${dataSetId}?ref=share`} />
        </div>
      )}
    </ModalManager>
  );
}

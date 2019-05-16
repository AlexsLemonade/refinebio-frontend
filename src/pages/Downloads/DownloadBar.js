import { connect } from 'react-redux';
import React from 'react';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import ModalManager from '../../components/Modal/ModalManager';
import InputCopy from '../../components/InputCopy';
import './DownloadBar.scss';
import { getDomain } from '../../common/helpers';
import { Link } from 'react-router-dom';
import HelpIconImage from '../../common/icons/help.svg';
import {
  getTransformationNameFromOption,
  getTransformationOptionFromName
} from './transformation';
import { formatSentenceCase } from '../../common/helpers';
import {
  editAggregation,
  editTransformation
} from '../../state/download/actions';
import Checkbox from '../../components/Checkbox';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

let DownloadBar = ({
  dataSetId,
  aggregate_by,
  scale_by,
  editAggregation,
  editTransformation
}) => {
  const [advancedOptions, setAdvancedOptions] = React.useState(false);
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
          <label className="downloads__label">
            <div className="downloads__label-text">
              Aggregate{' '}
              <HelpIcon
                alt="What does aggregate mean?"
                url="http://docs.refine.bio/en/latest/main_text.html#aggregations"
              />
            </div>{' '}
            <Dropdown
              options={['Experiment', 'Species']}
              selectedOption={aggregation}
              onChange={aggregation =>
                editAggregation({ dataSetId, aggregation })
              }
            />
          </label>
          <label className="downloads__label">
            <div className="downloads__label-text">
              Transformation{' '}
              <HelpIcon
                alt="What does transformation mean?"
                url="http://docs.refine.bio/en/latest/main_text.html#transformations"
              />
            </div>{' '}
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
          <AdvancedOptionsToggle
            visible={advancedOptions}
            onClick={() => setAdvancedOptions(!advancedOptions)}
          />
        </div>
        <div className="flex-button-container flex-button-container--left">
          <Link className="button" to={`/download?start=true`}>
            Download
          </Link>
        </div>
      </div>

      {advancedOptions && (
        <div className="downloads__advanced-options">
          <p>
            <b>Advanced Options</b>
          </p>

          <Checkbox
            className="terms-of-use__checkbox"
            onClick={false}
            checked={advancedOptions}
            name="termsOfUse"
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
    editTransformation
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
    >
      <img className="downloads__help-icon" src={HelpIconImage} alt={alt} />
    </a>
  );
}

function AdvancedOptionsToggle({ visible, onClick }) {
  return (
    <a href="javascript:void(0)" onClick={onClick} className="link flex-row">
      Advanced Options {visible ? <IoIosArrowUp /> : <IoIosArrowDown />}
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

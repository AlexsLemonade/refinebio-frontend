import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button';
import AccessionIcon from '../../../common/icons/accession.svg';
import OrganismIcon from '../../../common/icons/organism.svg';
import SampleIcon from '../../../common/icons/sample.svg';
import MicroarrayIcon from '../../../common/icons/microarray-badge.svg';
import './Result.scss';

export function RemoveFromDatasetButton({
  handleRemove,
  totalAdded,
  samplesInDataset
}) {
  return (
    <div className="dataset-remove-button">
      <div className="dataset-remove-button__added-container">
        <span className="dataset-remove-button__added">
          <i className="ion-checkmark-circled dataset-remove-button__added-icon" />
          {totalAdded && `${totalAdded} Samples`} Added to Dataset
        </span>
        <Button buttonStyle="plain" text="Remove" onClick={handleRemove} />
      </div>
      {samplesInDataset && (
        <p className="dataset-remove-button__info-text">
          <i className="ion-information-circled dataset-remove-button__info-icon" />{' '}
          {samplesInDataset} Samples are already in Dataset
        </p>
      )}
    </div>
  );
}

const Result = ({ result, addExperiment, removeExperiment, dataSet }) => {
  const isAdded = !!dataSet[result.accession_code];

  function handleAddExperiment() {
    addExperiment([result]);
  }

  function handleRemoveExperiment() {
    removeExperiment([result.accession_code]);
  }

  return (
    <div className="result">
      <div className="result__title-container">
        <div className="result__title-info">
          <div className="result__accession">
            <img
              src={AccessionIcon}
              className="result__icon"
              alt="accession-icon"
            />{' '}
            {result.accession_code}
          </div>
          <Link
            className="button button--link"
            to={`/experiments/${result.id}`}
          >
            <h2 className="result__title">{result.title || 'No title.'}</h2>
          </Link>
        </div>
        {!isAdded ? (
          <Button text="Add to Dataset" onClick={handleAddExperiment} />
        ) : (
          <RemoveFromDatasetButton
            handleRemove={handleRemoveExperiment}
            samplesInDataset={
              dataSet[result.accession_code].length !== result.samples.length
                ? dataSet[result.accession_code].length
                : null
            }
          />
        )}
      </div>
      <ul className="result__stats">
        <li className="result__stat">
          <img
            src={OrganismIcon}
            className="result__icon"
            alt="organism-icon"
          />{' '}
          {result.organisms.join(',') || 'No species.'}
        </li>
        <li className="result__stat">
          <img src={SampleIcon} className="result__icon" alt="sample-icon" />{' '}
          {result.samples.length}
        </li>
        <li className="result__stat">
          <img
            src={MicroarrayIcon}
            className="result__icon"
            alt="MicroArray Badge Icon"
          />{' '}
          {result.platform_name.split(/(-|\s)/)[0]}
        </li>
      </ul>
      <h3>Description</h3>
      <p className="result__paragraph">{result.description}</p>
      <h3>Publication Title</h3>
      <p className="result__paragraph">{result.publication_title}</p>
      <h3>Sample Metadata Fields</h3>
      <p className="result__paragraph">todo...</p>
      <Link
        className="button button--secondary"
        to={`/experiments/${result.id}#samples`}
      >
        View Samples
      </Link>
    </div>
  );
};

export default Result;

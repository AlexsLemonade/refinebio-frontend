import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import Button from '../../../components/Button';
import AccessionIcon from '../../../common/icons/accession.svg';
import OrganismIcon from '../../../common/icons/organism.svg';
import SampleIcon from '../../../common/icons/sample.svg';
import MicroarrayIcon from '../../../common/icons/microarray-badge.svg';
import './Result.scss';
import SampleFieldMetadata from '../../Experiment/SampleFieldMetadata';
import { formatSentenceCase, getMetadataFields } from '../../../common/helpers';
import DataSetSampleActions from '../../Experiment/DataSetSampleActions';

const Result = ({ result, addExperiment, removeExperiment, dataSet }) => {
  function handleAddExperiment() {
    addExperiment([result]);
  }

  function handleRemoveExperiment() {
    removeExperiment([result.accession_code]);
  }

  const metadataFields = getMetadataFields(result);

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
            to={`/experiments/${result.id}?ref=search`}
          >
            <h2 className="result__title">{result.title || 'No title.'}</h2>
          </Link>
        </div>

        <DataSetSampleActions samples={result.samples} experiment={result} />
      </div>
      <ul className="result__stats">
        <li className="result__stat">
          <img
            src={OrganismIcon}
            className="result__icon"
            alt="organism-icon"
          />{' '}
          {result.organisms
            .map(organism => formatSentenceCase(organism))
            .join(',') || 'No species.'}
        </li>
        <li className="result__stat">
          <img src={SampleIcon} className="result__icon" alt="sample-icon" />{' '}
          {result.samples.length
            ? `${result.samples.length} Sample${
                result.samples.length > 1 ? 's' : null
              }`
            : null}
        </li>
        <li className="result__stat">
          <img
            src={MicroarrayIcon}
            className="result__icon"
            alt="MicroArray Badge Icon"
          />{' '}
          {result.pretty_platforms.filter(platform => !!platform).join(',')}
        </li>
      </ul>
      <h3>Description</h3>
      <p className="result__paragraph">{result.description}</p>
      <h3>Publication Title</h3>
      <p className="result__paragraph">
        {result.publication_title || (
          <i className="result__not-provided">No associated publication</i>
        )}
      </p>
      <h3>Sample Metadata Fields</h3>
      <p className="result__paragraph">
        {metadataFields && metadataFields.length ? (
          metadataFields.join(', ')
        ) : (
          <i className="result__not-provided">No sample metadata fields</i>
        )}
      </p>

      <Link
        className="button button--secondary"
        to={`/experiments/${result.id}?ref=search#samples`}
      >
        View Samples
      </Link>
    </div>
  );
};

export default Result;

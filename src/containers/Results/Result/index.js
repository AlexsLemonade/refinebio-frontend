import React from 'react';
import { Link } from 'react-router-dom';
import AccessionIcon from '../../../common/icons/accession.svg';
import OrganismIcon from '../../../common/icons/organism.svg';
import SampleIcon from '../../../common/icons/sample.svg';
import './Result.scss';
import { formatSentenceCase } from '../../../common/helpers';
import DataSetSampleActions from '../../Experiment/DataSetSampleActions';
import DataSetStats from '../../Experiment/DataSetStats';
import SampleFieldMetadata from '../../Experiment/SampleFieldMetadata';
import Technology from '../../Experiment/Technology';
import * as routes from '../../../routes';
import HighlightedText from '../../../components/HighlightedText';

const Result = ({ result, query }) => {
  const metadataFields =
    !result.samples || result.samples.length === 0
      ? []
      : SampleFieldMetadata.filter(field =>
          result.samples.some(sample => !!sample[field.id])
        ).map(field => field.Header);

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
            className="link result__title"
            to={routes.experiments(result.accession_code, {
              ref: 'search',
              result
            })}
          >
            {result.title || 'No title.'}
          </Link>
        </div>

        <DataSetSampleActions
          dataSetSlice={{
            [result.accession_code]: DataSetStats.mapAccessions(result.samples)
          }}
        />
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
            .join(', ') || 'No species.'}
        </li>
        <li className="result__stat">
          <img src={SampleIcon} className="result__icon" alt="sample-icon" />{' '}
          {result.samples.length
            ? `${result.samples.length} Sample${
                result.samples.length > 1 ? 's' : ''
              }`
            : ''}
        </li>
        <li className="result__stat">
          <Technology samples={result.samples} />
        </li>
      </ul>

      <div className="result__details">
        <h3>Description</h3>
        <p className="result__paragraph">
          <HighlightedText text={result.description} highlight={query} />
        </p>
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
          to={routes.experimentsSamples(result.accession_code, {
            ref: 'search',
            result
          })}
        >
          View Samples
        </Link>
      </div>
    </div>
  );
};

export default Result;

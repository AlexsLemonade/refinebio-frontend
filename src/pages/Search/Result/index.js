import React from 'react';
import Link from 'next/link';
import AccessionIcon from '../../../common/icons/accession.svg';
import OrganismIcon from '../../../common/icons/organism.svg';
import SampleIcon from '../../../common/icons/sample.svg';
import {
  formatSentenceCase,
  getMetadataFields,
  formatPlatformName,
} from '../../../common/helpers';
import DataSetSampleActions from '../../../components/DataSetSampleActions';
import * as routes from '../../../routes';
import { HText } from '../../../components/HighlightedText';
import TechnologyBadge, {
  MICROARRAY,
  RNA_SEQ,
} from '../../../components/TechnologyBadge';
import { NDownloadableSamples } from '../../../components/Strings';

import RequestExperimentButton from '../../experiments/RequestExperimentButton';

import './Result.scss';

const Result = ({ result, query }) => {
  const metadataFields = getMetadataFields(result.sample_metadata_fields);

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
            <HText>{result.accession_code}</HText>
          </div>
          <Link
            href="/experiments/[accessionCode]/[slug]"
            as={routes.experiments(result, {
              ref: 'search',
              query,
              result,
            })}
          >
            <a className="link result__title">
              {result.title ? <HText>{result.title}</HText> : 'No title.'}
            </a>
          </Link>
        </div>

        {result.num_downloadable_samples === 0 ? (
          <RequestExperimentButton accessionCode={result.accession_code} />
        ) : (
          <DataSetSampleActions
            dataSetSlice={{
              [result.accession_code]: {
                all: true,
                total: result.num_downloadable_samples,
              },
            }}
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
          {(result.organism_names &&
            result.organism_names
              .map(organism => formatSentenceCase(organism))
              .join(', ')) ||
            'No species.'}
        </li>
        <li className="result__stat">
          <img src={SampleIcon} className="result__icon" alt="sample-icon" />{' '}
          <NDownloadableSamples total={result.num_downloadable_samples} />
        </li>
        <li className="result__stat">
          <TechnologyBadge
            className="result__icon"
            isMicroarray={result.technology === MICROARRAY}
            isRnaSeq={result.technology === RNA_SEQ}
          />
          {result.platform_names.map(formatPlatformName).join(', ')}
        </li>
      </ul>

      <div className="result__details">
        <h3>Description</h3>
        <p className="result__paragraph">
          <HText>{result.description}</HText>
        </p>
        <h3>Publication Title</h3>
        <p className="result__paragraph">
          {result.publication_title ? (
            <HText>{result.publication_title}</HText>
          ) : (
            <i className="result__not-provided">No associated publication</i>
          )}
        </p>
        <h3>Sample Metadata Fields</h3>
        <p className="result__paragraph">
          {metadataFields && metadataFields.length ? (
            <HText>{metadataFields.join(', ')}</HText>
          ) : (
            <i className="result__not-provided">No sample metadata fields</i>
          )}
        </p>

        <Link
          href="/experiments/[accessionCode]/[slug]"
          as={routes.experimentsSamples(result, {
            ref: 'search',
            query,
            result,
          })}
        >
          <a className="button button--secondary">View Samples</a>
        </Link>
      </div>
    </div>
  );
};

export default Result;

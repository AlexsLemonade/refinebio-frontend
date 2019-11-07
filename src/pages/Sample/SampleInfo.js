import React from 'react';
import AccessionIcon from '../../common/icons/accession.svg';
import DataSetSampleActions from '../../components/DataSetSampleActions';
import OrganismIcon from '../../common/icons/organism.svg';
import { formatSentenceCase } from '../../common/helpers';
import Technology from '../Experiment/Technology';

export default function SampleInfo({ sample }) {
  return (
    <div className="experiment">
      <div className="experiment__header">
        <div className="experiment__accession">
          <img
            src={AccessionIcon}
            className="experiment__stats-icon"
            alt="Accession Icon"
          />
          {sample.accession_code} | Sample
        </div>

        <div>
          {!sample.is_downloadable && (
            <DataSetSampleActions
              dataSetSlice={{
                [sample.accession_code]: [sample.accession_code],
              }}
            />
          )}
        </div>
      </div>

      <div className="experiment__stats">
        <div className="experiment__stats-item">
          <img
            src={OrganismIcon}
            className="experiment__stats-icon"
            alt="Organism Icon"
          />{' '}
          {formatSentenceCase(sample.organism.name)}
        </div>
        <div className="experiment__stats-item">
          <Technology samples={[sample]} />
        </div>
      </div>

      <h4 className="experiment__title">Sample Metadata Fields</h4>

      <div>
        <SampleMetadataFields sample={sample} />
      </div>
    </div>
  );
}

function SampleMetadataFields({ sample }) {
  const fields = SAMPLE_METADATA_FIELDS.map(
    field =>
      sample[field] && (
        <div key={field} className="experiment__row">
          <div className="experiment__row-label">
            {formatSentenceCase(field)}
          </div>
          <div>{sample[field]}</div>
        </div>
      )
  );

  if (!fields.some(x => x)) {
    return 'No metadata fields';
  }

  return fields;
}

const SAMPLE_METADATA_FIELDS = [
  'sex',
  'age',
  'specimen_part',
  'genotype',
  'disease',
  'disease_stage',
  'cell_line',
  'treatment',
  'race',
  'subject',
  'compound',
  'time',
];

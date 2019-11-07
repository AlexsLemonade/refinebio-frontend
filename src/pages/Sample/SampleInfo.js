import React from 'react';
import AccessionIcon from '../../common/icons/accession.svg';
import OrganismIcon from '../../common/icons/organism.svg';
import { formatSentenceCase } from '../../common/helpers';
import Technology from '../Experiment/Technology';
import MetadataAnnotationsCell from '../../components/SamplesTable/MetadataAnnotationsCell';
import ProcessingInformationCell from '../../components/SamplesTable/ProcessingInformationCell';

export default function SampleInfo({ sample }) {
  return (
    <div className="experiment">
      <div className="experiment__accession mb-2">
        <img
          src={AccessionIcon}
          className="experiment__stats-icon"
          alt="Accession Icon"
        />
        {sample.accession_code}
      </div>

      <div className="experiment__header">
        <h1 className="experiment__header-title mobile-p">Sample Details</h1>
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

      <SampleMetadataFields sample={sample} />
    </div>
  );
}

function SampleMetadataFields({ sample }) {
  return (
    <>
      <h4 className="experiment__title">Sample Metadata Fields</h4>

      <div>
        {SAMPLE_METADATA_FIELDS.map(
          field =>
            sample[field] && (
              <div key={field} className="experiment__row">
                <div className="experiment__row-label">
                  {formatSentenceCase(field)}
                </div>
                <div>{sample[field]}</div>
              </div>
            )
        )}
        <div key="proc" className="experiment__row">
          <div className="experiment__row-label">Processing Information</div>
          <div>
            <ProcessingInformationCell original={sample} />
          </div>
        </div>
        <div key="additional" className="experiment__row">
          <div className="experiment__row-label">Additional Metadata</div>
          <div>
            <MetadataAnnotationsCell original={sample} />
          </div>
        </div>
      </div>
    </>
  );
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

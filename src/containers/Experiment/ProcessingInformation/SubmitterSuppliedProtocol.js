import React from 'react';
import isEqual from 'lodash/isEqual';

import styles from './SubmitterSuppliedProtocol.scss';

const PROTOCOLS_BY_SAMPLE_TYPE = {
  GEO: GeoSubmitterSuppliedProtocol,
  SRA: SRASubmitterSuppliedProtocol
};

/**
 * This component renders the submitter supplied protocol information inside the modal dialogs
 * It depends on the type of sample.
 *
 * ref https://github.com/AlexsLemonade/refinebio-frontend/issues/225#issuecomment-417345139
 */
export default function SubmitterSuppliedProtocol({ sample, results }) {
  let Component = PROTOCOLS_BY_SAMPLE_TYPE[sample.source_database];
  if (!Component) {
    return null;
  }

  return (
    <section className="processing-info-modal__section">
      <div className="processing-info-modal__protocol-description">
        <h3>Submitter Supplied Protocol</h3>

        <Component protocol_info={/*sample.protocol_info*/ SRA_MOCK_DATA} />
      </div>
    </section>
  );
}

function GeoSubmitterSuppliedProtocol({ protocol_info }) {
  return (
    <div>
      <div className={styles.geo}>
        {[
          'Extraction protocol',
          'Label protocol',
          'Hybridization protocol',
          'Scan protocol',
          'Data processing'
        ].map(
          field =>
            protocol_info[field] && (
              <div className="experiment__row">
                <div className="experiment__row-label">{field}</div>
                <div>{protocol_info[field].join('. ')}</div>
              </div>
            )
        )}

        {protocol_info['Reference'] && (
          <div className="experiment__row">
            <div className="experiment__row-label">Reference</div>
            <div>
              <a
                href={protocol_info['Reference']}
                rel="nofollow"
                target="_blank"
                className="link"
              >
                {protocol_info['Reference']}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="processing-info-modal__section">
        <h3>Gene Identifier Conversion</h3>

        <div>
          The gene identifiers were converted to Ensembl Gene Identifiers using
          g:Profiler (version 2.0.1)
        </div>
      </div>
    </div>
  );
}

function SRASubmitterSuppliedProtocol({ protocol_info }) {
  return (
    <div className={styles.sra}>
      {protocol_info.map(info => (
        <div>
          <p>{info['Description']}</p>
          <p>
            <b>Reference</b>{' '}
            <a
              href={info['Reference']}
              rel="nofollow"
              target="_blank"
              className="link"
            >
              {info['Reference']}
            </a>
          </p>
        </div>
      ))}
    </div>
  );
}

const GEO_MOCK_DATA = {
  'Extraction protocol': [
    'RNA extracted with Trizol reagent and purified per Trizol protocol; RNA further purified using RNeasy kit columns'
  ],
  'Label protocol': ["According to manufacturer's instructions"],
  'Hybridization protocol': ["According to manufacturer's instructions"],
  'Scan protocol': ["According to manufacturer's instructions"],
  'Data processing': [
    'Data was analyzed using Cubic Spline normalisation method'
  ],
  Reference:
    'https://www.ebi.ac.uk/arrayexpress/json/v3/experiments/E-MEXP-31/protocols'
};

const SRA_MOCK_DATA = [
  {
    Description:
      'Total RNA was harvested by TriZol reagent and ribosomal RNA was removed by polyA capture prior to library generation. Libraries were created with the KAPA Stranded mRNA-seq Kit.',
    Reference:
      'https://www.ebi.ac.uk/arrayexpress/json/v3/experiments/E-MEXP-31/protocols'
  },
  {
    Description:
      'Total RNA was harvested by TriZol reagent and ribosomal RNA was removed by polyA capture prior to library generation. Libraries were created with the KAPA Stranded mRNA-seq Kit.',
    Reference:
      'https://www.ebi.ac.uk/arrayexpress/json/v3/experiments/E-MEXP-31/protocols'
  }
];

import React from 'react';
import { Accordion, AccordionItem } from '../../../components/Accordion';
import { formatSentenceCase, truncateOnWord } from '../../../common/helpers';
import styles from './SubmitterSuppliedProtocol.scss';
import isEmpty from 'lodash/isEmpty';

const PROTOCOLS_BY_SAMPLE_TYPE = {
  GEO: GeoSubmitterSuppliedProtocol,
  SRA: SRASubmitterSuppliedProtocol,
  ARRAY_EXPRESS: ArrayExpressSuppliedProtocol
};

/**
 * This component renders the submitter supplied protocol information inside the modal dialogs.
 * It depends on the type of sample.
 *
 * ref https://github.com/AlexsLemonade/refinebio-frontend/issues/225#issuecomment-417345139
 */
export default function SubmitterSuppliedProtocol({ sample, results }) {
  if (isEmpty(sample.protocol_info)) return null;

  let Component = PROTOCOLS_BY_SAMPLE_TYPE[sample.source_database];
  if (!Component) {
    return null;
  }

  return (
    <div className="processing-info-modal__protocol-description">
      <h3 className={styles.title}>Submitter Supplied Protocol</h3>

      <Component protocol_info={sample.protocol_info} />
    </div>
  );
}

function ArrayExpressSuppliedProtocol({ protocol_info }) {
  return (
    <div>
      <Accordion>
        {protocol_info.map(protocol => (
          <AccordionItem
            key={protocol.Accession}
            title={isExpanded => (
              <div>
                <b>{formatSentenceCase(protocol.Type)}</b>

                <div>{!isExpanded && truncateOnWord(protocol.Text, 80)}</div>
              </div>
            )}
          >
            <p>{protocol.Text}</p>

            <p>
              <b>Reference</b>{' '}
              <a
                href={protocol['Reference']}
                rel="noopener noreferrer"
                target="_blank"
                className="link"
              >
                {protocol['Reference']}
              </a>
            </p>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
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
                rel="noopener noreferrer"
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
          We have created custom gene mapping files for Affymetrix platforms
          (see:{' '}
          <a
            href="https://github.com/AlexsLemonade/identifier-refinery"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/AlexsLemonade/identifier-refinery
          </a>) that support conversion from probe IDs, gene symbols, Entrez
          IDs, RefSeq and Unigene identifiers to Ensembl gene IDs. We support
          conversion from Illumina BeadArray probe IDs to Ensembl gene IDs using
          Bioconductor Illumina BeadArray expression packages.
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
              rel="noopener noreferrer"
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

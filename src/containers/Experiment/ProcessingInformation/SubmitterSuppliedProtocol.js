import React from 'react';
import isEqual from 'lodash/isEqual';
import { Accordion, AccordionItem } from '../../../components/Accordion';
import { formatSentenceCase, truncateOnWord } from '../../../common/helpers';
import styles from './SubmitterSuppliedProtocol.scss';

const PROTOCOLS_BY_SAMPLE_TYPE = {
  GEO: GeoSubmitterSuppliedProtocol,
  SRA: SRASubmitterSuppliedProtocol,
  ARRAY_EXPRESS: ArrayExpressSuppliedProtocol
};

/**
 * This component renders the submitter supplied protocol information inside the modal dialogs
 * It depends on the type of sample.
 *
 * ref https://github.com/AlexsLemonade/refinebio-frontend/issues/225#issuecomment-417345139
 */
export default function SubmitterSuppliedProtocol({ sample, results }) {
  if (!sample.protocol_info) return;

  let Component = PROTOCOLS_BY_SAMPLE_TYPE[sample.source_database];
  if (!Component) {
    return null;
  }

  return (
    <section className="processing-info-modal__section">
      <div className="processing-info-modal__protocol-description">
        <h3 className={styles.title}>Submitter Supplied Protocol</h3>

        <Component protocol_info={sample.protocol_info} />
      </div>
    </section>
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
                rel="nofollow"
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

const ARRAY_EXPRESS_MOCK_DATA = [
  {
    Accession: 'X1',
    Text: 'Affymetrix CEL analysis',
    Title: 'Feature Extraction',
    Type: 'split',
    Reference:
      'https://www.ebi.ac.uk/arrayexpress/json/v3/experiments/E-MEXP-31/protocols'
  },
  {
    Accession: 'X3',
    Text: 'Affymetrix CEL analysis',
    Title: 'Bioassay Data Trasformation',
    Type: 'split',
    Reference:
      'https://www.ebi.ac.uk/arrayexpress/json/v3/experiments/E-MEXP-31/protocols'
  },
  {
    Accession: 'X2',
    Text:
      "Total RNA was prepared using RNeasy Mini-Spin columns (Qiagen) using standard protocols. RNA quality was monitored with RNA Nano 6000 Chips and the 2100 Bioanalyzer (Agilent)Labeling of total RNA was performed as described in the Expression Analysis Technical Manual (Affymetrix) with minor modifications as indicated below. Double-stranded (ds) cDNA was synthesized from 13 µg of total RNA using the Superscript II kit (Invitrogen Life Technologies) and a T7-(dT)24-VN primer 5'GGCCAGTGAATTGTAATACGACTCACTATAGGGAGGCGG-(T)24-VN3' [V = G, A, or C, N = G, A, C or T]. The in vitro transcription (IVT) reaction was carried out with 50% of the ds cDNA synthesized with the Bioarray HighYield RNA Transcript Labeling Kit (Enzo). Subsequently, the biotin-labeled cRNAs were purified by using RNeasy Mini spin columns and analysed on RNA Nano 6000 Chips. The cRNA target was then incubated at 94°C for 35 minutes; the resulting fragments of 50-150 nucleotides were monitored using the Bionalyzer.",
    Title: 'Labeling',
    Type: 'split',
    Reference:
      'https://www.ebi.ac.uk/arrayexpress/json/v3/experiments/E-MEXP-31/protocols'
  }
];

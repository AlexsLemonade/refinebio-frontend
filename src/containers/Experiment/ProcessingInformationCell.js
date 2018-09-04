import React from 'react';
import Button from '../../components/Button';
import ModalManager from '../../components/Modal/ModalManager';

import FileIcon from './file.svg';
import ProcessIcon from './process.svg';
import { stringEnumerate } from '../../common/helpers';
import moment from 'moment';
import './ProcessingInformationCell.scss';
import isEqual from 'lodash/isEqual';
import { getGenomeBuild } from '../../api/samples';
import Loader from '../../components/Loader';

export default function ProcessingInformationCell({
  original: sample,
  ...props
}) {
  if (!sample.results || !sample.results.length) {
    return <div className="experiment__not-provided">NA</div>;
  }

  const computationalResults = sample.results
    .filter(result => result.processor.name !== 'MultiQC') // hack to hide multiqc
    .filter(
      // hack: the backend is returning duplicated computational results
      // this ensures we only show unique values.
      (result, index, self) =>
        self.findIndex(r2 => r2.processor.name === result.processor.name) ===
        index
    )
    .sort((result1, result2) =>
      moment(result1.time_start).diff(moment(result2.time_start))
    );

  const pipelinesText = computationalResults
    .map(result => result.processor.name)
    .join(', ');

  return (
    <ModalManager
      component={showModal => (
        <Button text={pipelinesText} buttonStyle="link" onClick={showModal} />
      )}
      modalProps={{ className: 'processing-info-modal' }}
    >
      {() => (
        <ProcessingInformationModalContent
          sample={sample}
          results={computationalResults}
        />
      )}
    </ModalManager>
  );
}

class ProcessingInformationModalContent extends React.Component {
  render() {
    const { results, sample } = this.props;

    const pipelinesText = results.map(result => result.processor.name);

    return (
      <div>
        <h1 className="processing-info-modal__title">Processing Information</h1>
        <div className="dot-label">refine.bio processed</div>

        <h3>{stringEnumerate(pipelinesText)}</h3>

        <div className="pipeline">
          <div className="pipeline__item">
            <img src={FileIcon} alt="" />
            <div>Input File</div>
          </div>
          <div className="pipeline__arrow">
            <div className="arrow" />
          </div>

          {results.map(({ processor: { name } }, index) => (
            <React.Fragment key={index}>
              <div className="pipeline__item">
                <img src={ProcessIcon} alt="" />
                <div>{name}</div>
              </div>
              <div className="pipeline__arrow">
                <div className="arrow" />
              </div>
            </React.Fragment>
          ))}

          <div className="pipeline__item">
            <img src={FileIcon} alt="" />
            <div>Gene Expression Matrix</div>
          </div>
        </div>

        {results.map(({ processor: { name } }) =>
          this._getProtocolDescription(name)
        )}

        <h3 className="processing-info-modal__subtitle">Version Information</h3>
        <table>
          <tbody>
            {results.map(({ processor: { name, version } }) => (
              <tr>
                <td className="processing-info-modal__version">{name}</td>
                <td>{version}</td>
              </tr>
            ))}

            <GenomeBuild organism={sample.organism.name} />
          </tbody>
        </table>

        <section className="processing-info-modal__section">
          <SubmitterSuppliedProtocol {...this.props} />
        </section>
      </div>
    );
  }

  static PROTOCOLS = {
    'Affymetrix SCAN': AffymetrixScanProtocol,
    'Illumina SCAN': IlluminaScanProtocol,
    'Transcriptome Index': null,
    'Salmon Quant': SalmonProtocol,
    MultiQC: null,
    Tximport: TxtimportProtocol,

    'Submitter-processed': SubmitterSuppliedProtocol
  };

  _getProtocolDescription(name) {
    const Component = ProcessingInformationModalContent.PROTOCOLS[name];
    if (!Component) {
      return null;
    }
    return <Component {...this.props} />;
  }
}

function GenomeBuild({ organism }) {
  return (
    <Loader fetch={() => getGenomeBuild(organism)}>
      {({ isLoading, data }) =>
        !isLoading && !data ? (
          <React.Fragment />
        ) : (
          <tr>
            <td className="processing-info-modal__version">Genome build</td>
            <td>{data || '...'}</td>
          </tr>
        )
      }
    </Loader>
  );
}

function AffymetrixScanProtocol() {
  return (
    <div className="processing-info-modal__protocol-description">
      <h3>SCAN</h3>
      <p>
        SCAN (Single Channel Array Normalization) is a normalization method for
        single channel (Affymetrix) microarrays that allows us to process
        individual samples. SCAN models and corrects for the effect of technical
        bias, such as GC content, using a mixture-modeling approach. For more
        information about this approach, see the primary publication (Piccolo,
        et al. Genomics. 2012.
        <a
          href="http://doi.org/10.1016/j.ygeno.2012.08.003"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          DOI: 10.1016/j.ygeno.2012.08.003
        </a>){' '}
        <span>
          and the SCAN.UPC bioconductor package documentation (<a
            href="https://doi.org/10.18129/B9.bioc.SCAN.UPC"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            DOI: 10.18129/B9.bioc.SCAN.UPC
          </a>).
        </span>
      </p>
    </div>
  );
}

function IlluminaScanProtocol() {
  return (
    <div className="processing-info-modal__protocol-description">
      <h3>SCAN</h3>
      <p>
        SCAN (Single Channel Array Normalization) is a normalization method for
        single channel microarrays that allows us to process individual samples.
        It was originally developed for Affymetrix microarrays. In our system,
        it has been adapted for Illumina BeadArrays. SCAN models and corrects
        for the effect of technical bias, such as GC content, using a
        mixture-modeling approach. For more information about this approach, see
        the primary publication (Piccolo, et al. Genomics. 2012.
        <a
          href="http://doi.org/10.1016/j.ygeno.2012.08.003"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          DOI: 10.1016/j.ygeno.2012.08.003
        </a>).
      </p>
    </div>
  );
}

function SubmitterSuppliedProtocol({ sample, results }) {
  let processorNames = results.map(result => result.processor.name);

  return (
    <div className="processing-info-modal__protocol-description">
      <h3>Submitter Supplied Protocol</h3>
      {/* Rna seq specific note https://github.com/AlexsLemonade/refinebio-frontend/issues/265 */}
      {isEqual(processorNames, ['Salmon Quant', 'Tximport']) && (
        <p>
          We have created custom gene mapping files for Affymetrix platforms
          (see:
          <a
            href="https://github.com/AlexsLemonade/identifier-refinery"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            https://github.com/AlexsLemonade/identifier-refinery
          </a>) that support conversion from probe IDs, gene symbols, Entrez
          IDs, RefSeq and Unigene identifiers to Ensembl gene IDs. We support
          conversion from Illumina BeadArray probe IDs to Ensembl gene IDs using
          Bioconductor Illumina BeadArray expression packages.
        </p>
      )}
      <p>
        These tissues samples were obtained at surgery and stored at -80C until
        use., These tissues samples were obtained at surgery without any other
        pretreatment., Acid guanidinium thiocyanate-phenol-chloroform extraction
        of total RNA was performed according to the previous report (Anal.
        Biochem, 162: 156,1987)., Biotinylated cRNA were prepared according to
        the standard Affymetrix protocol from 2 ug total RNA (Expression
        Analysis Technical Manual, 2001, Affymetrix)., Title: Affymetrix CEL
        analysis. Description:, The data were analyzed with Microarray Suite
        version 5.0 (MAS 5.0) using Affymetrix default analysis settings and
        global scaling as normalization method.
      </p>
    </div>
  );
}

function SalmonProtocol() {
  return (
    <div className="processing-info-modal__protocol-description">
      <h3>Salmon</h3>
      <p>
        Salmon is an alignment-free method for estimating transcript abundances
        from RNA-seq data. We use it in quasi-mapping mode, which is
        significantly faster than alignment-based approaches and requires us to
        build a Salmon transcriptome index. We build a custom reference
        transcriptome (using RSEM rsem-prepare-reference) by filtering the
        Ensembl genomic DNA assembly to remove pseudogenes, which we expect
        could negatively impact the quantification of protein-coding genes. This
        means we're obtaining abundance estimates for coding as well as
        non-coding transcripts. We include the flags <i>--seqBias</i> to correct
        for random hexamer priming and, if this is a paired-end experiment,{' '}
        <i>--gcBias</i> to correct for GC content when running{' '}
        <i>salmon quant</i>.{' '}
        <a
          href="https://combine-lab.github.io/salmon/"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          Learn more
        </a>
      </p>
    </div>
  );
}

function TxtimportProtocol() {
  return (
    <div className="processing-info-modal__protocol-description">
      <h3 className="processing-info-modal__subtitle">Tximport</h3>

      <p>
        <i>tximport</i> imports transcript (tx)-level abundance estimates
        generated by
        <i>salmon quant</i> and summarizes them to the gene-level. We use the tx
        to gene mapping generated as part of our reference transcriptome
        processing pipeline. Our tximport implementation generates{' '}
        <a
          href="https://www.rdocumentation.org/packages/tximport/versions/1.0.3/topics/tximport"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          "lengthScaledTPM"
        </a>, which are gene-level count-scale values that are generated by
        scaling TPM using the average transcript length across samples and to
        the library size. Note that tximport is applied at the{' '}
        <em>experiment-level</em> rather than to single samples. For additional
        information, see the{' '}
        <a
          href="http://bioconductor.org/packages/release/bioc/html/tximport.html"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          tximport Bioconductor page
        </a>, the{' '}
        <a
          href="http://bioconductor.org/packages/release/bioc/vignettes/tximport/inst/doc/tximport.html"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          tximport tutorial{' '}
          <em>Importing transcript abundance datasets with tximport</em>
        </a>, and{' '}
        <a
          href="http://dx.doi.org/10.12688/f1000research.7563.1"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          Soneson, et al. <em>F1000Research.</em> 2015.
        </a>
      </p>
    </div>
  );
}

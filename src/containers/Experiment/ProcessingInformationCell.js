

import React from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import ModalManager from '../../components/Modal/ModalManager';

import FileIcon from './file.svg';
import ProcessIcon from './process.svg';


// Pipeline names ref: https://github.com/AlexsLemonade/refinebio-frontend/issues/22#issuecomment-394010812
const PIPELINES = {
  SubmitterProcessed: 'Submitter-processed',
  AffymetrixSCAN: 'Affymetrix SCAN',
  Salmontools: 'Salmontools',
  AgilentSCANTwoColor: 'Agilent SCAN TwoColor',
  IlluminaSCAN: 'Illumina SCAN',
  tximport: 'tximport',
  Salmon: 'Salmon',
  MultiQC: 'MultiQC'
};

export default function ProcessingInformationCell({ original: sample, ...props }) {
  let { pipelines } = sample;

  // Logic to decide which pipeline modal dialog should be displayed. On Keytar Kurt we're only supporting 4 types of
  // pipelines. In the future when we add more, we might want to refactor these modal dialogs
  // ref: https://github.com/AlexsLemonade/refinebio-frontend/issues/22#issuecomment-394408631
  if (pipelines.length === 1) {
    if (pipelines.includes(PIPELINES.AffymetrixSCAN)) {
      return <ScanModal sample={sample} scanType={PIPELINES.AffymetrixSCAN} />;
    } else if (pipelines.includes(PIPELINES.IlluminaSCAN)) {
      return <ScanModal sample={sample} scanType={PIPELINES.IlluminaSCAN} />;
    } else if (pipelines.includes(PIPELINES.SubmitterProcessed)) {
      return <SubmitterProcessedModal sample={sample} />;
    }
  } else if (pipelines.length === 2) {
    if (
      pipelines.includes(PIPELINES.tximport) &&
      pipelines.includes(PIPELINES.Salmon)
    ) {
      return <SalmonTximportModal sample={sample} />;
    }
  }

  return <div>{pipelines.join(', ')}</div>;
}

function SubmitterProcessedModal({ sample }) {
  return (
    <ModalManager
      component={showModal => (
        <Button
          text="Submitter-processed"
          buttonStyle="link"
          onClick={showModal}
        />
      )}
      modalProps={{ className: 'processing-info-modal' }}
    >
      {() => (
        <div>
          <h1 className="processing-info-modal__title">
            Processing Information
          </h1>
          <div className="dot-label dot-label--submitter">
            Submitter processed
          </div>

          <SubmitterSuppliedProtocol />

          <section className="processing-info-modal__section">
            <GeneIdentifierConversion />
          </section>
        </div>
      )}
    </ModalManager>
  );
}

function SubmitterSuppliedProtocol() {
  return (
    <div>
      <h3>Submitter Supplied Protocol</h3>
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

function GeneIdentifierConversion() {
  return (
    <div>
      <h3>Gene Identifier Conversion</h3>
      <p>
        The gene identifiers were detected and converted to Ensembl gene IDs
        using our{' '}
        <a
          href="https://github.com/AlexsLemonade/identifier-refinery"
          className="link"
          target="_blank"
          rel="noopener noreferrer"
        >
          custom mappings
        </a>{' '}
        and pipeline.
      </p>
    </div>
  );
}

function ScanModal({ sample, scanType }) {
  return (
    <ModalManager
      component={showModal => (
        <Button text={scanType} buttonStyle="link" onClick={showModal} />
      )}
      modalProps={{ className: 'processing-info-modal' }}
    >
      {() => (
        <div>
          <h1 className="processing-info-modal__title">
            Processing Information
          </h1>
          <div className="dot-label">refine.bio processed</div>

          <h3>{scanType}</h3>

          <div className="pipeline">
            <div className="pipeline__item">
              <img src={FileIcon} alt="" />
              <div>Input File</div>
            </div>
            <div className="pipeline__arrow">
              <div className="arrow" />
            </div>
            <div className="pipeline__item">
              <img src={ProcessIcon} alt="" />
              <div>SCAN</div>
            </div>
            <div className="pipeline__arrow">
              <div className="arrow" />
            </div>
            <div className="pipeline__item">
              <img src={FileIcon} alt="" />
              <div>Gene Expression Matrix</div>
            </div>
          </div>

          <ScanProtocol scanType={scanType} />

          <section className="processing-info-modal__section">
            <SubmitterSuppliedProtocol />
          </section>
        </div>
      )}
    </ModalManager>
  );
}

function ScanProtocol({ scanType }) {
  const versionInfo = _getScanVersionInfo(scanType);
  return (
    <div>
      <h3>SCAN</h3>
      <p>
        {scanType === PIPELINES.AffymetrixSCAN
          ? 'SCAN (Single Channel Array Normalization) is a normalization method for single channel (Affymetrix) microarrays that allows us to process individual samples. SCAN models and corrects for the effect of technical bias, such as GC content, using a mixture-modeling approach. For more information about this approach, see the primary publication (Piccolo, et al. Genomics. 2012.'
          : 'SCAN (Single Channel Array Normalization) is a normalization method for single channel microarrays that allows us to process individual samples. It was originally developed for Affymetrix microarrays. In our system, it has been adapted for Illumina BeadArrays. SCAN models and corrects for the effect of technical bias, such as GC content, using a mixture-modeling approach. For more information about this approach, see the primary publication (Piccolo, et al. Genomics. 2012. '}
        <a
          href="http://doi.org/10.1016/j.ygeno.2012.08.003"
          target="_blank"
          rel="noopener noreferrer"
          className="button button--link"
        >
          DOI: 10.1016/j.ygeno.2012.08.003
        </a>){' '}
        {scanType === PIPELINES.AffymetrixSCAN ? (
          <span>
            and the SCAN.UPC bioconductor package documentation (<a
              href="http://doi.org/10.1016/j.ygeno.2012.08.003"
              target="_blank"
              rel="noopener noreferrer"
              className="button button--link"
            >
              DOI: 10.18129/B9.bioc.SCAN.UPC
            </a>).
          </span>
        ) : (
          '.'
        )}
      </p>

      <h3 className="processing-info-modal__subtitle">Version Information</h3>
      <table>
        <tbody>
          {Object.keys(versionInfo).map(packageName => (
            <tr>
              <td className="processing-info-modal__version">{packageName}</td>
              <td>{versionInfo[packageName]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function _getScanVersionInfo(scanType) {
  if (scanType === PIPELINES.AffymetrixSCAN) {
    return {
      'SCAN.UPC': '2.20.0',
      Brainarray: '22.0.0'
    };
  } else if (scanType === PIPELINES.IlluminaSCAN) {
    return {
      'Illumina Bioconductor annotation packages': '1.26.0'
    };
  }
}

function SalmonTximportModal({ sample }) {
  return (
    <ModalManager
      component={showModal => (
        <Button
          text="Salmon and tximport"
          buttonStyle="link"
          onClick={showModal}
        />
      )}
      modalProps={{ className: 'processing-info-modal' }}
    >
      {() => (
        <div>
          <h1 className="processing-info-modal__title">
            Processing Information
          </h1>
          <div className="dot-label">refine.bio processed</div>

          <h3>Salmon and tximport</h3>

          <div className="pipeline">
            <div className="pipeline__item">
              <img src={FileIcon} alt="" />
              <div>Input File</div>
            </div>
            <div className="pipeline__arrow">
              <div className="arrow" />
            </div>
            <div className="pipeline__item">
              <img src={ProcessIcon} alt="" />
              <div>Salmon</div>
            </div>
            <div className="pipeline__arrow">
              <div className="arrow" />
            </div>
            <div className="pipeline__item">
              <img src={ProcessIcon} alt="" />
              <div>tximport</div>
            </div>
            <div className="pipeline__arrow">
              <div className="arrow" />
            </div>
            <div className="pipeline__item">
              <img src={FileIcon} alt="" />
              <div>Gene Expression Matrix</div>
            </div>
          </div>

          <SalmonProtocol />

          <TxtimportProtocol />

          <h3 className="processing-info-modal__subtitle">
            Version Information
          </h3>
          <table>
            <tbody>
              <tr>
                <td className="processing-info-modal__version">Salmon</td>
                <td>0.9.1</td>
              </tr>
              <tr>
                <td className="processing-info-modal__version">txtimport</td>
                <td>1.6.0</td>
              </tr>
              <tr>
                <td className="processing-info-modal__version">Genome build</td>
                <td>GRCh38.p12</td>
              </tr>
            </tbody>
          </table>

          <section className="processing-info-modal__section">
            <SubmitterSuppliedProtocol />
          </section>
        </div>
      )}
    </ModalManager>
  );
}

function SalmonProtocol() {
  return (
    <div>
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
          className="button button--link"
        >
          Learn more
        </a>
      </p>
    </div>
  );
}

function TxtimportProtocol() {
  return (
    <div>
      <h3 className="processing-info-modal__subtitle">tximport</h3>

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
          className="button button--link"
        >
          "lengthScaledTPM"
        </a>, which are gene-level counts that are generated by scaling TPM
        using the average transcript length across samples and to the library
        size. Note that tximport is applied at the <em>experiment-level</em>{' '}
        rather than to single samples. For additional information, see the{' '}
        <a
          href="http://bioconductor.org/packages/release/bioc/html/tximport.html"
          target="_blank"
          rel="noopener noreferrer"
          className="button button--link"
        >
          tximport Bioconductor page
        </a>, the{' '}
        <a
          href="http://bioconductor.org/packages/release/bioc/vignettes/tximport/inst/doc/tximport.html"
          target="_blank"
          rel="noopener noreferrer"
          className="button button--link"
        >
          tximport tutorial{' '}
          <em>Importing transcript abundance datasets with tximport</em>
        </a>, and{' '}
        <a
          href="http://dx.doi.org/10.12688/f1000research.7563.1"
          target="_blank"
          rel="noopener noreferrer"
          className="button button--link"
        >
          Soneson, et al. <em>F1000Research.</em> 2015.
        </a>
      </p>
    </div>
  );
}

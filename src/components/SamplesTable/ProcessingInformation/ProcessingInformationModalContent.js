import React from 'react';
import Image from 'next/image';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { stringEnumerate } from '../../../common/helpers';

import SubmitterSuppliedProtocol from './SubmitterSuppliedProtocol';
import ProcessorVersion from './ProcessorVersion';
import FileIcon from './file.svg';
import ProcessIcon from './process.svg';

export default class ProcessingInformationModalContent extends React.Component {
  render() {
    const { sample, results } = this.props;

    const pipelinesText = results.map(result => result.processor.name);
    const isSubmitterProcessed = isEqual(pipelinesText, [
      'Submitter-processed',
    ]);

    return (
      <div>
        <h1 className="processing-info-modal__title">Processing Information</h1>

        {isSubmitterProcessed ? (
          <React.Fragment>
            <a
              href="//docs.refine.bio/en/latest/main_text.html#refine-bio-processed-refinebio-processedibadge"
              className="dot-label dot-label--submitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              Submitter processed
            </a>
            <SubmitterSuppliedProtocol
              {...this.props}
              isSubmitterProcessed={isSubmitterProcessed}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <a
              href="//docs.refine.bio/en/latest/main_text.html#refine-bio-processed-refinebio-processedibadge"
              className="dot-label"
              target="_blank"
              rel="noopener noreferrer"
            >
              refine.bio processed
            </a>

            {this._renderPipelines()}

            {!isEmpty(sample.protocol_info) && (
              <section className="processing-info-modal__section">
                <SubmitterSuppliedProtocol {...this.props} />
              </section>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }

  _renderPipelines() {
    const { results } = this.props;
    const pipelinesText = results.map(result => result.processor.name);

    return (
      <React.Fragment>
        <h3>{stringEnumerate(pipelinesText)}</h3>

        <div className="pipeline">
          <div className="pipeline__item">
            <Image src={FileIcon} alt="" />
            <div>Input File</div>
          </div>
          <div className="pipeline__arrow">
            <div className="arrow" />
          </div>

          {results.map(({ processor: { name } }) => (
            <React.Fragment key={name}>
              <div className="pipeline__item">
                <Image src={ProcessIcon} alt="" />
                <div>{name}</div>
              </div>
              <div className="pipeline__arrow">
                <div className="arrow" />
              </div>
            </React.Fragment>
          ))}

          <div className="pipeline__item">
            <Image src={FileIcon} alt="" />
            <div>Gene Expression Matrix</div>
          </div>
        </div>

        {results.map(({ processor: { name } }) =>
          this._getProtocolDescription(name)
        )}

        <div>
          All samples available for download will be <b>quantile normalized</b>.
          For more information regarding how quantile normalization is performed
          and its limitations, see{' '}
          <a
            href="https://github.com/AlexsLemonade/refinebio-docs/blob/master/docs/main_text.md#quantile-normalization"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            our documentation
          </a>
          .
        </div>

        <ProcessorVersion {...this.props} />
      </React.Fragment>
    );
  }

  static PROTOCOLS = {
    'Affymetrix SCAN': AffymetrixScanProtocol,
    'Illumina SCAN': IlluminaScanProtocol,
    'Transcriptome Index': null,
    'Salmon Quant': SalmonProtocol,
    MultiQC: null,
    Tximport: TxtimportProtocol,

    'Submitter-processed': SubmitterSuppliedProtocol,
  };

  _getProtocolDescription(name) {
    const Component = ProcessingInformationModalContent.PROTOCOLS[name];
    if (!Component) {
      return null;
    }
    return <Component {...this.props} key={name} />;
  }
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
        et al. <i>Genomics</i>. 2012.{' '}
        <a
          href="http://doi.org/10.1016/j.ygeno.2012.08.003"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          DOI: 10.1016/j.ygeno.2012.08.003
        </a>
        ){' '}
        <span>
          and the SCAN.UPC bioconductor package documentation (
          <a
            href="https://doi.org/10.18129/B9.bioc.SCAN.UPC"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            DOI: 10.18129/B9.bioc.SCAN.UPC
          </a>
          ).
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
        the primary publication (Piccolo, et al. <i>Genomics</i>. 2012.{' '}
        <a
          href="http://doi.org/10.1016/j.ygeno.2012.08.003"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          DOI: 10.1016/j.ygeno.2012.08.003
        </a>
        ).
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
        from RNA-Seq data. We use it in quasi-mapping mode, which is
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
        </a>
        , which are gene-level count-scale values that are generated by scaling
        TPM using the average transcript length across samples and to the
        library size. Note that tximport is applied at the{' '}
        <em>experiment-level</em> rather than to single samples. For additional
        information, see the{' '}
        <a
          href="http://bioconductor.org/packages/release/bioc/html/tximport.html"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          tximport Bioconductor page
        </a>
        , the{' '}
        <a
          href="http://bioconductor.org/packages/release/bioc/vignettes/tximport/inst/doc/tximport.html"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          tximport tutorial{' '}
          <em>Importing transcript abundance datasets with tximport</em>
        </a>
        , and{' '}
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

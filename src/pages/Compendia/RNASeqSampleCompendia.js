import React from 'react';
import Image from 'next/image';
import RNASeqIcon from './icon-rnaseq-compendia.svg';
import RNASeqProcess from './quantpendia-pipeline-illustration.svg';
import DownloadCompendia from './DownloadCompendia';
import InfoBadge from '../../common/icons/info-badge.svg';

export default function RNASeqSampleCompendia({ title }) {
  return (
    <div className="compendia__tab--container">
      <div className="compendia__download">
        <div className="compendia__icon">
          <Image alt="compendia" src={RNASeqIcon} />
        </div>
        <p className="compendia__name">RNA-seq Sample Compendia</p>
        <div className="compendia__process-download">
          <p className="compendia__process">
            Get the collection of Salmon output as <mark>quant.sf</mark> files
            for an organism's RNA-seq samples for maximum flexibility
          </p>
          <DownloadCompendia title={title} filter={{ quant_sf_only: true }}>
            <div className="download-compendia__info">
              <Image src={InfoBadge} alt="Attention" />
              Data is not normalized or aggregated.
            </div>
          </DownloadCompendia>
        </div>
      </div>
      <div className="compendia__section compendia__section--inline">
        <div className="compendia__section">
          <div className="compendia__section-title">Uniformly Processed</div>
          <Image
            alt="RNA-seq sample compendia process - input file to salmon to tximport"
            src={RNASeqProcess}
          />
          <p>
            All RNA-seq samples are uniformly processed using{' '}
            <a
              href="ihttps://combine-lab.github.io/salmon/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Salmon
            </a>{' '}
            and the output <mark>quant.sf</mark> files are zipped together.
            Note: This compendia is not normalized or aggregated.
          </p>
          <a
            href="//docs.refine.bio/en/latest/main_text.html#rna-seq-sample-compendia"
            className="button button--secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
        </div>
        <div className="compendia__section">
          <div className="compendia__section-title">
            Customize your download
          </div>
          <p>
            Choose the quant.sf files by experiment or samples using our API.
          </p>
          <a
            href="https://api.refine.bio/v1/#tag/compendia"
            className="button button--secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the Docs
          </a>
        </div>
      </div>
    </div>
  );
}

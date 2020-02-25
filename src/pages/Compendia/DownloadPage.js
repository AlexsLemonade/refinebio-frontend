import React from 'react';
import { Router, useRouter } from 'next/router';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import DownloadDatasetImage from '../dataset/download-dataset.svg';
import TubeyAdventureImage from './tubey-adventure.svg';
import { formatSentenceCase } from '../../common/helpers';
import ScrollTopOnMount from '../../components/ScrollTopOnMount';

export default function DownloadPage() {
  const router = useRouter();
  const { organism, url } = router.query;

  React.useEffect(() => {
    if (url) {
      window.location = url;
    }
  });
  // this needs to account for rna-seq or normalized
  if (!url) {
    Router.push('/compendia');
    return null;
  }

  return (
    <div className="layout__content">
      <ScrollTopOnMount />
      <div className="dataset__container">
        <div className="dataset__message">
          <div className="dataset__way-container">
            <div className="dataset__processed-text">
              <h1>
                <IoMdCheckmarkCircle className="color-success" /> Downloading{' '}
                {formatSentenceCase(organism)} compendium...
              </h1>
              <p>
                If the download did not start,{' '}
                <a
                  href={url}
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  click here
                </a>
              </p>
            </div>
            <div className="dataset__way-image">
              <img src={DownloadDatasetImage} alt="" />
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="dataset__container">
        <div className="dataset__message">
          <h1>Explore what you can do with the species compendia!</h1>

          <p>
            <a
              href="//docs.refine.bio/en/latest/getting_started.html#getting-started-with-species-compendia"
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get started with the species compendia
            </a>
          </p>
          <p>
            <a
              href="//docs.refine.bio/en/latest/main_text.html#species-compendia"
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn how the species compendia are created
            </a>
          </p>
          <p className="mb-2">
            <a
              href="https://github.com/AlexsLemonade/compendium-processing/tree/master/quality_check"
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              See our exploratory analyses in test species compendia
            </a>
          </p>

          <img src={TubeyAdventureImage} alt="" />
        </div>
      </div>
    </div>
  );
}

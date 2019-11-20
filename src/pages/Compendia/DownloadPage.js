import React from 'react';
import { Redirect } from 'react-router-dom';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import DownloadDatasetImage from '../Downloads/DataSet/download-dataset.svg';
import TubeyAdventureImage from './tubey-adventure.svg';
import { formatSentenceCase } from '../../common/helpers';

export default function DownloadPage({ location }) {
  React.useEffect(() => {
    if (location.state && location.state.compendium) {
      window.location = location.state.downloadUrl;
    }
  });
  // this needs to account for rna-seq or normalized
  if (!location.state || !location.state.downloadUrl) {
    return <Redirect to="/species-compendia" />;
  }
  const { compendium, downloadUrl } = location.state;

  return (
    <div className="layout__content">
      <div className="dataset__container">
        <div className="dataset__message">
          <div className="dataset__way-container">
            <div className="dataset__processed-text">
              <h1>
                <IoMdCheckmarkCircle className="color-success" /> Downloading{' '}
                {formatSentenceCase(compendium.primary_organism)} compendium...
              </h1>
              <p>
                If the download did not start,{' '}
                <a
                  href={downloadUrl}
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
              href="http://docs.refine.bio/en/latest/getting_started.html#getting-started-with-species-compendia"
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get started with the species compendia
            </a>
          </p>
          <p>
            <a
              href="http://docs.refine.bio/en/latest/main_text.html#species-compendia"
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

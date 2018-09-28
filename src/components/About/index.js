import React from 'react';

import './About.scss';

import circusPlot from './circus-plot.svg';
import savingTimes from './saving-times.svg';
import oneRepo from './one-repo.svg';
import betterMed from './better-med.svg';
import alsfLogo from './ALSFsquare.jpg';
import ccdlLogo from './CCDL-logo.jpg';

function About() {
  return (
    <div>
      <div className="about">
        <div className="about__header">
          <img
            src={circusPlot}
            className="about__header-bg"
            alt="Circus Plot"
          />
          <h1 className="about__tagline">
            Fighting childhood cancer, thousands of datasets at a time
          </h1>
        </div>

        <div className="about__section">
          <div className="box about__top-box">
            <div className="about__top-box-tagline">
              refine.bio will have harmonized over 60,000 gene expression
              experiments
            </div>

            <div className="about__stats-list">
              <div className="about__stat-item">
                <div className="about__stat">1.5M</div>
                <div className="about__stat-text">
                  1.5 million samples will be available
                </div>
              </div>
              <div className="about__stat-item">
                <div className="about__stat">3K</div>
                <div className="about__stat-text">
                  There will be support for 3000 organisms
                </div>
              </div>
              <div className="about__stat-item">
                <div className="about__stat">1 PB</div>
                <div className="about__stat-text">
                  Over a petabyte of raw data will be processed
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about__section about__info-item about__info-item--right">
          <div>
            <img
              src={savingTimes}
              className="about__info-item-image"
              alt="Saving Time to Save Lives"
            />
          </div>

          <div>
            <div className="about__info-item-title">
              Saving Time to Save Lives
            </div>
            <div className="about__info-item-text">
              When childhood cancer researchers download transcriptome data (the
              collection of RNA molecules in a cell), each set can seem like its
              own language. Different studies use distinct technologies to
              collect the same type of data, and each technology has its own
              language. Researchers can spend up to 30% of their time
              translating these datasets into something they can use. This
              cumbersome process takes away valuable resources that could be
              spent in the lab discovering cutting-edge treatments and cures.
            </div>
          </div>
        </div>

        <div className="about__section about__info-item">
          <div>
            <img
              src={oneRepo}
              className="about__info-item-image"
              alt="One Language, One Repository"
            />
          </div>

          <div>
            <div className="about__info-item-title">
              One Language, One Repository
            </div>
            <div className="about__info-item-text">
              refine.bio is here to fix that. It’s the Rosetta Stone for the
              vast amount of publicly available childhood cancer data. It’s the
              first project of its kind to harmonize this information across
              many different technologies into one universal repository. Now
              researchers can pull from this massive dataset, saving precious
              time.
            </div>
          </div>
        </div>

        <div className="about__section about__info-item about__info-item--right">
          <div>
            <img
              src={betterMed}
              className="about__info-item-image"
              alt="Better Medicine Through Machine Learning"
            />
          </div>

          <div>
            <div className="about__info-item-title">
              Better Medicine Through Machine Learning
            </div>
            <div className="about__info-item-text">
              With the power of machine learning and the rich collection of data
              in refine.bio, researchers have the potential to extract more
              information about the biology of a patient’s sample. In turn
              researchers will be able to better classify patients and identify
              what types of treatments might be most effective on a case-by-case
              basis, further enhancing the burgeoning field of precision
              medicine.
            </div>
          </div>
        </div>

        <div className="about__section about__section-divider about__section-created">
          <div className="about__section-created__title">
            Created by the Childhood Cancer Data Lab (CCDL), powered by Alex’s
            Lemonade Stand Foundation, this endeavor is harnessing the power of
            big data to accelerate the pace of potential cures.
          </div>

          <div className="about__section-created__logo-container">
            <div className="about__section-created__logo">
              <img
                src={alsfLogo}
                className="img-responsive"
                width="186"
                height="200"
                alt="ALSF Logo"
              />
            </div>

            <div className="about__section-created__logo">
              <img
                src={ccdlLogo}
                className="img-responsive"
                width="319"
                height="156"
                alt="CCDL Logo"
              />
            </div>
          </div>
        </div>

        <div className="about__section about__section-donate">
          <div className="box">
            <div className="about__section-donate__container">
              <div className="about__section-donate__title">
                Donate today to support the CCDL’s efforts to give researchers
                the tools to create a healthier, more prosperous future for kids
                fighting cancer and beyond.
              </div>

              <div className="about__section-donate__action">
                <a
                  href="https://secure.squarespace.com/checkout/donate?donatePageId=5b046884575d1f9eea37935b"
                  className="button button--large about__button-donate"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DONATE NOW
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default About;

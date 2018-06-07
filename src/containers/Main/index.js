import React from 'react';
import { push } from '../../state/routerActions';
import { connect } from 'react-redux';
import { fetchResults } from '../../state/search/actions';
import SearchInput from '../../components/SearchInput';
import { Link } from 'react-router-dom';
import SearchIcon from '../../common/icons/search.svg';
import DatasetIcon from '../../common/icons/dataset.svg';
import FundIcon from '../../common/icons/fund-icon.svg';
import './Main.scss';

const Main = ({ searchTerm, fetchResults, push }) => {
  return (
    <div className="main">
      <section className="main__section main__section--searchbox">
        <div className="main__container main__container--searchbox">
          <h1 className="main__heading-1">
            Search for harmonized transcriptome data
          </h1>
          <SearchInput
            onSubmit={value => push(`/results?q=${value.search}`)}
            searchTerm={searchTerm}
          />
          <div className="main__search-suggestions">
            <p className="main__search-suggestion-label">Try searching for:</p>
            <Link className="main__search-suggestion" to="/results?q=Notch">
              Notch
            </Link>
            <Link
              className="main__search-suggestion"
              to="/results?q=medulloblastoma"
            >
              Medulloblastoma
            </Link>
            <Link className="main__search-suggestion" to="/results?q=GSE16476">
              GSE16476
            </Link>
          </div>
        </div>
      </section>
      <section className="main__section">
        <div className="main__container main__container--flex">
          <div className="main__col">
            <h3 className="main__heading-2">
              <img src={SearchIcon} className="main__icon" alt="search-icon" />{' '}
              Find the data you need
            </h3>
            <p className="main__paragraph">
              Search the collection of harmonized RNA-seq and microarray data
              from publicly available sources like GEO, ArrayExpress, and SRA.
              The data has been processed with a set of standardized pipelines
              curated by the{' '}
              <a
                className="link"
                href="https://www.ccdatalab.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Childhood Cancer Data Lab (CCDL)
              </a>.
            </p>
          </div>
          <div className="main__col">
            <h3 className="main__heading-2">
              <img
                src={DatasetIcon}
                className="main__icon"
                alt="dataset-icon"
              />{' '}
              Create custom datasets
            </h3>
            <p className="main__paragraph">
              Build and download custom datasets tailored to your needs
              including gene expression matrices and sample metadata.
            </p>
          </div>
        </div>
      </section>
      <section className="main__section main__section--gray">
        <div className="main__container">
          <h2 className="main__heading-1">Summary Statistics</h2>
        </div>
      </section>
      <section className="main__section main__section--blue-gradient">
        <div className="main__container">
          <h1 className="main__heading-1">Sign Up for Updates</h1>
          {/* Mailchimp Form Embed */}
          <div id="mc_embed_signup">
            <form
              action="https://ccdatalab.us14.list-manage.com/subscribe/post?u=1ed0ac5b8f11380ee862cf278&amp;id=074bca87ce"
              method="post"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
              className="validate"
              target="_blank"
              noValidate
            >
              <div id="mc_embed_signup_scroll" className="main__mailchimp-form">
                <input
                  type="email"
                  name="EMAIL"
                  className="input-text main__mailchimp-input"
                  id="mce-EMAIL"
                  placeholder="email address"
                  required
                />
                <div
                  style={{ position: 'absolute', left: '-5000px' }}
                  aria-hidden="true"
                >
                  <input
                    type="text"
                    name="b_1ed0ac5b8f11380ee862cf278_074bca87ce"
                    tabIndex="-1"
                    value=""
                  />
                </div>
                <div className="clear">
                  <input
                    type="submit"
                    value="Subscribe"
                    name="subscribe"
                    id="mc-embedded-subscribe"
                    className="button main__mailchimp-button"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="footer__container footer__container--main footer__flex">
          <div className="footer__left">
            <p>
              refine.bio is a repository of harmonized, ready-to-use
              transcriptome data from publicly available sources. refine.bio is
              a project of the{' '}
              <a
                className="link"
                href="https://www.ccdatalab.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Childhood Cancer Data Lab (CCDL)
              </a>
            </p>
          </div>
          <div className="footer__right">
            <div className="footer__flex footer__flex--v-centered">
              <a
                href="https://secure.squarespace.com/checkout/donate?donatePageId=5b046884575d1f9eea37935b"
                className="button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={FundIcon} className="main__icon" alt="fund-icon" />{' '}
                Fund the CCDL
              </a>
              <a
                href="https://twitter.com/CancerDataLab"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ion-social-twitter footer__social" />
              </a>
              <a
                href="https://github.com/AlexsLemonade/refinebio"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ion-social-github footer__social" />
              </a>
            </div>
            <p className="footer__author">
              Developed by the{' '}
              <a
                className="link"
                href="https://www.ccdatalab.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Childhood Cancer Data Lab
              </a>
            </p>
            <p>
              Powered by{' '}
              <a
                className="link"
                href="https://www.alexslemonade.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Alex's Lemonade Stand Foundation
              </a>
            </p>
          </div>
        </div>
        <div className="footer__container footer__flex footer__flex--v-centered">
          <div className="footer__left">
            <ul className="footer__links">
              <li className="footer__link">BDS 3-Clause License</li>
              <li className="footer__link">Privacy</li>
              <li className="footer__link">Terms of Use</li>
              <li className="footer__link">Contact</li>
            </ul>
          </div>
          <div className="footer__right">
            <p className="footer__version">Version 24354-23111</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const mapStateToProps = state => {
  const { search: { searchTerm } } = state;
  return {
    searchTerm
  };
};

const MainContainer = connect(mapStateToProps, { fetchResults, push })(Main);

export default MainContainer;

import React from 'react';
import Helmet from 'react-helmet';
import { push } from '../../state/routerActions';
import { connect } from 'react-redux';
import { fetchResults } from '../../state/search/actions';
import SearchInput from '../../components/SearchInput';
import { Link } from 'react-router-dom';
import SearchIcon from '../../common/icons/search.svg';
import DatasetIcon from '../../common/icons/dataset.svg';
import ExploreIcon from '../../common/icons/explore.svg';
import './Main.scss';
import {
  SamplesPerSpeciesGraph,
  SamplesOverTimeGraph,
  getSamplesOverTime
} from './graphs';
import TabControl from '../../components/TabControl';
import apiData from '../../apiData.json';
import { searchUrl } from '../../routes';

let Main = ({ searchTerm, fetchResults, push }) => {
  return (
    <div className="main">
      <Helmet>
        <title>Search for harmonized transcriptome data - refine.bio</title>
      </Helmet>
      <section className="main__section main__section--searchbox">
        <div className="main__container main__container--searchbox">
          <h1 className="main__heading-1">
            Search for harmonized transcriptome data
          </h1>
          <SearchInput
            onSubmit={query => push(searchUrl(query ? { q: query } : null))}
            buttonStyle="primary"
          />
          <div className="main__search-suggestions">
            <p className="main__search-suggestion-label">Try searching for:</p>

            {['Notch', 'Medulloblastoma', 'GSE24528'].map(q => (
              <Link
                className="main__search-suggestion"
                to={searchUrl({ q })}
                key={q}
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="main__section">
        <div className="main__steps-container">
          <div className="main__col">
            <h3 className="main__heading-2">
              <img src={SearchIcon} className="main__icon" alt="search-icon" />{' '}
              Find the data you need
            </h3>
            <p className="main__paragraph">
              Search the multi-organism collection of genome wide gene
              expression data obtained from publicly available sources like GEO,
              ArrayExpress, and SRA. The data has been processed uniformly and
              normalized using a set of standardized pipelines curated by the{' '}
              <a
                className="link"
                href="https://www.ccdatalab.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Childhood Cancer Data Lab (CCDL)
              </a>
              .
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
          <div className="main__col">
            <h3 className="main__heading-2">
              <img
                src={ExploreIcon}
                className="main__icon"
                alt="dataset-icon"
              />{' '}
              Explore the docs
            </h3>
            <p className="main__paragraph">
              Learn more about our{' '}
              <a
                href="http://docs.refine.bio/en/latest/index.html"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="link"
              >
                pipelines
              </a>{' '}
              or explore{' '}
              <a
                href="http://docs.refine.bio/en/latest/main_text.html#use-cases-for-downstream-analysis"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="link"
              >
                example workflows
              </a>{' '}
              to see how data from refine.bio can help with your analysis.
            </p>
          </div>
        </div>
      </section>
      {(getSamplesOverTime() || apiData.organism) && (
        <section className="main__section main__section--gray">
          <div className="main__container">
            <h2 className="main__heading-1">Summary Statistics</h2>

            <TabControl
              tabs={[
                apiData.organism ? 'Samples per Species' : false,
                getSamplesOverTime() ? 'Samples over Time' : false
              ]}
              toggleClassName="toggle--statics-tabs"
            >
              <SamplesPerSpeciesGraph />
              <SamplesOverTimeGraph />
            </TabControl>
          </div>
        </section>
      )}
      <section className="main__section main__section--blue-gradient">
        <div className="main__container">
          <div className="main__heading-1">Sign Up for Updates</div>
          <div className="main__blurp-text">
            Be the first to know about new features, compendia releases, and
            more!
          </div>
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
                <div className="flex-button-container">
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
    </div>
  );
};
Main = connect(
  ({ search: { searchTerm } }) => ({ searchTerm }),
  { fetchResults, push }
)(Main);

export default Main;

import React from 'react';
import { push } from '../../state/routerActions';
import { connect } from 'react-redux';
import { fetchResults } from '../../state/search/actions';
import SearchInput from '../../components/SearchInput';
import { Link } from 'react-router-dom';
import SearchIcon from '../../common/icons/search.svg';
import DatasetIcon from '../../common/icons/dataset.svg';
import './Main.scss';
import StatsPlaceholder from './summary-stats-placeholder.svg';

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
            buttonStyle="primary"
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
      {false && (
        <section className="main__section main__section--gray">
          <div className="main__container">
            <h2 className="main__heading-1">Summary Statistics</h2>

            <img src={StatsPlaceholder} class="main__stats-placeholder" />
          </div>
        </section>
      )}
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

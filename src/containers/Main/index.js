import React from 'react';
import { connect } from 'react-redux';
import * as resultsActions from '../../state/search/actions';
import SearchInput from '../../components/SearchInput';
import './Main.scss';

const Main = ({ searchTerm }) => {
  return (
    <div className="main">
      <section className="main__section main__section--searchbox">
        <div className="main__container main__container--searchbox">
          <h1 className="main__heading-1">
            Search for harmonized transcriptome data
          </h1>
          <SearchInput onSubmit={this.handleSubmit} searchTerm={searchTerm} />
          <div className="main__search-suggestions">
            <p>Try searching for:</p>
            <a href="">Notch</a>
            <a href="">medulloblastoma</a>
            <a href="">GSE16476</a>
          </div>
        </div>
      </section>
      <section className="main__section">
        <div className="main__container main__container--flex">
          <div className="main__col">
            <h3 className="main__heading-2">Find the data you need</h3>
            <p class="main__paragraph">
              Search the collection of harmonized RNA-seq and microarray data
              from publicly available sources like GEO, ArrayExpress, and SRA.
              The data has been processed with a set of standardized pipelines
              curated by the Childhood Cancer Data Lab (CCDL).
            </p>
          </div>
          <div className="main__col">
            <h3 className="main__heading-2">Create custom datasets</h3>
            <p class="main__paragraph">
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
              <div id="mc_embed_signup_scroll">
                <input
                  type="email"
                  value=""
                  name="EMAIL"
                  className="input-text"
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
                    className="button"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <footer className="main__footer">
        <div className="main__container main__container--flex">
          <p>
            refine.bio is a repository of harmonized, ready-to-use transcriptome
            data from publiclgy available sources. refine.bio is a project of
            the
          </p>
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

const MainContainer = connect(mapStateToProps)(Main);

export default MainContainer;

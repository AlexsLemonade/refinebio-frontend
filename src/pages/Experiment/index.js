import React from 'react';
import Helmet from 'react-helmet';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import ExpandButton from './ExpandButton';
import {
  formatSentenceCase,
  truncateOnWord,
  maxTableWidth,
  slugify
} from '../../common/helpers';
import './Experiment.scss';
import * as routes from '../../routes';

import AccessionIcon from '../../common/icons/accession.svg';
import SampleIcon from '../../common/icons/sample.svg';
import OrganismIcon from '../../common/icons/organism.svg';
import BackToTop from '../../components/BackToTop';

import SamplesTable from '../../components/SamplesTable/SamplesTable';
import DataSetSampleActions from '../../components/DataSetSampleActions';
import Checkbox from '../../components/Checkbox';
import { goBack } from '../../state/routerActions';
import DataSetStats from '../../common/DataSetStats';
import Spinner from '../../components/Spinner';
import ScrollTopOnMount from '../../components/ScrollTopOnMount';
import Anchor from '../../components/Anchor';
import Technology, { getTechnologies } from './Technology';
import InfoBox from '../../components/InfoBox';
import classnames from 'classnames';
import { NDownloadableSamples } from '../../components/Strings';

import { searchUrl } from '../../routes';
import { getExperiment } from '../../api/experiments';
import NoMatch from '../NoMatch';
import { ServerError } from '../../common/errors';
import ServerErrorPage from '../ServerError';

const DatabaseNames = {
  GEO: 'Gene Expression Omnibus (GEO)',
  SRA: 'Sequence Read Archive (SRA)',
  ARRAY_EXPRESS: 'ArrayExpress'
};

let Experiment = ({ match, location: { search, state }, goBack }) => {
  // check for the parameter `ref=search` to ensure that the previous page was the search
  const comesFromSearch = state && state.ref === 'search';
  return (
    <div>
      <InfoBox />

      <Loader
        fetch={() => getExperiment(match.params.id)}
        updateProps={match.params.id}
      >
        {({ isLoading, hasError, error, data: experiment }) => {
          if (hasError) {
            if (error && error instanceof ServerError && error.status === 404) {
              return <NoMatch />;
            }
            return <ServerErrorPage />;
          }

          let displaySpinner = isLoading;
          let experimentData = experiment || { samples: [] };
          let totalSamples = experimentData.samples.length;
          let processedSamples = experimentData.samples.filter(
            x => x.is_processed
          ).length;
          let organisms = experimentData.organisms;

          // for users coming from the search, see if there's any experiment's data in the url state
          if (isLoading && comesFromSearch && state.result) {
            displaySpinner = false;
            experimentData = {
              ...state.result,
              samples: []
            };
            totalSamples = state.result.total_samples_count;
            organisms = state.result.organism_names;
          }

          // Ensure that the url has the correct slug
          if (!isLoading && match.params.slug !== slugify(experiment.title)) {
            return <Redirect to={routes.experiments(experiment)} />;
          }

          return displaySpinner ? (
            <Spinner />
          ) : (
            <div>
              <div className="layout__content">
                <ScrollTopOnMount />
                {comesFromSearch && (
                  <Button
                    text="Back to Results"
                    buttonStyle="secondary"
                    onClick={goBack}
                  />
                )}

                <div className="experiment">
                  <ExperimentHelmet experiment={experimentData} />
                  <BackToTop />
                  <div className="experiment__accession">
                    <img
                      src={AccessionIcon}
                      className="experiment__stats-icon"
                      alt="Accession Icon"
                    />
                    {experimentData.accession_code}
                  </div>

                  <div className="experiment__header">
                    <h1 className="experiment__header-title mobile-p">
                      {experimentData.title || 'No Title.'}
                    </h1>
                    <div>
                      <DataSetSampleActions
                        dataSetSlice={{
                          [experimentData.accession_code]: DataSetStats.mapAccessions(
                            experimentData.samples
                          )
                        }}
                      />
                    </div>
                  </div>

                  <div className="experiment__stats">
                    <div className="experiment__stats-item">
                      <img
                        src={OrganismIcon}
                        className="experiment__stats-icon"
                        alt="Organism Icon"
                      />{' '}
                      {organisms.length
                        ? organisms
                            .map(organism => formatSentenceCase(organism.name))
                            .join(', ')
                        : 'No species.'}
                    </div>
                    <div className="experiment__stats-item">
                      <img
                        src={SampleIcon}
                        className="experiment__stats-icon"
                        alt="Sample Icon"
                      />{' '}
                      <NDownloadableSamples total={processedSamples} />
                    </div>

                    <div
                      className={classnames('experiment__stats-item', {
                        'experiment__stats-item--lg':
                          getTechnologies(experimentData.samples).length > 3
                      })}
                    >
                      <Technology samples={experimentData.samples} />
                    </div>
                  </div>

                  <h4 className="experiment__title">
                    Submitter Supplied Information
                  </h4>

                  <div>
                    <ExperimentHeaderRow label="Description">
                      {experimentData.description}
                    </ExperimentHeaderRow>
                    <ExperimentHeaderRow label="PubMed ID">
                      {(experimentData.pubmed_id && (
                        <a
                          href={`https://www.ncbi.nlm.nih.gov/pubmed/${
                            experimentData.pubmed_id
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link"
                        >
                          {experimentData.pubmed_id}
                        </a>
                      )) || (
                        <i className="experiment__not-provided">
                          No associated PubMed ID
                        </i>
                      )}
                    </ExperimentHeaderRow>
                    <ExperimentHeaderRow label="Publication Title">
                      {(experimentData.publication_title && (
                        <a
                          href={`https://www.ncbi.nlm.nih.gov/pubmed/${
                            experimentData.pubmed_id
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link"
                        >
                          {experimentData.publication_title}
                        </a>
                      )) || (
                        <i className="experiment__not-provided">
                          No associated publication
                        </i>
                      )}
                    </ExperimentHeaderRow>
                    <ExperimentHeaderRow label="Total Samples">
                      {totalSamples}
                    </ExperimentHeaderRow>
                    <ExperimentHeaderRow label="Submitter’s Institution">
                      <Link
                        to={searchUrl({
                          q: experimentData.submitter_institution
                        })}
                        className="link"
                      >
                        {experimentData.submitter_institution}
                      </Link>
                    </ExperimentHeaderRow>
                    <ExperimentHeaderRow label="Authors">
                      {experimentData.publication_authors.length > 0 ? (
                        experimentData.publication_authors
                          .map(author => (
                            <Link
                              to={searchUrl({ q: author })}
                              className="link"
                            >
                              {author}
                            </Link>
                          ))
                          .reduce((previous, current) => (
                            <React.Fragment>
                              {previous}
                              {', '}
                              {current}
                            </React.Fragment>
                          ))
                      ) : (
                        <i className="experiment__not-provided">
                          No associated authors
                        </i>
                      )}
                    </ExperimentHeaderRow>
                  </div>

                  {experimentData.source_database && (
                    <div className="experiment__source-database">
                      <div className="experiment__row-label">
                        Source Repository
                      </div>
                      <div>
                        <a
                          href={experimentData.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link"
                        >
                          {DatabaseNames[experimentData.source_database]}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <SamplesTableBlock
                experiment={isLoading ? null : experimentData}
              />
            </div>
          );
        }}
      </Loader>
    </div>
  );
};
Experiment = connect(
  null,
  { goBack }
)(Experiment);

export default Experiment;

function ExperimentHelmet({ experiment }) {
  return (
    <Helmet>
      {experiment.title && <title>{experiment.title} - refine.bio</title>}
      {experiment.description && (
        <meta
          name="description"
          content={truncateOnWord(experiment.description, 160)}
        />
      )}
      <link
        rel="canonical"
        href={window.location.origin + routes.experiments(experiment)}
      />
    </Helmet>
  );
}

function ExperimentHeaderRow({ label, children }) {
  return (
    <div className="experiment__row">
      <div className="experiment__row-label">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function SamplesTableBlock({ experiment }) {
  const [expanded, setExpanded] = React.useState(false);
  const totalColumns = 4 + (experiment ? experiment.sample_metadata.length : 0);
  const style = expanded
    ? { maxWidth: Math.max(1175, maxTableWidth(totalColumns)) }
    : {};

  return (
    <div
      className="layout__content experiment__samples-table-block"
      style={style}
    >
      <div className="experiment">
        <Anchor name="samples">
          <div className="experiment__header">
            <h2 className="experiment__title mobile-p">Samples</h2>
            <div>
              {experiment && (
                <DataSetSampleActions
                  dataSetSlice={{
                    [experiment.accession_code]: DataSetStats.mapAccessions(
                      experiment.samples
                    )
                  }}
                />
              )}
            </div>
          </div>
          {!experiment ? (
            <div className="experiment__sample-table-loading-wrap">
              <Spinner />
            </div>
          ) : (
            <ExperimentSamplesTable
              experiment={experiment}
              filterActionComponent={() =>
                totalColumns > 5 && (
                  <div className="experiment__sample-table-expand">
                    <ExpandButton
                      expanded={expanded}
                      onClick={() => setExpanded(!expanded)}
                    />
                  </div>
                )
              }
            />
          )}
        </Anchor>
      </div>
    </div>
  );
}

class ExperimentSamplesTable extends React.Component {
  state = {
    showOnlyAddedSamples: false
  };

  render() {
    const { experiment } = this.props;

    return (
      <SamplesTable
        sampleMetadataFields={this.props.experiment.sample_metadata}
        experimentSampleAssociations={{
          [experiment.accession_code]: this.props.experiment.samples.map(
            x => x.accession_code
          )
        }}
        fetchSampleParams={{
          experiment_accession_code: experiment.accession_code,
          dataset_id: this.state.showOnlyAddedSamples
            ? this.props.dataSetId
            : undefined
        }}
        pageSizeDropdown={({ dropdown, totalSamples }) => (
          <React.Fragment>
            Show {dropdown} of {totalSamples} Total Samples
          </React.Fragment>
        )}
        filterActionComponent={this.props.filterActionComponent}
        // Render prop for the button that adds the samples to the dataset
        pageActionComponent={samplesDisplayed => {
          const stats = new DataSetStats(
            this.props.dataSet,
            this._getDataSetSlice()
          );
          return (
            <div className="experiment__sample-actions">
              <div className="mobile-p">
                <Checkbox
                  name="samples-dataset"
                  checked={this.state.showOnlyAddedSamples}
                  onChange={() =>
                    this.setState(state => ({
                      showOnlyAddedSamples: !state.showOnlyAddedSamples
                    }))
                  }
                  disabled={
                    !this.state.showOnlyAddedSamples &&
                    !stats.anyProcessedInDataSet()
                  }
                >
                  Show only samples in current dataset
                </Checkbox>
              </div>
            </div>
          );
        }}
      />
    );
  }

  /**
   * Builds a dataset slice, that only contains the current experiment accession code
   * with it's processed samples
   */
  _getDataSetSlice() {
    const { experiment } = this.props;

    return {
      [experiment.accession_code]: DataSetStats.mapAccessions(
        experiment.samples
      )
    };
  }
}
ExperimentSamplesTable = connect(({ download: { dataSetId, dataSet } }) => ({
  dataSetId,
  dataSet
}))(ExperimentSamplesTable);

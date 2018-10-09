import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import Loader from '../../components/Loader';
import { fetchExperiment } from '../../state/experiment/actions';
import Button from '../../components/Button';
import { formatSentenceCase } from '../../common/helpers';
import './Experiment.scss';

import AccessionIcon from '../../common/icons/accession.svg';
import SampleIcon from '../../common/icons/sample.svg';
import OrganismIcon from '../../common/icons/organism.svg';
import BackToTop from '../../components/BackToTop';

import SamplesTable from './SamplesTable';
import DataSetSampleActions from './DataSetSampleActions';
import Checkbox from '../../components/Checkbox';
import { goBack } from '../../state/routerActions';
import DataSetStats from './DataSetStats';
import TechnologyBadge, {
  MICROARRAY,
  RNA_SEQ
} from '../../components/TechnologyBadge';
import Spinner from '../../components/Spinner';
import ScrollTopOnMount from '../../components/ScrollTopOnMount';
import Anchor from '../../components/Anchor';

let Experiment = ({
  fetchExperiment,
  experiment = {},
  addSamplesToDataset,
  dataSet,
  match,
  location: { search, state },
  goBack
}) => {
  // check for the parameter `ref=search` to ensure that the previous page was the search
  const comesFromSearch = state && state.ref === 'search';
  const { organisms = [] } = experiment;

  return (
    <Loader fetch={() => fetchExperiment(match.params.id)}>
      {({ isLoading }) => {
        const experimentData = isLoading ? state && state.result : experiment;

        return !experimentData ? (
          <Spinner />
        ) : (
          <div>
            <ScrollTopOnMount />
            {comesFromSearch && (
              <Button
                text="Back to Results"
                buttonStyle="secondary"
                onClick={goBack}
              />
            )}

            <div className="experiment">
              <Helmet>
                <title>refine.bio - Experiment Details</title>
              </Helmet>
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
                <h3 className="experiment__header-title mobile-p">
                  {experimentData.title || 'No Title.'}
                </h3>
                <div>
                  <DataSetSampleActions
                    data={{
                      [experimentData.accession_code]: experimentData.samples
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
                  {experimentData.samples.length
                    ? `${experimentData.samples.length} Sample${
                        experimentData.samples.length > 1 ? 's' : null
                      }`
                    : null}
                </div>
                {!isLoading &&
                  experimentData.samples.length && (
                    <div className="experiment__stats-item">
                      <TechnologyBadge
                        className="experiment__stats-icon"
                        isMicroarray={experimentData.samples.some(
                          x => x.technology === MICROARRAY
                        )}
                        isRnaSeq={experimentData.samples.some(
                          x => x.technology === RNA_SEQ
                        )}
                      />
                      {[
                        ...new Set(
                          experimentData.samples.map(x => x.pretty_platform)
                        )
                      ].join(', ')}
                    </div>
                  )}
              </div>

              <h4 className="experiment__title">
                Submitter Supplied Information
              </h4>

              <div>
                <div className="experiment__row">
                  <div className="experiment__row-label">Description</div>
                  <div>{experimentData.description}</div>
                </div>
                <div className="experiment__row">
                  <div className="experiment__row-label">PubMed ID</div>
                  <div>
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
                  </div>
                </div>
                <div className="experiment__row">
                  <div className="experiment__row-label">Publication Title</div>
                  <div>
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
                  </div>
                </div>
                <div className="experiment__row">
                  <div className="experiment__row-label">
                    Submitter’s Institution
                  </div>
                  <div>
                    <a
                      href={`/results?q=${encodeURIComponent(
                        experimentData.submitter_institution
                      )}`}
                      rel="noopener noreferrer"
                      className="link"
                    >
                      {experimentData.submitter_institution}
                    </a>
                  </div>
                </div>
                <div className="experiment__row">
                  <div className="experiment__row-label">Authors</div>
                  <div>
                    {experimentData.publication_authors.length > 0 ? (
                      experimentData.publication_authors
                        .map(author => (
                          <a
                            href={`/results?q=${encodeURIComponent(author)}`}
                            rel="noopener noreferrer"
                            className="link"
                          >
                            {author}
                          </a>
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
                  </div>
                </div>
              </div>
              <Anchor name="samples">
                <section className="experiment__section">
                  <h2 className="experiment__title">Samples</h2>
                  {isLoading ? (
                    <div className="experiment__sample-table-loading-wrap">
                      <Spinner />
                    </div>
                  ) : (
                    <ExperimentSamplesTable experiment={experimentData} />
                  )}
                </section>
              </Anchor>
            </div>
          </div>
        );
      }}
    </Loader>
  );
};
Experiment = connect(
  ({ experiment, download: { dataSet } }) => ({ experiment, dataSet }),
  {
    fetchExperiment,
    goBack
  }
)(Experiment);

export default Experiment;

class ExperimentSamplesTable extends React.Component {
  state = {
    showOnlyAddedSamples: false,
    onlyAddedSamples: []
  };

  render() {
    const { experiment } = this.props;

    return (
      <SamplesTable
        dataSet={{
          [experiment.accession_code]: this._getSamplesToBeDisplayed()
        }}
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
                      showOnlyAddedSamples: !state.showOnlyAddedSamples,
                      onlyAddedSamples: stats.getSamplesInDataSet()
                    }))
                  }
                  disabled={
                    !this.state.showOnlyAddedSamples &&
                    !stats.anyProcessedInDataSet()
                  }
                >
                  Show only samples added to dataset
                </Checkbox>
              </div>

              <DataSetSampleActions
                data={{
                  [experiment.accession_code]: samplesDisplayed
                }}
                enableAddRemaining={false}
                meta={{
                  buttonStyle: 'secondary',
                  addText: 'Add Page to Dataset'
                }}
              />
            </div>
          );
        }}
      />
    );
  }

  _getSamplesToBeDisplayed() {
    if (this.state.showOnlyAddedSamples) {
      // show only the samples that are present in the dataset
      return this.state.onlyAddedSamples;
    }

    // return the accession codes of all samples
    return this.props.experiment.samples.map(x => x.accession_code);
  }

  /**
   * Bulilds a dataset slice, that only contains the current experiment accession code
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
ExperimentSamplesTable = connect(({ download: { dataSet } }) => ({ dataSet }))(
  ExperimentSamplesTable
);

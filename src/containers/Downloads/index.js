import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Toggle from '../../components/Toggle';
import AccessionIcon from '../../common/icons/accession.svg';
import SampleIcon from '../../common/icons/sample.svg';
import OrganismIcon from '../../common/icons/organism.svg';

import {
  removeExperiment,
  removeSpecies,
  fetchDataSetDetails
} from '../../state/download/actions';
import {
  groupSamplesBySpecies,
  getTotalSamplesAdded,
  getExperimentCountBySpecies,
  getTotalExperimentsAdded
} from '../../state/download/reducer';

import DownloadBar from './DownloadBar';
import DownloadFileSummary from './DownloadFileSummary';
import DownloadDatasetSummary from './DownloadDatasetSummary';

import './Downloads.scss';

function mapStateToProps(state) {
  return {
    ...state.download,
    samplesBySpecies: groupSamplesBySpecies(state),
    totalSamples: getTotalSamplesAdded(state),
    totalExperiments: getTotalExperimentsAdded(state),
    experimentCountBySpecies: getExperimentCountBySpecies(state)
  };
}

const downloadFilesData = [
  {
    title: '13 Gene Expression Matrices',
    description: '1 file per Aggregation Choice',
    size: '21 MB',
    format: 'csv'
  },
  {
    title: '13 Sample Metadata Files',
    description: '1 file per Experiment',
    size: '26 MB',
    format: 'txt'
  },
  {
    title: '13 Quality Reports',
    description: '1 file per Experiment',
    size: '13 MB',
    format: 'html'
  },
  {
    title: 'Estimated Download Size',
    description: ' ',
    size: '60 MB',
    format: ''
  }
];

class Download extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    };
  }

  handleTabChange(tabIndex) {
    this.setState({
      activeTab: tabIndex
    });
  }

  componentDidMount() {
    const { dataSet, dataSetId, fetchDataSetDetails } = this.props;
    if (dataSetId) fetchDataSetDetails(dataSet);
  }

  componentDidUpdate() {
    const {
      dataSet,
      dataSetId,
      areDetailsFetched,
      fetchDataSetDetails,
      isLoading
    } = this.props;
    if (dataSetId && !areDetailsFetched && !isLoading)
      fetchDataSetDetails(dataSet);
  }

  renderSpeciesSamples = () => {
    const { samplesBySpecies: species } = this.props;

    if (!Object.keys(species).length)
      return <p>No samples added to download dataset.</p>;
    return Object.keys(species).map((speciesName, i) => (
      <div className="downloads__sample" key={i}>
        <div className="downloads__sample-info">
          <h2>{speciesName} Samples</h2>
          <div className="downloads__sample-stats">
            <p className="downloads__sample-stat">
              {species[speciesName].length}{' '}
              {species[speciesName].length > 1 ? 'Samples' : 'Sample'}
            </p>
          </div>
          <Button text="View Samples" buttonStyle="secondary" />
        </div>
        <Button
          text="Remove"
          buttonStyle="remove"
          onClick={() => this.props.removeSpecies(species[speciesName])}
        />
      </div>
    ));
  };

  renderExperimentsView = () => {
    const { dataSet, experiments } = this.props;

    if (!Object.keys(dataSet).length)
      return <p>No samples added to download dataset.</p>;
    return Object.keys(dataSet).map((id, i) => {
      const experiment = experiments[id];
      return (
        <div className="downloads__sample" key={i}>
          <div className="downloads__dataSet-info">
            <h2 className="downloads__experiment-title">{experiment.title}</h2>
            <div className="downloads__sample-stats">
              <div className="downloads__sample-stat">
                <img
                  src={AccessionIcon}
                  className="downloads__sample-icon"
                  alt="Accession Icon"
                />{' '}
                {experiment.id}
              </div>
              <div className="downloads__sample-stat">
                <img
                  src={SampleIcon}
                  className="downloads__sample-icon"
                  alt="Sample Icon"
                />{' '}
                {experiment.samples.length}
              </div>
              <div className="downloads__sample-stat downloads__sample-stat--experiment">
                <img
                  src={OrganismIcon}
                  className="downloads__sample-icon"
                  alt="Organism Icon"
                />{' '}
                {experiment.organisms.join(',')}
              </div>
            </div>
            <h4>Sample Metadata Fields</h4>
            <h5>
              {experiment.metadata ? experiment.metadata.join(', ') : null}
            </h5>
            <Button text="View Samples" buttonStyle="secondary" />
          </div>
          <Button
            text="Remove"
            buttonStyle="remove"
            onClick={() =>
              this.props.removeExperiment([experiment.accession_code])
            }
          />
        </div>
      );
    });
  };

  sampleTabs = [this.renderSpeciesSamples, this.renderExperimentsView];

  render() {
    const {
      isLoading,
      areDetailsFetched,
      dataSet,
      samplesBySpecies,
      experimentCountBySpecies,
      totalSamples,
      totalExperiments
    } = this.props;
    return (
      <div className="downloads">
        <h1 className="downloads__heading">Download Dataset</h1>
        <DownloadBar />
        {isLoading && !areDetailsFetched ? (
          <div className="loader" />
        ) : (
          <div>
            <DownloadFileSummary summaryData={downloadFilesData} />
            <DownloadDatasetSummary
              samplesBySpecies={samplesBySpecies}
              totalSamples={totalSamples}
              totalExperiments={totalExperiments}
              experimentCountBySpecies={experimentCountBySpecies}
            />
            <section className="downloads__section">
              <h2>Samples</h2>
              <Toggle
                tabs={['Species View', 'Experiments View']}
                onToggle={this.handleTabChange.bind(this)}
              />
              <div className="downloads__card">
                {this.sampleTabs[this.state.activeTab]()}
              </div>
            </section>
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, {
  removeSpecies,
  removeExperiment,
  fetchDataSetDetails
})(Download);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Toggle from '../../components/Toggle';
import AccessionIcon from '../../common/icons/accession.svg';
import SampleIcon from '../../common/icons/sample.svg';
import OrganismIcon from '../../common/icons/organism.svg';

import DownloadBar from './DownloadBar';
import DownloadFileSummary from './DownloadFileSummary';
import DownloadDatasetSummary from './DownloadDatasetSummary';

import './Downloads.scss';

function mapStateToProps(state) {
  return {
    download: state.download
  };
}

const downloadFilesData = [
  {
    title: '13 Gene Expression Matrices',
    description: '1 file per Species',
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
    title: 'Extimated Download Size',
    description: ' ',
    size: '60 MB',
    format: ''
  }
];

const speciesData = [
  {
    name: 'Human',
    samples: Array(100).fill({}),
    genes: Array(233).fill({})
  },
  {
    name: 'Mouse',
    samples: Array(30).fill({}),
    genes: Array(133).fill({})
  }
];

const experimentData = [
  {
    id: 'E-GEOD-7529',
    title:
      'Transcription profiling of human neuroblast tumours reveals two distinct gene signatures identify malignant Neuroblast and Schwannian stromal cells',
    samples: Array(10).fill({}),
    species: 'Human',
    metadata: [
      'Sample Title',
      'Organism Part',
      'Sample Description',
      'Gender',
      'Age',
      'Disease',
      'Cell Line'
    ]
  },
  {
    id: 'E-GEOD-7529',
    title:
      'Transcription profiling of human neuroblast tumours reveals two distinct gene signatures identify malignant Neuroblast and Schwannian stromal cells',
    samples: Array(10).fill({}),
    species: 'Human',
    metadata: [
      'Sample Title',
      'Organism Part',
      'Sample Description',
      'Gender',
      'Age',
      'Disease',
      'Cell Line'
    ]
  },
  {
    id: 'E-GEOD-7529',
    title:
      'Transcription profiling of human neuroblast tumours reveals two distinct gene signatures identify malignant Neuroblast and Schwannian stromal cells',
    samples: Array(10).fill({}),
    species: 'Human',
    metadata: [
      'Sample Title',
      'Organism Part',
      'Sample Description',
      'Gender',
      'Age',
      'Disease',
      'Cell Line'
    ]
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

  renderSpeciesSamples = () => {
    return speciesData.map((species, i) => (
      <div className="downloads__sample" key={i}>
        <div className="downloads__sample-info">
          <h2>{species.name} Samples</h2>
          <div className="downloads__sample-stats">
            <p className="downloads__sample-stat">
              {species.samples.length} Samples
            </p>
            <p className="downloads__sample-stat">
              {species.genes.length} Genes
            </p>
          </div>
          <Button text="View Samples" buttonStyle="secondary" />
        </div>
        <Button text="Remove" buttonStyle="remove" />
      </div>
    ));
  };

  renderExperimentsView = () => {
    return this.props.download.experiments.map((experiment, i) => (
      <div className="downloads__sample" key={i}>
        <div className="downloads__experiments-info">
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
              {experiment.species}
            </div>
          </div>
          <h4>Sample Metadata Fields</h4>
          <h5>{experiment.metadata ? experiment.metadata.join(', ') : null}</h5>
          <Button text="View Samples" buttonStyle="secondary" />
        </div>
        <Button text="Remove" buttonStyle="remove" />
      </div>
    ));
  };

  sampleTabs = [this.renderSpeciesSamples, this.renderExperimentsView];

  render() {
    return (
      <div className="downloads">
        <h1 className="downloads__heading">Download Dataset</h1>
        <DownloadBar />
        <DownloadFileSummary summaryData={downloadFilesData} />
        <DownloadDatasetSummary />
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
    );
  }
}

export default connect(mapStateToProps)(Download);

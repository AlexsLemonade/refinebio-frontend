import React from 'react';
import { connect } from 'react-redux';

import Button from '../../components/Button';
import AccessionIcon from '../../common/icons/accession.svg';
import SampleIcon from '../../common/icons/sample.svg';
import OrganismIcon from '../../common/icons/organism.svg';
import TabControl from '../../components/TabControl';

import DownloadFileSummary from './DownloadFileSummary';
import DownloadDatasetSummary from './DownloadDatasetSummary';

import ModalManager from '../../components/Modal/ModalManager';
import SamplesTable from '../Experiment/SamplesTable';
import { formatSentenceCase, getMetadataFields } from '../../common/helpers';

import Radio from '../../components/Radio';
import { Link } from 'react-router-dom';
import {
  getTotalSamplesAdded,
  getExperimentCountBySpecies,
  getTotalExperimentsAdded
} from '../../state/download/reducer';
import {
  removeExperiment,
  removeSamples,
  clearDataSet
} from '../../state/download/actions';

import uniq from 'lodash/uniq';
import union from 'lodash/union';
import mapValues from 'lodash/mapValues';
import isEqual from 'lodash/isEqual';

import * as routes from '../../routes';

let DownloadDetails = ({
  dataSet,
  organism_samples: samplesBySpecies,
  experiments,
  aggregate_by,
  scale_by,

  removeSamples,
  removeExperiment,
  clearDataSet,
  isImmutable = false,
  isEmbed = false,
  onRefreshDataSet
}) => {
  const totalSamples = getTotalSamplesAdded({ dataSet });
  const totalExperiments = getTotalExperimentsAdded({ dataSet });
  const experimentCountBySpecies = getExperimentCountBySpecies({
    experiments,
    dataSet
  });

  return (
    <div>
      <DownloadFileSummary
        dataSet={dataSet}
        samplesBySpecies={samplesBySpecies}
        aggregate_by={aggregate_by}
        scale_by={scale_by}
        isEmbed={isEmbed}
      />
      <DownloadDatasetSummary
        samplesBySpecies={samplesBySpecies}
        totalSamples={totalSamples}
        totalExperiments={totalExperiments}
        experimentCountBySpecies={experimentCountBySpecies}
      />

      <section className="downloads__section">
        <div className="downloads__sample-header">
          <h2>Samples</h2>
          {isImmutable || (
            <ModalManager
              component={showModal => (
                <Button
                  buttonStyle="remove"
                  text="Remove All"
                  onClick={showModal}
                />
              )}
              modalProps={{ center: true }}
            >
              {({ hideModal }) => (
                <div>
                  <h1>Are you sure you want to remove all samples?</h1>
                  <div className="downloads__remove-confirmation">
                    <Button
                      buttonStyle="remove"
                      text="Yes, remove all samples"
                      onClick={clearDataSet}
                    />
                    <Button
                      buttonStyle="secondary"
                      text="No, keep all samples"
                      onClick={hideModal}
                    />
                  </div>
                </div>
              )}
            </ModalManager>
          )}
        </div>

        <TabControl tabs={['Species View', 'Experiments View']}>
          <SpeciesSamples
            onRefreshDataSet={onRefreshDataSet}
            dataSet={dataSet}
            samplesBySpecies={samplesBySpecies}
            removeSamples={removeSamples}
            isImmutable={isImmutable}
          />
          <ExperimentsView
            onRefreshDataSet={onRefreshDataSet}
            dataSet={dataSet}
            experiments={experiments}
            removeExperiment={removeExperiment}
            isImmutable={isImmutable}
          />
        </TabControl>
      </section>
    </div>
  );
};
DownloadDetails = connect(
  null,
  {
    removeSamples,
    removeExperiment,
    clearDataSet
  }
)(DownloadDetails);
export default DownloadDetails;

const SpeciesSamples = ({
  onRefreshDataSet,
  dataSet,
  samplesBySpecies,
  removeSamples,
  isImmutable = false
}) => (
  <div className="downloads__card">
    {Object.keys(samplesBySpecies).map(speciesName => {
      const samplesInSpecie = samplesBySpecies[speciesName];
      const specieDataSetSlice = mapValues(dataSet, samples =>
        samples.filter(accessionCode => samplesInSpecie.includes(accessionCode))
      );

      return (
        <div className="downloads__sample" key={speciesName}>
          <div className="downloads__sample-info">
            <h2 className="downloads__species-title">
              {formatSentenceCase(speciesName)} Samples
            </h2>
            <div className="downloads__sample-stats">
              <p className="downloads__sample-stat">
                {samplesInSpecie.length}{' '}
                {samplesInSpecie.length > 1 ? 'Samples' : 'Sample'}
              </p>
            </div>

            <div className="mobile-p">
              <ViewSamplesButtonModal
                onRefreshDataSet={onRefreshDataSet}
                dataSet={specieDataSetSlice}
                isImmutable={isImmutable}
              />
            </div>
          </div>

          {!isImmutable && (
            <Button
              text="Remove"
              buttonStyle="remove"
              onClick={() => removeSamples(specieDataSetSlice, true)}
            />
          )}
        </div>
      );
    })}
  </div>
);

class ExperimentsView extends React.Component {
  state = { organism: false };

  render() {
    const {
      onRefreshDataSet,
      dataSet,
      experiments,
      removeExperiment,
      isImmutable = false
    } = this.props;

    if (!dataSet || !Object.keys(dataSet).length) {
      return <p>No samples added to download dataset.</p>;
    }

    return (
      <div>
        {this._renderFilters()}

        <div className="downloads__card">
          {Object.keys(dataSet).map(experimentAccessionCode => {
            const addedSamples = dataSet[experimentAccessionCode];
            const experiment = experiments[experimentAccessionCode];
            const metadataFields = getMetadataFields(experiment);

            if (
              this.state.organism &&
              !experiment.organisms.includes(this.state.organism)
            ) {
              return null;
            }

            return (
              <div className="downloads__sample" key={experimentAccessionCode}>
                <div className="downloads__dataSet-info">
                  <Link
                    to={routes.experiments(experiment.accession_code)}
                    className="downloads__experiment-title link"
                  >
                    {experiment.title}
                  </Link>
                  <div className="downloads__sample-stats">
                    <div className="downloads__sample-stat">
                      <img
                        src={AccessionIcon}
                        className="downloads__sample-icon"
                        alt="Accession Icon"
                      />{' '}
                      {experiment.accession_code}
                    </div>
                    <div className="downloads__sample-stat">
                      <img
                        src={SampleIcon}
                        className="downloads__sample-icon"
                        alt="Sample Icon"
                      />{' '}
                      {addedSamples.length} Samples
                    </div>
                    <div className="downloads__sample-stat downloads__sample-stat--experiment">
                      <img
                        src={OrganismIcon}
                        className="downloads__sample-icon"
                        alt="Organism Icon"
                      />{' '}
                      {experiment.organisms
                        .map(organism => formatSentenceCase(organism))
                        .join(', ')}
                    </div>
                  </div>
                  <div className="downloads__experiment-metadata">
                    <h4>Sample Metadata Fields</h4>
                    <h5>
                      {metadataFields && metadataFields.length ? (
                        metadataFields.join(', ')
                      ) : (
                        <i className="result__not-provided">
                          No sample metadata fields
                        </i>
                      )}
                    </h5>
                  </div>

                  {addedSamples.length > 0 && (
                    <div className="mobile-p">
                      <ViewSamplesButtonModal
                        onRefreshDataSet={onRefreshDataSet}
                        dataSet={{ [experiment.accession_code]: addedSamples }}
                        isImmutable={isImmutable}
                      />
                    </div>
                  )}
                </div>
                {!isImmutable && (
                  <Button
                    text="Remove"
                    buttonStyle="remove"
                    onClick={() =>
                      removeExperiment([experiment.accession_code], true)
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  _renderFilters() {
    let organismsList = Object.keys(this.props.dataSet)
      .map(id => this.props.experiments[id].organisms)
      // flatten array https://stackoverflow.com/a/33680003/763705
      .reduce((accum, organisms) => accum.concat(organisms), []);

    // https://stackoverflow.com/a/14438954/763705
    const uniqueOrganisms = [...new Set(organismsList)];

    if (uniqueOrganisms.length <= 1) {
      return;
    }

    return (
      <div className="downloads__species-filters">
        <div className="downloads__species-filter-item">Show</div>
        <div className="downloads__species-filter-item">
          <Radio
            readOnly
            checked={!this.state.organism}
            onClick={() => this.setState({ organism: false })}
          >
            All Species
          </Radio>
        </div>
        {uniqueOrganisms.map((organism, key) => (
          <div className="downloads__species-filter-item" key={key}>
            <Radio
              readOnly
              checked={this.state.organism === organism}
              onClick={() => this.setState({ organism: organism })}
            >
              {formatSentenceCase(organism)}
            </Radio>
          </div>
        ))}
      </div>
    );
  }
}

/**
 * ViewSamples button, that when clicked shows a modal with a SamplesTable.
 *
 * When the modal is displayed, a snapshot of the samples is saved. So that the list it's not refreshed
 * while the modal is being displayed.
 */
class ViewSamplesButtonModal extends React.Component {
  state = {
    dataSet: {}
  };

  render() {
    return (
      <ModalManager
        component={showModal => (
          <Button
            text="View Samples"
            buttonStyle="secondary"
            onClick={() => {
              // copy the list of accession codes before displaying the modal dialog. So that the list doesn't get
              // modified if the user adds/removes any sample
              this.setState((state, props) => ({
                dataSet: props.dataSet
              }));
              showModal();
            }}
          />
        )}
        modalProps={{ className: 'samples-modal', fillPage: true }}
        onClose={() =>
          this.props.onRefreshDataSet &&
          !this.props.isImmutable &&
          this.props.onRefreshDataSet()
        }
      >
        {() => (
          <SamplesTable
            experimentSampleAssociations={this.state.dataSet}
            fetchSampleParams={{
              accession_codes: uniq(
                union(...Object.values(this.state.dataSet))
              ).join(',')
            }}
            isImmutable={this.props.isImmutable}
          />
        )}
      </ModalManager>
    );
  }
}

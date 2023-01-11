import React from 'react';
import { connect } from 'react-redux';

import Link from 'next/link';
import mapValues from 'lodash/mapValues';
import union from 'lodash/union';
import Button from '../../components/Button';
import AccessionIcon from '../../common/icons/accession.svg';
import SampleIcon from '../../common/icons/sample.svg';
import OrganismIcon from '../../common/icons/organism.svg';
import TabControl from '../../components/TabControl';

import DownloadFileSummary from './DownloadFileSummary';
import DownloadDatasetSummary from './DownloadDatasetSummary';

import ModalManager from '../../components/Modal/ModalManager';
import SamplesTable from '../../components/SamplesTable/SamplesTable';
import { formatSentenceCase, getMetadataFields } from '../../common/helpers';
import Radio from '../../components/Radio';

import {
  removeExperiment,
  removeSamples,
  clearDataSet,
} from '../../state/download/actions';

import * as routes from '../../routes';

const RNA_SEQ = 'RNA-SEQ';

let DownloadDetails = ({ dataSet, isImmutable = false, onRefreshDataSet }) => {
  return (
    <div>
      <h2>Download Files Summary</h2>

      <DownloadFileSummary dataSet={dataSet} />
      <DownloadDatasetSummary dataSet={dataSet} />

      <section className="downloads__section">
        <div className="downloads__sample-header">
          <h2>Samples</h2>
          <ClearDatasetButton />
        </div>

        <TabControl tabs={['Species View', 'Experiments View']}>
          <SpeciesSamples
            dataSet={dataSet}
            onRefreshDataSet={onRefreshDataSet}
            isImmutable={isImmutable}
          />
          <ExperimentsView
            dataSet={dataSet}
            onRefreshDataSet={onRefreshDataSet}
            isImmutable={isImmutable}
          />
        </TabControl>
      </section>
    </div>
  );
};
DownloadDetails = connect(null, {
  clearDataSet,
})(DownloadDetails);
export default DownloadDetails;

function ClearDatasetButton({ clearDataSet }) {
  return (
    <ModalManager
      component={showModal => (
        <Button buttonStyle="remove" text="Remove All" onClick={showModal} />
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
  );
}
ClearDatasetButton = connect(null, {
  clearDataSet,
})(ClearDatasetButton);

export function SpeciesSamples({
  dataSet: {
    id: dataSetId,
    dataSet: dataSetData,
    organism_samples: samplesBySpecies,
    quantile_normalize,
    experiments,
  },
  onRefreshDataSet,
  removeSamples,
  isImmutable = false,
}) {
  return (
    <div className="downloads__card">
      {Object.keys(samplesBySpecies).map(speciesName => {
        // get the accession codes associated with this species (`speciesName`)
        const samplesInSpecie = samplesBySpecies[speciesName];
        // filter the dataSet, and leave only the experiments that contain any of the samples
        const specieDataSetSlice = mapValues(dataSetData, samples =>
          samples.filter(accessionCode =>
            samplesInSpecie.includes(accessionCode)
          )
        );
        // concatenate all the sample metadata fields of all experiments containing these samples
        // This way we'll display all possible values of these samples
        let sampleMetadataFields = Object.keys(specieDataSetSlice)
          .filter(accessionCode => specieDataSetSlice[accessionCode].length > 0)
          .map(
            accessionCode =>
              experiments[accessionCode] &&
              experiments[accessionCode].sample_metadata
          );
        sampleMetadataFields = union(...sampleMetadataFields);

        // we can deduce that there're rna seq samples for this organism if some of the
        // experiments has samples of the same organism and it's also rna seq
        const hasRnaSeqExperiments = Object.values(experiments).some(
          experiment =>
            experiment.technology === RNA_SEQ &&
            experiment.organism_names.includes(speciesName)
        );

        return (
          <div className="downloads__sample" key={speciesName}>
            <div className="downloads__sample-info">
              <h2 className="downloads__species-title">
                {formatSentenceCase(speciesName)} Samples
              </h2>
              {hasRnaSeqExperiments && !quantile_normalize && (
                <div className="dot-label dot-label--info">
                  Quantile Normalization will be skipped for RNA-seq samples
                </div>
              )}
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
                  fetchSampleParams={{
                    dataset_id: dataSetId,
                    organism__name: speciesName,
                  }}
                  sampleMetadataFields={sampleMetadataFields}
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
}
SpeciesSamples = connect(null, {
  removeSamples,
})(SpeciesSamples);

export class ExperimentsView extends React.Component {
  state = { organism: false };

  render() {
    const {
      dataSet: {
        id: dataSetId,
        data: dataSetData,
        experiments,
        quantile_normalize,
      },
      onRefreshDataSet,
      removeExperiment,
      isImmutable = false,
    } = this.props;

    if (!dataSetData || !Object.keys(dataSetData).length) {
      return <p>No samples added to download dataset.</p>;
    }

    return (
      <div>
        {this._renderFilters()}

        <div className="downloads__card">
          {Object.keys(dataSetData).map(experimentAccessionCode => {
            const addedSamples = dataSetData[experimentAccessionCode];
            const experiment = experiments[experimentAccessionCode];
            const metadataFields = getMetadataFields(
              experiment.sample_metadata
            );

            if (
              this.state.organism &&
              !experiment.organism_names.includes(this.state.organism)
            ) {
              return null;
            }

            return (
              <div className="downloads__sample" key={experimentAccessionCode}>
                <div className="downloads__dataSet-info">
                  <Link
                    legacyBehavior
                    href="/experiments/[accessionCode]/[slug]"
                    as={routes.experiments(experiment)}
                  >
                    <a className="downloads__experiment-title link">
                      {experiment.title}
                    </a>
                  </Link>
                  {experiment.technology === RNA_SEQ && !quantile_normalize && (
                    <div className="dot-label dot-label--info">
                      Quantile Normalization will be skipped
                    </div>
                  )}
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
                      {experiment.organism_names
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
                        fetchSampleParams={{
                          dataset_id: dataSetId,
                          experiment_accession_code: experiment.accession_code,
                        }}
                        onRefreshDataSet={onRefreshDataSet}
                        dataSet={{ [experiment.accession_code]: addedSamples }}
                        isImmutable={isImmutable}
                        sampleMetadataFields={experiment.sample_metadata}
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
    const organismsList = Object.keys(this.props.dataSet.data)
      .map(id => this.props.dataSet.experiments[id].organism_names)
      // flatten array https://stackoverflow.com/a/33680003/763705
      .reduce((accum, organisms) => accum.concat(organisms), []);

    // https://stackoverflow.com/a/14438954/763705
    const uniqueOrganisms = [...new Set(organismsList)];

    if (uniqueOrganisms.length <= 1) {
      return null;
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
        {uniqueOrganisms.map(organism => (
          <div className="downloads__species-filter-item" key={organism}>
            <Radio
              readOnly
              checked={this.state.organism === organism}
              onClick={() => this.setState({ organism })}
            >
              {formatSentenceCase(organism)}
            </Radio>
          </div>
        ))}
      </div>
    );
  }
}
ExperimentsView = connect(null, {
  removeExperiment,
})(ExperimentsView);

/**
 * ViewSamples button, that when clicked shows a modal with a SamplesTable.
 *
 * When the modal is displayed, a snapshot of the samples is saved. So that the list it's not refreshed
 * while the modal is being displayed.
 */
class ViewSamplesButtonModal extends React.Component {
  static defaultProps = {
    sampleMetadataFields: [],
  };

  state = {
    dataSet: {},
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
                dataSet: props.dataSet,
              }));
              showModal();
            }}
          />
        )}
        modalProps={{
          className: 'samples-modal',
          fillPage: true,
          style: {
            content: { maxWidth: this.modalWidth() },
          },
        }}
        onClose={() =>
          this.props.onRefreshDataSet &&
          !this.props.isImmutable &&
          this.props.onRefreshDataSet()
        }
      >
        {() => (
          <SamplesTable
            experimentSampleAssociations={this.state.dataSet}
            fetchSampleParams={this.props.fetchSampleParams}
            isImmutable={this.props.isImmutable}
            sampleMetadataFields={this.props.sampleMetadataFields}
          />
        )}
      </ModalManager>
    );
  }

  modalWidth() {
    const totalColumns = 4 + this.props.sampleMetadataFields.length;

    // logic to decide the max-width of the modal
    // https://github.com/AlexsLemonade/refinebio-frontend/issues/495#issuecomment-459504896
    if (totalColumns <= 5) {
      return 1100;
    }
    if (totalColumns === 6) {
      return 1300;
    }
    if (totalColumns === 7) {
      return 1500;
    }
    return 1800;
  }
}

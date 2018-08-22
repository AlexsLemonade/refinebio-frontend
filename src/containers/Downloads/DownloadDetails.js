import React from 'react';
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

export default function DownloadDetails({
  dataSet,
  filesData,
  experiments,
  removeSamples,
  removeExperiment,
  clearDataSet,
  samplesBySpecies,
  experimentCountBySpecies,
  totalSamples,
  totalExperiments,
  isImmutable = false
}) {
  return (
    <div>
      {filesData && <DownloadFileSummary summaryData={filesData} />}
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
                  <div className="downloads__fieldset">
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
            samplesBySpecies={samplesBySpecies}
            removeSamples={removeSamples}
            isImmutable={isImmutable}
          />
          <ExperimentsView
            dataSet={dataSet}
            experiments={experiments}
            removeExperiment={removeExperiment}
            isImmutable={isImmutable}
          />
        </TabControl>
      </section>
    </div>
  );
}

const SpeciesSamples = ({
  samplesBySpecies,
  removeSamples,
  isImmutable = false
}) => {
  const species = samplesBySpecies;
  if (!species || !Object.keys(species).length) {
    return <p>No samples added to download dataset.</p>;
  }

  return (
    <div className="downloads__card">
      {Object.keys(species).map((speciesName, i) => (
        <div className="downloads__sample" key={i}>
          <div className="downloads__sample-info">
            <h2 className="downloads__species-title">
              {formatSentenceCase(speciesName)} Samples
            </h2>
            <div className="downloads__sample-stats">
              <p className="downloads__sample-stat">
                {species[speciesName].length}{' '}
                {species[speciesName].length > 1 ? 'Samples' : 'Sample'}
              </p>
            </div>

            <ModalManager
              component={showModal => (
                <Button
                  text="View Samples"
                  buttonStyle="secondary"
                  onClick={showModal}
                />
              )}
              modalProps={{ className: 'samples-modal' }}
            >
              {() => (
                <SamplesTable
                  isRowRemovable={true}
                  accessionCodes={species[speciesName].map(
                    x => x.accession_code
                  )}
                  experimentAccessionCodes={species[speciesName].map(
                    x => x.experimentAccessionCode
                  )}
                  isImmutable={isImmutable}
                />
              )}
            </ModalManager>
          </div>

          {removeSamples && (
            <Button
              text="Remove"
              buttonStyle="remove"
              onClick={() => removeSamples(species[speciesName])}
            />
          )}
        </div>
      ))}
    </div>
  );
};

class ExperimentsView extends React.Component {
  state = { organism: false };

  render() {
    const {
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
          {Object.keys(dataSet).map((id, i) => {
            const addedSamples = dataSet[id];
            const experiment = experiments[id];
            const metadataFields = getMetadataFields(experiment);

            if (
              this.state.organism &&
              !experiment.organisms.includes(this.state.organism)
            ) {
              return <React.Fragment />;
            }

            return (
              <div className="downloads__sample" key={i}>
                <div className="downloads__dataSet-info">
                  <h2 className="downloads__experiment-title">
                    {experiment.title}
                  </h2>
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
                      {addedSamples.length}
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
                        <i class="result__not-provided">
                          No sample metadata fields
                        </i>
                      )}
                    </h5>
                  </div>

                  {addedSamples.length > 0 && (
                    <ModalManager
                      component={showModal => (
                        <Button
                          text="View Samples"
                          buttonStyle="secondary"
                          onClick={showModal}
                        />
                      )}
                      modalProps={{ className: 'samples-modal' }}
                    >
                      {() => (
                        <SamplesTable
                          isRowRemovable={true}
                          accessionCodes={addedSamples}
                          experimentAccessionCodes={[experiment.accession_code]}
                          isImmutable={isImmutable}
                        />
                      )}
                    </ModalManager>
                  )}
                </div>
                {removeExperiment && (
                  <Button
                    text="Remove"
                    buttonStyle="remove"
                    onClick={() =>
                      removeExperiment([experiment.accession_code])
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
            checked={!this.state.organism}
            onClick={() => this.setState({ organism: false })}
          >
            All Species
          </Radio>
        </div>
        {uniqueOrganisms.map(organism => (
          <div className="downloads__species-filter-item">
            <Radio
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

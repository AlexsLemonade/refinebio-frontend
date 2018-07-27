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
import { formatSentenceCase } from '../../common/helpers';

export default function DownloadDetails({
  dataSet,
  filesData,
  experiments,
  removeSpecies,
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
        </div>

        <TabControl tabs={['Species View', 'Experiments View']}>
          <div className="downloads__card">
            <SpeciesSamples
              samplesBySpecies={samplesBySpecies}
              removeSpecies={removeSpecies}
              isImmutable={isImmutable}
            />
          </div>
          <div className="downloads__card">
            <ExperimentsView
              dataSet={dataSet}
              experiments={experiments}
              removeExperiment={removeExperiment}
              isImmutable={isImmutable}
            />
          </div>
        </TabControl>
      </section>
    </div>
  );
}

const SpeciesSamples = ({
  samplesBySpecies,
  removeSpecies,
  isImmutable = false
}) => {
  const species = samplesBySpecies;
  if (!species || !Object.keys(species).length) {
    return <p>No samples added to download dataset.</p>;
  }

  return Object.keys(species).map((speciesName, i) => (
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
              accessionCodes={species[speciesName].map(x => x.accession_code)}
              experimentAccessionCodes={species[speciesName].map(
                x => x.experimentAccessionCode
              )}
              isImmutable={isImmutable}
            />
          )}
        </ModalManager>
      </div>

      {removeSpecies && (
        <Button
          text="Remove"
          buttonStyle="remove"
          onClick={() => removeSpecies(species[speciesName])}
        />
      )}
    </div>
  ));
};

const ExperimentsView = ({
  dataSet,
  experiments,
  removeExperiment,
  isImmutable = false
}) => {
  if (!dataSet || !Object.keys(dataSet).length) {
    return <p>No samples added to download dataset.</p>;
  }

  return Object.keys(dataSet).map((id, i) => {
    const addedSamples = dataSet[id];
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
                .join(',')}
            </div>
          </div>
          <h4>Sample Metadata Fields</h4>
          <h5>{experiment.metadata ? experiment.metadata.join(', ') : null}</h5>

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
            onClick={() => removeExperiment([experiment.accession_code])}
          />
        )}
      </div>
    );
  });
};

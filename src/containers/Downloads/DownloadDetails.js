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
  samplesBySpecies,
  experimentCountBySpecies,
  totalSamples,
  totalExperiments
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
        <h2>Samples</h2>

        <TabControl tabs={['Species View', 'Experiments View']}>
          <div className="downloads__card">
            <SpeciesSamples
              samplesBySpecies={samplesBySpecies}
              removeSpecies={removeSpecies}
            />
          </div>
          <div className="downloads__card">
            <ExperimentsView
              dataSet={dataSet}
              experiments={experiments}
              removeExperiment={removeExperiment}
            />
          </div>
        </TabControl>
      </section>
    </div>
  );
}

const SpeciesSamples = ({ samplesBySpecies, removeSpecies }) => {
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
              accessionCodes={species[speciesName].map(x => x.accession_code)}
              experimentAccessionCodes={species[speciesName].map(
                x => x.experimentAccessionCode
              )}
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

const ExperimentsView = ({ dataSet, experiments, removeExperiment }) => {
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
              {experiment.id}
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
                  accessionCodes={addedSamples}
                  experimentAccessionCodes={[experiment.accession_code]}
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

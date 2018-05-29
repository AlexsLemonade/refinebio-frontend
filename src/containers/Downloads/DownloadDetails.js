import React from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Toggle from '../../components/Toggle';
import AccessionIcon from '../../common/icons/accession.svg';
import SampleIcon from '../../common/icons/sample.svg';
import OrganismIcon from '../../common/icons/organism.svg';
import TabControl from '../../components/TabControl';

import DownloadBar from './DownloadBar';
import DownloadFileSummary from './DownloadFileSummary';
import DownloadDatasetSummary from './DownloadDatasetSummary';

export default function DownloadDetails({
  dataSet,
  filesData,
  species,
  experiments,
  removeSpecies,
  removeExperiment
}) {
  return (
    <div>
      {filesData && <DownloadFileSummary summaryData={filesData} />}
      <DownloadDatasetSummary data={dataSet} />

      <section className="downloads__section">
        <h2>Samples</h2>

        <TabControl tabs={['Species View', 'Experiments View']}>
          <div className="downloads__card">
            <SpeciesSamples species={species} removeSpecies={removeSpecies} />
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

const SpeciesSamples = ({ species, removeSpecies }) => {
  if (!species || !Object.keys(species).length) {
    return <p>No samples added to download dataset.</p>;
  }

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
              {experiment.species}
            </div>
          </div>
          <h4>Sample Metadata Fields</h4>
          <h5>{experiment.metadata ? experiment.metadata.join(', ') : null}</h5>
          <Button text="View Samples" buttonStyle="secondary" />
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

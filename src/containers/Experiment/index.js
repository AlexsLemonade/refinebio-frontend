import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../../components/Loader';
import { fetchExperiment } from '../../state/experiment/actions';
import Button from '../../components/Button';

import './Experiment.scss';

import AccessionIcon from '../../common/icons/accession.svg';
import SampleIcon from '../../common/icons/sample.svg';
import OrganismIcon from '../../common/icons/organism.svg';
import MicroarrayIcon from '../../common/icons/microarray-badge.svg';

import Anchor from '../../components/Anchor';
import SamplesTable from './SamplesTable';
import {
  addExperiment,
  removeExperiment,
  removeSamplesFromExperiment
} from '../../state/download/actions';
import { RemoveFromDatasetButton } from '../Results/Result';

let Experiment = ({
  fetch,
  experiment,
  addExperiment,
  removeExperiment,
  removeSamplesFromExperiment,
  addSamplesToDataset,
  dataSet
}) => (
  <Loader fetch={fetch}>
    {({ isLoading }) =>
      isLoading ? (
        <div className="loader" />
      ) : (
        <div>
          <Button text="Back to Results" buttonStyle="secondary" />

          <div className="experiment">
            <div className="experiment__accession">
              <img
                src={AccessionIcon}
                className="experiment__stats-icon"
                alt="Accession Icon"
              />
              {experiment.accession_code}
            </div>

            <div className="experiment__header">
              <h3 className="experiment__header-title">
                {experiment.title || 'No Title.'}
              </h3>
              <div>
                {!dataSet[experiment.accession_code] ? (
                  <Button
                    text="Add to Dataset"
                    onClick={() => addExperiment([experiment])}
                  />
                ) : (
                  <RemoveFromDatasetButton
                    handleRemove={() =>
                      removeExperiment([experiment.accession_code])
                    }
                    samplesInDataset={
                      dataSet[experiment.accession_code].length !==
                      experiment.samples.length
                        ? dataSet[experiment.accession_code].length
                        : null
                    }
                  />
                )}
              </div>
            </div>

            <div className="experiment__stats">
              <div className="experiment__stats-item">
                <img
                  src={OrganismIcon}
                  className="experiment__stats-icon"
                  alt="Organism Icon"
                />{' '}
                {experiment.species}
              </div>
              <div className="experiment__stats-item">
                <img
                  src={SampleIcon}
                  className="experiment__stats-icon"
                  alt="Sample Icon"
                />{' '}
                {experiment.samples.length} Samples
              </div>
              <div className="experiment__stats-item">
                <img
                  src={MicroarrayIcon}
                  className="experiment__stats-icon"
                  alt="MicroArray Badge Icon"
                />{' '}
                {experiment.id}
              </div>
            </div>

            <h4 className="experiment__title">
              Submitter Supplied Information
            </h4>

            <div>
              <div className="experiment__row">
                <div className="experiment__row-label">Description</div>
                <div>{experiment.description}</div>
              </div>
              <div className="experiment__row">
                <div className="experiment__row-label">PubMed ID</div>
                <div>{experiment.pubmed_id}</div>
              </div>
              <div className="experiment__row">
                <div className="experiment__row-label">Publication Title</div>
                <div>{experiment.publication_title}</div>
              </div>
              <div className="experiment__row">
                <div className="experiment__row-label">
                  Submitter’s Institution
                </div>
                <div>{experiment.submitter_institution}</div>
              </div>
              <div className="experiment__row">
                <div className="experiment__row-label">Submitter</div>
                <div>{experiment.pubmed_id}</div>
              </div>
            </div>

            <Anchor name="samples">
              {() => (
                <section className="experiment__section">
                  <h2 className="experiment__title">Samples</h2>
                  <SamplesTable
                    samples={experiment.samples}
                    dataSet={dataSet}
                    // Render prop for the button that adds the samples to the dataset
                    pageActionComponent={samplesDisplayed =>
                      samplesNotInDataSet(
                        samplesDisplayed,
                        experiment.accession_code,
                        dataSet
                      ).length === 0 ? (
                        <RemoveFromDatasetButton
                          handleRemove={() =>
                            removeSamplesFromExperiment(
                              experiment.accession_code,
                              samplesDisplayed.map(x => x.id)
                            )
                          }
                        />
                      ) : (
                        <Button
                          text="Add Page to Dataset"
                          buttonStyle="secondary"
                          onClick={() =>
                            addExperiment([
                              {
                                accession_code: experiment.accession_code,
                                samples: samplesDisplayed
                              }
                            ])
                          }
                        />
                      )
                    }
                  />
                </section>
              )}
            </Anchor>
          </div>
        </div>
      )
    }
  </Loader>
);
Experiment = connect(
  ({ experiment, download: { dataSet } }) => ({ experiment, dataSet }),
  (dispatch, ownProps) =>
    bindActionCreators(
      {
        fetch: () => fetchExperiment(ownProps.match.params.id),
        addExperiment,
        removeExperiment,
        removeSamplesFromExperiment,
        addSamplesToDataset: samples => {
          console.log('TODO: add page to dataset', samples);
        }
      },
      dispatch
    )
)(Experiment);

export default Experiment;

function samplesNotInDataSet(samples, accessionCode, dataSet) {
  return samples.filter(x => {
    if (!dataSet[accessionCode]) return true;
    return dataSet[accessionCode].indexOf(x.id) === -1;
  });
}

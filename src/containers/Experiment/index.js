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

import SamplesTable from './SamplesTable';

let Experiment = ({
  fetch,
  experiment,
  addExperimentToDataset,
  addSamplesToDataset
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
                <Button
                  text="Add to Dataset"
                  onClick={addExperimentToDataset}
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

            <section className="experiment__section">
              <h2 className="experiment__title">Samples</h2>

              <SamplesTable
                samples={experiment.samples}
                addSamplesToDataset={addSamplesToDataset}
              />
            </section>
          </div>
        </div>
      )
    }
  </Loader>
);
Experiment = connect(
  ({ experiment }) => ({ experiment }),
  (dispatch, ownProps) =>
    bindActionCreators(
      {
        fetch: () => fetchExperiment(ownProps.match.params.id),
        addExperimentToDataset: () => {
          let experimentId = ownProps.match.params.id;
          // TODO: Add the current experiment to the Dataset
          console.log('Add experiment to dataset: ', experimentId);
        },
        addSamplesToDataset: samples => {
          console.log('TODO: add page to dataset', samples);
        }
      },
      dispatch
    )
)(Experiment);

export default Experiment;

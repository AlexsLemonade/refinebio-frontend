import React from 'react';
import { connect } from 'react-redux';
import Loader from '../../components/Loader';
import { fetchExperiment } from '../../state/experiment/actions';
import Button from '../../components/Button';

import './Experiment.scss';

import AccessionIcon from '../../common/icons/accession.svg';
import SampleIcon from '../../common/icons/sample.svg';
import OrganismIcon from '../../common/icons/organism.svg';
import MicroarrayIcon from '../../common/icons/microarray-badge.svg';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

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
              <h3>{experiment.title || 'No Title.'}</h3>
              <Button text="Add to Dataset" onClick={addExperimentToDataset} />
            </div>

            <div className="experiment__stats">
              <div>
                <img
                  src={AccessionIcon}
                  className="experiment__stats-icon"
                  alt="Accession Icon"
                />{' '}
                {experiment.id}
              </div>
              <div>
                <img
                  src={SampleIcon}
                  className="experiment__stats-icon"
                  alt="Sample Icon"
                />{' '}
                {experiment.samples.length} Samples
              </div>
              <div>
                <img
                  src={OrganismIcon}
                  className="experiment__stats-icon"
                  alt="Organism Icon"
                />{' '}
                {experiment.species}
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

            <hr className="experiment__divider" />

            <h2 className="experiment__title">Samples</h2>

            <ReactTable
              data={experiment.samples}
              columns={[
                {
                  Header: 'Sample ID',
                  accessor: 'id'
                },
                {
                  Header: 'Title',
                  accessor: 'title'
                },
                {
                  Header: 'Age'
                },
                {
                  Header: 'Gender'
                },
                {
                  Header: 'Processing Information'
                }
              ]}
            >
              {(state, makeTable, instance) => {
                return (
                  <React.Fragment>
                    <div className="experiment__sample-commands">
                      <Button
                        text="Add Page to Dataset"
                        buttonStyle="secondary"
                        onClick={() =>
                          addSamplesToDataset(state.pageRows.map(x => x.id))
                        }
                      />
                    </div>

                    {makeTable()}
                  </React.Fragment>
                );
              }}
            </ReactTable>
          </div>
        </div>
      )
    }
  </Loader>
);
Experiment = connect(
  ({ experiment }) => ({ experiment }),
  (dispatch, ownProps) => ({
    fetch: () => dispatch(fetchExperiment(ownProps.match.params.id)),
    addExperimentToDataset: () => {
      let experimentId = ownProps.match.params.id;
      // TODO: Add the current experiment to the Dataset
      console.log('Add experiment to dataset: ', experimentId);
    },
    addSamplesToDataset: samples => {
      console.log('TODO: add page to dataset', samples);
    }
  })
)(Experiment);

export default Experiment;

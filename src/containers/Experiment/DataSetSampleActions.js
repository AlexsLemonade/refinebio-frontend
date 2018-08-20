import React from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import {
  addExperiment,
  removeSamples
} from '../../state/download/actions';

/**
 * Given a dataset and a set of samples, this component renders the correct buttons
 * to add/remove the samples from the dataset.
 * <DataSetSampleActions samples={samplesDisplayed} experiment={...} />
 */
let DataSetSampleActions = ({
  samples,
  experiment,
  removeSamples,
  addExperiment,
  stats,
  meta,
  // in some cases we don't want to show the AddRemaining state, like for example adding
  // the current samples in a table
  enableAddRemaining = true,
}) => {
  if (!stats.anyProcessedSamples()) {
    // if there're no processed samples to be added, then just show the add button disabled
    return <Button
      text={meta.addText}
      isDisabled={true}
      buttonStyle={meta.buttonStyle}
    />
  } else if (stats.allProcessedInDataSet()) {
    return <RemoveFromDatasetButton
      handleRemove={() =>
        removeSamples(stats.getSamplesInDataSet())
      }
    />;
  } else if (enableAddRemaining && stats.getSamplesInDataSet().length > 0) {
    return <AddRemainingSamples 
      totalSamplesInDataset={stats.getSamplesInDataSet().length} 
      handleAdd={() => addExperiment([{
        accession_code: experiment.accession_code,
        samples
      }])} />
  }
  
  // if there're processed samples that aren't part of the current dataset, show the button to add samples
  return <AddToDatasetButton
    addMessage={meta.addText}
    handleAdd={() => addExperiment([{
      accession_code: experiment.accession_code,
      samples
    }])}
    buttonStyle={meta.buttonStyle}
  />;
}
DataSetSampleActions = connect(
  ({ download: { dataSet } }, { samples, meta = {} }) => ({
    stats: new DataSetStats(dataSet, samples),
    meta: {
      addText: 'Add to Dataset', 
      buttonStyle: null,
      // allow extending default properties with meta
      ...meta,
    }
  }),
  {
    addExperiment,
    removeSamples
  }
)(DataSetSampleActions);
export default DataSetSampleActions;


/**
 * Contains helper methods to calculate stats between a dataset and a list of samples
 * eg, how many processed samples are already in the dataset
 */
export class DataSetStats {
  constructor(dataSet, samples) {
    this.dataSet = dataSet;
    this.samples = samples;
  }

  anyProcessedSamples() {
    return this.samples.some(x => x.is_processed);
  }

  anyUnprocessedSample() {
    return this.samples.some(x => !x.is_processed);
  }

  allProcessedInDataSet() {
    return this.getProcessedSamples().every(x => this.sampleInDataSet(x));
  }

  /**
   * Returns true if a given sample is in the dataset
   * @param {any} sample Sample object, with key `accession_code`
   */
  sampleInDataSet(sample) {
    for (let experimentId in this.dataSet) {
      // check if the passed sample is part of the experiment
      if (this.dataSet[experimentId].some(sampleAccessionCode => sampleAccessionCode === sample.accession_code)) {
        return true;
      }
    }
    return false;
  }

  getProcessedSamples() {
    return this.samples.filter(x => x.is_processed);
  }

  getSamplesInDataSet() {
    return this.samples.filter(x => x.is_processed && this.sampleInDataSet(x));
  }
}

export function RemoveFromDatasetButton({
  handleRemove,
  totalAdded,
  samplesInDataset
}) {
  return (
    <div className="dataset-remove-button">
      <div className="dataset-remove-button__added-container">
        <span className="dataset-remove-button__added">
          <i className="ion-checkmark-circled dataset-remove-button__added-icon" />
          {totalAdded && `${totalAdded} Samples`} Added to Dataset
        </span>
        <Button buttonStyle="plain" text="Remove" onClick={handleRemove} />
      </div>
      {samplesInDataset && (
        <p className="dataset-remove-button__info-text">
          <i className="ion-information-circled dataset-remove-button__info-icon" />{' '}
          {samplesInDataset} Samples are already in Dataset
        </p>
      )}
    </div>
  );
}

export function AddToDatasetButton({
  handleAdd,
  addMessage = 'Add to Dataset',
  buttonStyle = null
}) {
  return (
    <div className="dataset-add-button">
      <Button
        text={addMessage}
        buttonStyle={buttonStyle}
        onClick={handleAdd}
      />
    </div>
  );
}

function AddRemainingSamples({handleAdd, totalSamplesInDataset}) {
  return (
    <div className="dataset-add-button">
      <Button
        text={'Add Remaining'}
        buttonStyle="secondary"
        onClick={handleAdd}
      />
      <p className="dataset-add-button__info-text">
        <i className="ion-information-circled dataset-add-button__info-icon" />{' '}
        {totalSamplesInDataset} Samples are already in Dataset
      </p>
    </div>
  );
}


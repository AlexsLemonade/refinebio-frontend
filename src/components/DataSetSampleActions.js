import React from 'react';
import { connect } from 'react-redux';
import Button from './Button';
import { addSamples, removeSamples } from '../state/download/actions';
import DataSetStats from '../common/DataSetStats';
import { IoIosCheckmarkCircle, IoIosInformationCircle } from 'react-icons/io';

/**
 * Given a dataset and a set of samples, this component renders the correct buttons
 * to add/remove the samples from the dataset.
 *
 * <DataSetSampleActions dataSetSlice={{
 *    [EXPERIMENT_ACCESSION_CODE]: [SAMPLES ...]
 *    ...
 * }} />
 *
 * `data` can be viewed as a slice of a dataSet.
 *
 * Note: When using this component you must ensure that all the sample accession codes in `dataSetSlice`
 * are from samples that have been processed.
 */
class DataSetSampleActions extends React.Component {
  render() {
    const {
      dataSetSlice,
      dataSet,
      removeSamples,
      addSamples,
      meta,
      // in some cases we don't want to show the AddRemaining state, like for example adding
      // the current samples in a table
      enableAddRemaining = true
    } = this.props;

    const stats = new DataSetStats(dataSet, dataSetSlice);

    if (!stats.anyProcessedSamples()) {
      // if there're no processed samples to be added, then just show the add button disabled
      return (
        <Button
          text={meta.addText}
          isDisabled={true}
          buttonStyle={meta.buttonStyle}
        />
      );
    } else if (stats.allProcessedInDataSet()) {
      return (
        <RemoveFromDatasetButton
          onRemove={() => removeSamples(stats.getAddedSlice())}
        />
      );
    } else if (enableAddRemaining && stats.totalSamplesInDataSet() > 0) {
      return (
        <AddRemainingSamples
          totalSamplesInDataset={stats.totalSamplesInDataSet()}
          onAdd={() => addSamples(dataSetSlice)}
        />
      );
    }

    // if there're processed samples that aren't part of the current dataset, show the button to add samples
    return (
      <AddToDatasetButton
        addMessage={meta.addText}
        onAdd={() => addSamples(dataSetSlice)}
        buttonStyle={meta.buttonStyle}
      />
    );
  }
}
DataSetSampleActions = connect(
  ({ download: { dataSet } }, { meta = {} }) => ({
    dataSet,
    meta: {
      addText: 'Add to Dataset',
      buttonStyle: null,
      // allow extending default properties with meta
      ...meta
    }
  }),
  {
    addSamples,
    removeSamples
  }
)(DataSetSampleActions);
export default DataSetSampleActions;

export function RemoveFromDatasetButton({
  onRemove,
  totalAdded,
  samplesInDataset
}) {
  return (
    <div className="dataset-remove-button">
      <div className="dataset-remove-button__added-container">
        <span className="dataset-remove-button__added">
          <IoIosCheckmarkCircle className="dataset-remove-button__added-icon" />
          {totalAdded && `${totalAdded} Samples`} Added to Dataset
        </span>
        <Button buttonStyle="plain" text="Remove" onClick={onRemove} />
      </div>
      {samplesInDataset && (
        <p className="dataset-remove-button__info-text">
          <IoIosInformationCircle className="dataset-remove-button__info-icon" />{' '}
          {samplesInDataset} Samples are already in Dataset
        </p>
      )}
    </div>
  );
}

export function AddToDatasetButton({
  onAdd,
  addMessage = 'Add to Dataset',
  buttonStyle = null
}) {
  return (
    <div className="dataset-add-button">
      <Button text={addMessage} buttonStyle={buttonStyle} onClick={onAdd} />
    </div>
  );
}

function AddRemainingSamples({ onAdd, totalSamplesInDataset }) {
  return (
    <div className="dataset-add-button">
      <Button text={'Add Remaining'} buttonStyle="secondary" onClick={onAdd} />
      <p className="dataset-add-button__info-text">
        <IoIosInformationCircle className="dataset-remove-button__info-icon" />{' '}
        {totalSamplesInDataset} Samples are already in Dataset
      </p>
    </div>
  );
}

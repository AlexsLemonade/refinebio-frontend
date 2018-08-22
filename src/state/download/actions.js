import { Ajax } from '../../common/helpers';
import {
  getDataSet,
  getDataSetDetails,
  updateDataSet,
  formatSamples,
  formatExperiments
} from '../../api/dataSet';
import reportError from '../reportError';
import DataSetManager from './DataSetManager';

/**
 * Saves an updated copy of the given dataset in the store
 */
export const downloadUpdateDataSet = dataSet => {
  return {
    type: 'DOWNLOAD_UPDATE_DATASET',
    data: {
      dataSet
    }
  };
};

/**
 * Removes all experiments with the corresponding accession codes from dataset
 * @param {array} accessionCodes
 */
export const removeExperiment = accessionCodes => async (
  dispatch,
  getState
) => {
  const { dataSet, dataSetId } = getState().download;
  const newDataSet = new DataSetManager(dataSet).removeExperiment(
    accessionCodes
  );
  try {
    const response = await updateDataSet(dataSetId, newDataSet);
    dispatch(downloadUpdateDataSet(response.data));
  } catch (error) {
    dispatch(reportError(error));
  }
};

/**
 * Removes all samples with corresponding ids from each experiment in dataset.
 * @param {array} samples
 */
export const removeSamples = samples => async (dispatch, getState) => {
  const { dataSet, dataSetId } = getState().download;
  const newDataSet = new DataSetManager(dataSet).removeSamples(samples);
  try {
    const response = await updateDataSet(dataSetId, newDataSet);
    dispatch(downloadUpdateDataSet(response.data));
  } catch (error) {
    dispatch(reportError(error));
  }
};

/**
 * Updates a DataSet with the given data in the backend. A new one is created if it doesn't exist.
 */
export const createOrUpdateDataSet = ({
  data,
  dataSetId = null
}) => async dispatch => {
  let response = !dataSetId
    ? await Ajax.post('/dataset/create/', {
        data
      })
    : await updateDataSet(dataSetId, data);

  return {
    dataSetId: response.id,
    data: response.data
  };
};

/**
 * Takes an array of experiment objects and adds to users dataset via endpoint
 * @param {array} experiments
 */
export const addExperiment = experiments => async (dispatch, getState) => {
  dispatch({
    type: 'DOWNLOAD_ADD_EXPERIMENT',
    data: {
      experiments
    }
  });

  const { dataSet, dataSetId } = getState().download;
  const data = new DataSetManager(dataSet).addExperiment(experiments);

  try {
    const {
      dataSetId: updatedDataSetId,
      data: updatedDataSet
    } = await dispatch(createOrUpdateDataSet({ dataSetId, data }));
    localStorage.setItem('dataSetId', updatedDataSetId);
    dispatch(addExperimentSucceeded(updatedDataSetId, updatedDataSet));
  } catch (err) {
    dispatch(reportError(err));
  }
};

export const addExperimentSucceeded = (dataSetId, dataSet) => {
  return {
    type: 'DOWNLOAD_ADD_EXPERIMENT_SUCCESS',
    data: {
      dataSet,
      dataSetId
    }
  };
};

/**
 * If a dataSetId exists in localStorage,
 * use it to fetch dataset from endpoint
 */
export const fetchDataSet = () => async dispatch => {
  const dataSetId = localStorage.getItem('dataSetId');

  if (!dataSetId) {
    return;
  }

  dispatch({
    type: 'DOWNLOAD_DATASET_FETCH',
    data: {
      dataSetId
    }
  });

  try {
    const {
      data,
      is_processing,
      is_processed,
      aggregate_by,
      scale_by,
      expires_on
    } = await getDataSet(dataSetId);

    dispatch(
      fetchDataSetSucceeded({
        dataSet: data,
        is_processing,
        is_processed,
        aggregate_by,
        scale_by,
        expires_on
      })
    );
  } catch (e) {
    // Check if there was any error fetching the dataset, in which case restart it's status
    await dispatch(clearDataSet());
    // Also report the error
    await dispatch(reportError(e));
  }
};

export const fetchDataSetSucceeded = ({
  dataSet,
  is_processing,
  is_processed,
  aggregate_by,
  scale_by,
  expires_on
}) => ({
  type: 'DOWNLOAD_DATASET_FETCH_SUCCESS',
  data: {
    dataSet,
    is_processing,
    is_processed,
    aggregate_by,
    scale_by,
    expires_on
  }
});

export const fetchDataSetDetails = () => async dispatch => {
  const dataSetId = localStorage.getItem('dataSetId');
  if (!dataSetId) {
    return;
  }

  dispatch({
    type: 'DOWNLOAD_FETCH_DETAILS',
    data: {
      dataSetId
    }
  });
  let {
    data,
    is_processing,
    is_processed,
    aggregate_by,
    scale_by,
    samples,
    experiments
  } = await getDataSetDetails(dataSetId);

  samples = formatSamples(data, samples);
  experiments = formatExperiments(experiments);

  dispatch(
    fetchDataSetDetailsSucceeded({
      dataSet: data,
      is_processing,
      is_processed,
      aggregate_by,
      scale_by,
      samples,
      experiments
    })
  );
};

export const fetchDataSetDetailsSucceeded = ({
  dataSet,
  is_processing,
  is_processed,
  aggregate_by,
  scale_by,
  samples,
  experiments
}) => ({
  type: 'DOWNLOAD_FETCH_DETAILS_SUCCESS',
  data: {
    dataSet,
    is_processing,
    is_processed,
    aggregate_by,
    scale_by,
    samples,
    experiments
  }
});

export const startDownload = tokenId => async (dispatch, getState) => {
  const { dataSetId, dataSet } = getState().download;
  try {
    await Ajax.put(`/dataset/${dataSetId}/`, {
      start: true,
      data: dataSet,
      token_id: tokenId
    });
  } catch (e) {
    await dispatch(reportError(e));
    return;
  }

  await dispatch(clearDataSet());
};

// Remove all dataset
export const clearDataSet = () => async dispatch => {
  localStorage.removeItem('dataSetId');

  dispatch({
    type: 'DOWNLOAD_CLEAR'
  });
};

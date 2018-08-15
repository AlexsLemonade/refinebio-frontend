import { Ajax } from '../../common/helpers';
import {
  getDataSet,
  getSamplesAndExperiments,
  updateDataSet
} from '../../api/dataSet';
import reportError from '../reportError';
import DataSetManager from './DataSetManager';


/**
 * Removes all experiments with the corresponding accession codes from dataset
 * @param {array} accessionCodes
 */
export const removeExperiment = accessionCodes => async (dispatch, getState) => {
  const { dataSet, dataSetId } = getState().download;
  const newDataSet = (new DataSetManager(dataSet)).removeExperiment(accessionCodes);
  try {
    const response = await updateDataSet(dataSetId, newDataSet);
    dispatch(removeExperimentSucceeded(response.data));
  } catch (error) {
    dispatch(reportError(error));
  }
};

export const removeExperimentSucceeded = dataSet => {
  return {
    type: 'DOWNLOAD_REMOVE_EXPERIMENT_SUCCESS',
    data: {
      dataSet
    }
  };
};

/**
 * Removes all samples with corresponding ids from each experiment in dataset.
 * @param {array} samples
 */
export const removeSamples = samples => async (dispatch, getState) => {
  const { dataSet, dataSetId } = getState().download;
  const newDataSet = (new DataSetManager(dataSet)).removeSamples(samples);
  try {
    const response = await updateDataSet(dataSetId, newDataSet);
    dispatch(removeSpeciesSucceeded(response.data));
  } catch (error) {
    console.log(error);
  }
};

export const removeSpeciesSucceeded = dataSet => {
  return {
    type: 'DOWNLOAD_REMOVE_SPECIES_SUCCESS',
    data: {
      dataSet
    }
  };
};

/**
 * Updates a DataSet with the given data in the backend. A new one is created if it doesn't exist.
 */
export const createOrUpdateDataSet = ({data, dataSetId = null}) => async (dispatch) => {
  let response = !dataSetId
    ? await Ajax.post('/dataset/create/', {
      data
    })
    : await updateDataSet(dataSetId, data);

  return {
    dataSetId: response.id, 
    data: response.data
  };
}

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
  const data = (new DataSetManager(dataSet)).addExperiment(experiments);

  try {
    const {dataSetId: updatedDataSetId, data: updatedDataSet} = await dispatch(createOrUpdateDataSet({dataSetId, data}));
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
      scale_by
    } = await getDataSet(dataSetId);

    dispatch(
      fetchDataSetSucceeded(
        data,
        is_processing,
        is_processed,
        aggregate_by,
        scale_by
      )
    );
  } catch (e) {
    // Check if there was any error fetching the dataset, in which case restart it's status
    await dispatch(clearDataSet());
    // Also report the error
    await dispatch(reportError(e));
  }
};

export const fetchDataSetSucceeded = (
  dataSet,
  is_processing,
  is_processed,
  aggregate_by,
  scale_by
) => ({
  type: 'DOWNLOAD_DATASET_FETCH_SUCCESS',
  data: {
    dataSet,
    is_processing,
    is_processed,
    aggregate_by,
    scale_by
  }
});

export const fetchDataSetDetails = dataSet => {
  return async dispatch => {
    dispatch({
      type: 'DOWNLOAD_FETCH_DETAILS'
    });
    const { experiments, samples } = await getSamplesAndExperiments(dataSet);
    dispatch(fetchDataSetDetailsSucceeded(experiments, samples));
  };
};

export const fetchDataSetDetailsSucceeded = (experiments, samples) => {
  return {
    type: 'DOWNLOAD_FETCH_DETAILS_SUCCESS',
    data: {
      experiments,
      samples
    }
  };
};

export const startDownload = tokenId => async (dispatch, getState) => {
  const { dataSetId, dataSet } = getState().download;
  await Ajax.put(`/dataset/${dataSetId}/`, {
    start: true,
    data: dataSet,
    token_id: tokenId
  });
};

// Remove all dataset
export const clearDataSet = () => async dispatch => {
  dispatch({
    type: 'DOWNLOAD_CLEAR',
    data: {}
  });

  localStorage.removeItem('dataSetId');
  const dataSet = {};
  dispatch(clearDataSetSucceeded(dataSet));
};

export const clearDataSetSucceeded = dataSet => ({
  type: 'DOWNLOAD_CLEAR_SUCCESS',
  data: { dataSet }
});

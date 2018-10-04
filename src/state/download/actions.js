import { Ajax } from '../../common/helpers';
import {
  getDataSet,
  getDataSetDetails,
  updateDataSet
} from '../../api/dataSet';
import reportError from '../reportError';
import DataSetManager from './DataSetManager';
import { getDataSetId } from './reducer';
import { replace } from '../routerActions';
import { createToken } from '../token';

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
  const { dataSet, dataSetId } = getState().download;
  const data = new DataSetManager(dataSet).addExperiment(experiments);

  try {
    const {
      dataSetId: updatedDataSetId,
      data: updatedDataSet
    } = await dispatch(createOrUpdateDataSet({ dataSetId, data }));
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
export const fetchDataSet = () => async (dispatch, getState) => {
  const dataSetId = getDataSetId(getState());

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

    if (is_processing || is_processed) {
      // if for any reason the user ends up in a state where the current dataset is already processed
      // we should clear it, since this dataset is immutable
      return await dispatch(clearDataSet());
    }

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

export const editAggregation = ({ dataSetId, aggregation }) => async (
  dispatch,
  getState
) => {
  const dataSet = getState().download.dataSet;
  const {
    data,
    is_processing,
    is_processed,
    aggregate_by,
    scale_by
  } = await Ajax.put(`/dataset/${dataSetId}/`, {
    data: dataSet,
    aggregate_by: aggregation.toUpperCase()
  });

  dispatch(
    fetchDataSetSucceeded({
      dataSet: data,
      is_processing,
      is_processed,
      aggregate_by,
      scale_by
    })
  );
};

export const editTransformation = ({ dataSetId, transformation }) => async (
  dispatch,
  getState
) => {
  const dataSet = getState().download.dataSet;
  const {
    data,
    is_processing,
    is_processed,
    aggregate_by,
    scale_by
  } = await Ajax.put(`/dataset/${dataSetId}/`, {
    data: dataSet,
    scale_by: transformation.toUpperCase()
  });

  dispatch(
    fetchDataSetSucceeded({
      dataSet: data,
      is_processing,
      is_processed,
      aggregate_by,
      scale_by
    })
  );
};

/**
 * Gets detailed information about the samples and experiments associated with
 * the current dataset. This information is needed to be able to group the samples
 * by species.
 */
export const fetchDataSetDetails = dataSetId => async (dispatch, getState) => {
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

export const startDownload = ({
  dataSetId,
  dataSet,
  email,
  receiveUpdates = false
}) => async (dispatch, getState) => {
  let tokenId = getState().token;
  if (!tokenId) {
    await dispatch(createToken());
    tokenId = getState().token;
  }

  try {
    await Ajax.put(`/dataset/${dataSetId}/`, {
      start: true,
      data: dataSet,
      token_id: tokenId,
      ...(receiveUpdates ? { email_ccdl_ok: true } : {}),
      ...(email ? { email_address: email } : {})
    });
  } catch (e) {
    await dispatch(reportError(e));

    // if there's an error, redirect to the dataset page, and show a message
    // also with a button to try again
    return await dispatch(
      replace({
        pathname: `/dataset/${dataSetId}`,
        state: { hasError: true }
      })
    );
  }

  let currentDataSet = getState().download.dataSetId;
  if (currentDataSet === dataSetId) {
    // clear the current dataset if a download is started for it.
    await dispatch(clearDataSet());
  }

  // redirect to the dataset page, and send the email address in the state
  return await dispatch(
    replace({
      pathname: `/dataset/${dataSetId}`,
      state: { email_address: email }
    })
  );
};

// Remove all dataset
export const clearDataSet = () => ({
  type: 'DOWNLOAD_CLEAR'
});

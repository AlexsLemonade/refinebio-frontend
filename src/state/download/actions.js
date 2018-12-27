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

// Remove all dataset
export const clearDataSet = () => ({
  type: 'DOWNLOAD_CLEAR'
});

export const updateDownloadDataSet = data => ({
  type: 'DOWNLOAD_DATASET_UPDATE',
  data
});

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
 * Applies an operation that modifies the current dataset. All other action creators
 * use this method to add/remove samples from the dataset.
 */
const dataSetUpdateOperation = modifier => async (dispatch, getState) => {
  // Update the current dataset with whatever is on the server, otherwise it might get out of sync
  // if the user edited it in a different tab.
  try {
    await dispatch(fetchDataSet());
  } catch (e) {
    dispatch(reportError(e));
    throw e;
  }

  const { dataSet, dataSetId } = getState().download;
  // apply modifier function to the dataset
  const data = modifier(dataSet, dataSetId);

  try {
    const {
      dataSetId: updatedDataSetId,
      data: updatedDataSet
    } = await dispatch(createOrUpdateDataSet({ dataSetId, data }));

    dispatch(
      updateDownloadDataSet({
        dataSetId: updatedDataSetId,
        dataSet: updatedDataSet
      })
    );
  } catch (err) {
    dispatch(reportError(err));
  }
};

/**
 * Takes an array of experiment objects and adds to users dataset via endpoint
 * @param {object} dataSetSlice
 */
export const addSamples = dataSetSlice => async (dispatch, getState) =>
  dispatch(
    dataSetUpdateOperation(dataSet =>
      new DataSetManager(dataSet).add(dataSetSlice)
    )
  );

/**
 * Removes all experiments with the corresponding accession codes from dataset
 * @param {array} accessionCodes
 */
export const removeExperiment = accessionCodes => dispatch =>
  dispatch(
    dataSetUpdateOperation(dataSet =>
      new DataSetManager(dataSet).removeExperiment(accessionCodes)
    )
  );

/**
 * Removes all samples with corresponding ids from each experiment in dataset.
 * @param {object} dataSetSlice
 */
export const removeSamples = dataSetSlice => async (dispatch, getState) =>
  dispatch(
    dataSetUpdateOperation(dataSet =>
      new DataSetManager(dataSet).remove(dataSetSlice)
    )
  );

/**
 * Use the dataset from the state
 */
export const fetchDataSet = (details = false) => async (dispatch, getState) => {
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
    const data = details
      ? await getDataSetDetails(dataSetId)
      : await getDataSet(dataSetId);

    if (data.is_processing || data.is_processed) {
      // if for any reason the user ends up in a state where the current dataset is already processed
      // we should clear it, since this dataset is immutable
      return await dispatch(clearDataSet());
    }

    dispatch(
      updateDownloadDataSet({
        ...data,
        dataSet: data.data
      })
    );
  } catch (e) {
    // Check if there was any error fetching the dataset, in which case restart it's status
    await dispatch(clearDataSet());
    // Also report the error
    await dispatch(reportError(e));
  }
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

  let response = await getDataSetDetails(dataSetId);
  dispatch(
    updateDownloadDataSet({
      ...response,
      dataSet: response.data
    })
  );
};

/**
 * edit some parameter of the dataset
 * @param {*} params additional params to be sent to the API
 */
export const editDataSet = ({ dataSetId, ...params }) => async (
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
    ...params
  });

  dispatch(
    updateDownloadDataSet({
      dataSet: data,
      is_processing,
      is_processed,
      aggregate_by,
      scale_by
    })
  );
};

export const editAggregation = ({ dataSetId, aggregation }) =>
  editDataSet({ dataSetId, aggregate_by: aggregation.toUpperCase() });

export const editTransformation = ({ dataSetId, transformation }) =>
  editDataSet({ dataSetId, scale_by: transformation.toUpperCase() });

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

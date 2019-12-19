import { Ajax } from '../../common/helpers';
import {
  getDataSet,
  getDataSetDetails,
  updateDataSet,
  createDataSet,
} from '../../api/dataSet';
import reportError from '../reportError';
import DataSetManager from './DataSetManager';
import { getDataSetId } from './reducer';
import { push, replace } from '../routerActions';
import { createToken, clearToken } from '../token';
import { ServerError, InvalidTokenError } from '../../common/errors';

// Drop the current dataset from the storage, it will still remain in the db
export const dropDataSet = () => dispatch => {
  dispatch({
    type: 'DOWNLOAD_DROP',
    persist: {
      dataSetId: null,
    },
  });
};

export const updateDownloadDataSet = data => ({
  type: 'DOWNLOAD_DATASET_UPDATE',
  data,
  persist: {
    dataSetId: data.dataSetId,
  },
});

/**
 * Updates a DataSet with the given data in the backend. A new one is created if it doesn't exist.
 */
export const createOrUpdateDataSet = ({
  data,
  dataSetId = null,
  details = false,
}) => async () => {
  // first create the dataset, since adding experiments with special key `[ALL]`
  // only works with edit operations
  if (!dataSetId) {
    ({ id: dataSetId } = await createDataSet());
  }

  const { id, data: dataSet, ...dataSetDetails } = await updateDataSet(
    dataSetId,
    data,
    details
  );

  return {
    dataSetId: id,
    dataSet,
    ...dataSetDetails,
  };
};

/**
 * Applies an operation that modifies the current dataset. All other action creators
 * use this method to add/remove samples from the dataset.
 */
const dataSetUpdateOperation = (modifier, details = false) => async (
  dispatch,
  getState
) => {
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
      dataSet: updatedDataSet,
      ...dataSetDetails
    } = await dispatch(createOrUpdateDataSet({ dataSetId, data, details }));

    dispatch(
      updateDownloadDataSet({
        ...dataSetDetails,
        dataSetId: updatedDataSetId,
        dataSet: updatedDataSet,
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
export const addSamples = dataSetSlice => async dispatch =>
  dispatch(
    dataSetUpdateOperation(dataSet =>
      new DataSetManager(dataSet).add(dataSetSlice)
    )
  );

/**
 * Removes all experiments with the corresponding accession codes from dataset
 * @param {array} accessionCodes
 */
export const removeExperiment = (accessionCodes, details = false) => dispatch =>
  dispatch(
    dataSetUpdateOperation(
      dataSet => new DataSetManager(dataSet).removeExperiment(accessionCodes),
      details
    )
  );

/**
 * Removes all samples with corresponding ids from each experiment in dataset.
 * @param {object} dataSetSlice
 */
export const removeSamples = (
  dataSetSlice,
  details = false
) => async dispatch =>
  dispatch(
    dataSetUpdateOperation(
      dataSet => new DataSetManager(dataSet).remove(dataSetSlice),
      details
    )
  );

/**
 * Replaces the the entire data of the current dataset
 * @param {*} newDataSet New dataset slice to be replaced
 */
export const replaceSamples = newDataSet => async dispatch =>
  dispatch(dataSetUpdateOperation(() => newDataSet));

/**
 * Use the dataset from the state
 */
export const fetchDataSet = (details = false) => async (dispatch, getState) => {
  const tokenId = getState().token;

  // try reading the dataset id from the local storage in case another tab created one.
  // bug https://github.com/AlexsLemonade/refinebio-frontend/issues/653
  const dataSetId =
    getDataSetId(getState()) || localStorage.getItem('dataSetId');

  if (!dataSetId) {
    return null;
  }

  dispatch({
    type: 'DOWNLOAD_DATASET_FETCH',
    data: {
      dataSetId,
    },
  });

  try {
    const data = details
      ? await getDataSetDetails(dataSetId, tokenId)
      : await getDataSet(dataSetId, tokenId);

    if (data.is_processing || data.is_processed) {
      // if for any reason the user ends up in a state where the current dataset is already processed
      // we should clear it, since this dataset is immutable
      return await dispatch(dropDataSet());
    }

    dispatch(
      updateDownloadDataSet({
        ...data,
        dataSetId: data.id,
        dataSet: data.data,
      })
    );
  } catch (e) {
    // Check if there was any error fetching the dataset, in which case restart it's status
    await dispatch(dropDataSet());
    // Also report the error
    await dispatch(reportError(e));
  }
  return null;
};

// Remove all dataset
export const clearDataSet = () => dispatch =>
  dispatch(dataSetUpdateOperation(dataSet => ({})));

/**
 * Gets detailed information about the samples and experiments associated with
 * the current dataset. This information is needed to be able to group the samples
 * by species.
 */
export const fetchDataSetDetails = dataSetId => async (dispatch, getState) => {
  const tokenId = getState().token;
  if (!dataSetId) {
    return;
  }

  const response = await getDataSetDetails(dataSetId, tokenId);
  dispatch(
    updateDownloadDataSet({
      ...response,
      dataSetId,
      dataSet: response.data,
    })
  );
};

/**
 * edit some parameter of the dataset
 * @param {*} params additional params to be sent to the API
 */
export const editDataSet = ({ ...params }) => async (dispatch, getState) => {
  const { id: dataSetId, dataSet } = getState().download;
  const {
    data,
    is_processing,
    is_processed,
    aggregate_by,
    scale_by,
    quantile_normalize,
  } = await Ajax.put(`/v1/dataset/${dataSetId}/`, {
    data: dataSet,
    ...params,
  });

  dispatch(
    updateDownloadDataSet({
      dataSetId,
      dataSet: data,
      is_processing,
      is_processed,
      aggregate_by,
      scale_by,
      quantile_normalize,
    })
  );
};

export const startDownload = ({
  dataSetId,
  dataSet,
  email,
  receiveUpdates = false,
}) => async (dispatch, getState) => {
  let tokenId = getState().token;
  if (!tokenId) {
    await dispatch(createToken());
    tokenId = getState().token;
  }

  try {
    await Ajax.put(
      `/v1/dataset/${dataSetId}/`,
      {
        start: true,
        data: dataSet,
        token_id: tokenId,
        ...(receiveUpdates ? { email_ccdl_ok: true } : {}),
        ...(email ? { email_address: email } : {}),
      },
      {
        'API-KEY': tokenId,
      }
    );
  } catch (e) {
    if (e instanceof ServerError) {
      // check for an invalid token error
      if (e.data.detail === 'You must provide an active API token ID') {
        dispatch(clearToken());
        throw new InvalidTokenError();
      }
    }

    await dispatch(reportError(e));
    // if there's an error, redirect to the dataset page, and show a message
    // also with a button to try again
    return dispatch(
      replace({
        pathname: `/dataset/${dataSetId}`,
        state: { hasError: true },
      })
    );
  }

  const currentDataSet = getState().download.dataSetId;
  if (currentDataSet === dataSetId) {
    // clear the current dataset if a download is started for it.
    await dispatch(dropDataSet());
  }

  // redirect to the dataset page, and send the email address in the state
  return dispatch(
    replace({
      pathname: `/dataset/${dataSetId}`,
      state: { email_address: email },
    })
  );
};

/**
 * Once generated the datasets are immutable on the server, so to be able to re-generate one we have
 * to create a new dataset with the same data and redirect to it's page.
 */
export const regenerateDataSet = dataSet => async dispatch => {
  const { data, aggregate_by, scale_by, quantile_normalize } = dataSet;

  try {
    // 1. create a new dataset
    const { id: dataSetId } = await createDataSet();
    // 2. add the same data
    await Ajax.put(`/v1/dataset/${dataSetId}/`, {
      data,
      aggregate_by,
      scale_by,
      quantile_normalize,
    });

    // 3. redirect to the new dataset page, where the user will be able to add an email
    dispatch(
      push({
        pathname: `/dataset/${dataSetId}`,
        state: { regenerate: true, dataSetId, dataSet: data },
      })
    );
  } catch (e) {
    dispatch(reportError(e));
  }
};

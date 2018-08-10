import { Ajax } from '../../common/helpers';
import {
  getDataSet,
  getSamplesAndExperiments,
  updateDataSet
} from '../../api/dataSet';
import reportError from '../reportError';

/**
 * Removes all experiments with the corresponding accession codes from dataset
 * @param {array} accessionCodes
 */
export const removeExperiment = accessionCodes => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'DOWNLOAD_REMOVE_EXPERIMENT',
      data: {
        accessionCodes
      }
    });
    const { dataSet, dataSetId } = getState().download;
    const newDataSet = Object.keys(dataSet).reduce((result, key) => {
      const shouldRemove = accessionCodes.some(
        accessionCode => accessionCode === key
      );
      if (!shouldRemove) result[key] = dataSet[key];
      return result;
    }, {});

    try {
      const response = await updateDataSet(dataSetId, newDataSet);
      dispatch(removeExperimentSucceeded(response.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const removeExperimentSucceeded = dataSet => {
  return {
    type: 'DOWNLOAD_REMOVE_EXPERIMENT_SUCCESS',
    data: {
      dataSet
    }
  };
};

export const removeSamplesFromExperiment = (
  accessionCode,
  sampleAccessions
) => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'DOWNLOAD_REMOVE_EXPERIMENT',
      data: {
        accessionCode,
        sampleAccessions
      }
    });
    const { dataSet, dataSetId } = getState().download;
    const filteredSamples = dataSet[accessionCode].filter(
      sample => sampleAccessions.indexOf(sample) === -1
    );
    const newDataSet = { ...dataSet };
    if (filteredSamples.length) {
      newDataSet[accessionCode] = filteredSamples;
    } else {
      delete newDataSet[accessionCode];
    }

    try {
      const response = await updateDataSet(dataSetId, newDataSet);
      dispatch(removeExperimentSucceeded(response.data));
    } catch (error) {
      console.log(error);
    }
  };
};

/**
 * Removes all samples with corresponding ids from each experiment in dataset
 * @param {array} samples
 */
export const removeSpecies = samples => {
  return async (dispatch, getState) => {
    const sampleAccessions = samples.map(sample => sample.accession_code);
    dispatch({
      type: 'DOWNLOAD_REMOVE_SPECIES',
      data: {
        sampleAccessions
      }
    });

    const {
      download: { dataSet, dataSetId }
    } = getState();

    const newDataSet = Object.keys(dataSet).reduce((result, accessionCode) => {
      const samples = dataSet[accessionCode];

      const filteredSamples = samples.filter(sample => {
        return sampleAccessions.indexOf(sample) === -1;
      });
      if (filteredSamples.length) result[accessionCode] = filteredSamples;
      return result;
    }, {});

    try {
      const response = await updateDataSet(dataSetId, newDataSet);
      dispatch(removeSpeciesSucceeded(response.data));
    } catch (error) {
      console.log(error);
    }
  };
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
 * Takes an array of experiment objects and adds to users dataset via endpoint
 * @param {array} experiments
 */
export const addExperiment = experiments => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'DOWNLOAD_ADD_EXPERIMENT',
      data: {
        experiments
      }
    });
    const dataSetId = getState().download.dataSetId;
    const prevDataSet = getState().download.dataSet;
    const newExperiments = experiments.reduce((result, experiment) => {
      if (experiment.samples.length) {
        var sampleAccessions = experiment.samples;
        // If the samples property is a list of strings we're good.
        // But if it's instead sample objects, we want to convert it
        // to only being accession codes.
        if (typeof sampleAccessions[0] != 'string') {
          sampleAccessions = sampleAccessions.map(x => x.accession_code);
        }
        result[experiment.accession_code] = prevDataSet[
          experiment.accession_code
        ]
          ? // Remove duplicates from the array, since the backend throws errors
            // on non-unique accessions
            [
              ...new Set([
                ...prevDataSet[experiment.accession_code],
                ...sampleAccessions
              ])
            ]
          : sampleAccessions;
      }
      return result;
    }, {});
    const bodyData = {
      ...prevDataSet,
      ...newExperiments
    };

    try {
      let response;
      if (!dataSetId) {
        response = await Ajax.post('/dataset/create/', {
          data: bodyData
        });

        const { id } = response;
        localStorage.setItem('dataSetId', id);
      } else {
        response = await updateDataSet(dataSetId, bodyData);
      }
      const { data, id } = response;
      dispatch(addExperimentSucceeded(id, data));
    } catch (err) {
      console.log(err);
    }
  };
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

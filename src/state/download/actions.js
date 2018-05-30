import { asyncFetch } from '../../common/helpers';
import {
  getDataSet,
  getSamplesAndExperiments,
  updateDataSet
} from '../../api/dataSet';
import { push } from '../routerActions';

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

export const removeSamplesFromExperiment = (accessionCode, sampleIds) => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'DOWNLOAD_REMOVE_EXPERIMENT',
      data: {
        accessionCode,
        sampleIds
      }
    });
    const { dataSet, dataSetId } = getState().download;
    const filteredSamples = dataSet[accessionCode].filter(
      sample => sampleIds.indexOf(sample) === -1
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
    const sampleIds = samples.map(sample => sample.id);
    dispatch({
      type: 'DOWNLOAD_REMOVE_SPECIES',
      data: {
        sampleIds
      }
    });

    const { download: { dataSet, dataSetId } } = getState();

    const newDataSet = Object.keys(dataSet).reduce((result, accessionCode) => {
      const samples = dataSet[accessionCode];

      const filteredSamples = samples.filter(sample => {
        return sampleIds.indexOf(sample) === -1;
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
        const sampleIds = experiment.samples.map(sample => sample.id);
        result[experiment.accession_code] = prevDataSet[
          experiment.accession_code
        ]
          ? [...prevDataSet[experiment.accession_code], ...sampleIds]
          : sampleIds;
      }
      return result;
    }, {});
    const bodyData = {
      data: {
        ...prevDataSet,
        ...newExperiments
      }
    };

    try {
      let response;
      if (!dataSetId) {
        response = await asyncFetch('/dataset/create/', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(bodyData)
        });

        const { id } = response;
        localStorage.setItem('dataSetId', id);
      } else {
        response = await updateDataSet(dataSetId, JSON.stringify(bodyData));
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
export const fetchDataSet = () => {
  return async dispatch => {
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
    const { data } = await getDataSet(dataSetId);
    dispatch(fetchDataSetSucceeded(data));
  };
};

export const fetchDataSetSucceeded = dataSet => ({
  type: 'DOWNLOAD_DATASET_FETCH_SUCCESS',
  data: {
    dataSet
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

export const startDownload = () => async (dispatch, getState) => {
  const { dataSetId, dataSet } = getState().download;
  await asyncFetch(`/dataset/${dataSetId}/`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      start: true,
      data: dataSet
    })
  });

  // Use `push` action to navigate to the dataset url
  dispatch(push(`/dataset/${dataSetId}`));
};

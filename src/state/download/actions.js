import { asyncFetch } from '../../common/helpers';
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
      const response = await asyncFetch(`/dataset/${dataSetId}/`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          data: newDataSet
        })
      });
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
      const response = await asyncFetch(`/dataset/${dataSetId}/`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          data: newDataSet
        })
      });
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
 * Takes an array of experiments and adds to users dataset via endpoint
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
    const formattedDataSet = prevDataSet;
    const newExperiments = experiments.reduce((result, experiment) => {
      if (experiment.samples.length)
        result[experiment.accession_code] = experiment.samples;
      return result;
    }, {});
    const bodyData = {
      data: {
        ...formattedDataSet,
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
        response = await asyncFetch(`/dataset/${dataSetId}/`, {
          method: 'PUT',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(bodyData)
        });
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
    dispatch({
      type: 'DOWNLOAD_DATASET_FETCH',
      data: {
        dataSetId
      }
    });
    const response = dataSetId
      ? await asyncFetch(`/dataset/${dataSetId}/`)
      : null;

    const dataSet = response ? response.data : {};

    dispatch(fetchDataSetSucceeded(dataSet));
  };
};

export const fetchDataSetSucceeded = dataSet => {
  return {
    type: 'DOWNLOAD_DATASET_FETCH_SUCCESS',
    data: {
      dataSet
    }
  };
};

export const fetchDataSetDetails = dataSet => {
  return async dispatch => {
    dispatch({
      type: 'DOWNLOAD_FETCH_DETAILS'
    });
    const experiments = {},
      samples = {};

    await Promise.all(
      Object.keys(dataSet).map(async accessionCode => {
        const experiment = await asyncFetch(
          `/experiments/?accession_code=${accessionCode}`
        );

        experiments[accessionCode] = experiment.results[0];

        // there should only be one result for each experiment response
        const experimentInfo = experiment.results[0];
        const { samples: sampleList } = experimentInfo;
        const response = await asyncFetch(
          `/samples/?limit=1000000000000000&ids=${sampleList.join(',')}`
        );
        const sampleInfo = response.results;

        samples[accessionCode] = sampleInfo;
      })
    );
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
  const response = await asyncFetch(`/dataset/${dataSetId}/`, {
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

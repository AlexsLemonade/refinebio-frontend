import { asyncFetch } from '../../common/helpers';

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

export const removedSpecies = speciesName => {
  return dispatch => {
    dispatch({
      type: 'DOWNLOAD_SPECIES_REMOVED',
      data: {
        speciesName
      }
    });
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
      const { data } = response;
      dispatch(addExperimentSucceeded(dataSetId, data));
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
      : [];

    dispatch(fetchDataSetSucceeded(response.data));
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

export const fetchDownloadDetails = dataSet => {
  return async dispatch => {
    dispatch({
      type: 'DOWNLOAD_FETCH_DETAILS',
      data: {
        dataSet
      }
    });

    let dataSetArray = {};

    for (let accessionCode of Object.keys(dataSet)) {
      const experiment = await asyncFetch(
        `/experiments/?accession_code=${accessionCode}`
      );

      // there should only be one result for each experiment response
      const experimentInfo = experiment.results[0];
      const { samples: sampleList } = experimentInfo;
      const response = await asyncFetch(
        `/samples/?limit=1000000000000000&ids=${sampleList.join(',')}`
      );
      const samples = response.results;

      dataSetArray[accessionCode] = {
        ...experimentInfo,
        samples
      };
    }
    dispatch(fetchDownloadDetailsSucceeded(dataSetArray));
  };
};

export const fetchDownloadDetailsSucceeded = dataSet => {
  return {
    type: 'DOWNLOAD_FETCH_DETAILS_SUCCESS',
    data: {
      dataSet
    }
  };
};

import { asyncFetch } from '../../common/helpers';
/**
 * Convert the reducer's dataset data structure to a map where
 * key = accesion code and value = array of sample ids
 * for submitting to the endpoint
 */
const _formatDataSetObj = dataset => {
  const results = {};
  Object.keys(dataset).forEach(key => {
    results[key] = dataset[key].samples.map(sample => sample.id);
  });
  return results;
};

export const removedExperiment = accessionCode => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'DOWNLOAD_EXPERIMENT_REMOVED',
      data: {
        accessionCode
      }
    });
    const { dataSet, dataSetId } = getState().download;
    const newDataSet = { ...dataSet };
    delete newDataSet[accessionCode];

    const response = await asyncFetch(`/dataset/${dataSetId}/`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        data: _formatDataSetObj(newDataSet)
      })
    });

    dispatch(fetchDownloadData(response.data));
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

export const addedExperiment = experiment => {
  return async (dispatch, getState) => {
    let response, bodyData;

    const dataSetId = getState().download.dataSetId;

    if (!dataSetId) {
      bodyData = {
        data: {
          [experiment.accession_code]: experiment.samples
        }
      };
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
      const prevDataSet = getState().download.dataSet;
      const formattedDataSet = _formatDataSetObj(prevDataSet);
      bodyData = {
        data: {
          ...formattedDataSet,
          [experiment.accession_code]: experiment.samples
        }
      };

      response = await asyncFetch(`/dataset/${dataSetId}/`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      });
    }

    const { data } = response;

    dispatch(fetchDownloadData(data));
    dispatch({
      type: 'DOWNLOAD_EXPERIMENT_ADDED',
      data: {
        dataSetId
      }
    });
  };
};

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

    if (response) dispatch(fetchDownloadData(response.data));
  };
};

export const fetchDownloadData = dataSet => {
  return async dispatch => {
    dispatch({
      type: 'DOWNLOAD_FETCH_DATA'
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
    dispatch(fetchDownloadDataSucceeded(dataSetArray));
  };
};

export const fetchDownloadDataSucceeded = dataSet => {
  return {
    type: 'DOWNLOAD_FETCH_DATA_SUCCESS',
    data: {
      dataSet
    }
  };
};

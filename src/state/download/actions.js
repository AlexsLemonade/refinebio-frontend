const _formatDataSetObj = dataset => {
  const results = {};
  for (let experiment of dataset) {
    results[experiment.accession_code] = experiment.samples.map(
      sample => sample.id
    );
  }
  return results;
};

export const removedExperiment = experimentId => {
  return {
    type: 'DOWNLOAD_EXPERIMENT_REMOVED',
    data: {
      experimentId
    }
  };
};

export const removedSpecies = speciesName => {
  return {
    type: 'DOWNLOAD_SPECIES_REMOVED',
    data: {
      speciesName
    }
  };
};

export const addedExperiment = (experiment, dataSetId) => {
  return async (dispatch, getState) => {
    let response, bodyData;

    if (!dataSetId) {
      response = await (await fetch('/dataset/create/', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      })).json();

      const { id } = response;

      bodyData = {
        data: {
          [experiment.accession_code]: experiment.samples
        }
      };
      localStorage.setItem('dataSetId', id);
    } else {
      const prevDataSet = getState().download.experiments;
      const formattedDataSet = _formatDataSetObj(prevDataSet);
      bodyData = {
        data: {
          ...formattedDataSet,
          [experiment.accession_code]: experiment.samples
        }
      };

      response = await (await fetch(`/dataset/${dataSetId}/`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      })).json();
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
    const response = dataSetId
      ? await (await fetch(`/dataset/${dataSetId}/`)).json()
      : [];

    if (response) dispatch(fetchDownloadData(response.data));
    dispatch({
      type: 'DOWNLOAD_DATASET_FETCH',
      data: {
        dataSetId
      }
    });
  };
};

export const fetchDownloadData = dataSet => {
  return async dispatch => {
    let dataSetArray = [];

    for (let accessionCode of Object.keys(dataSet)) {
      const experiment = await (await fetch(
        `/experiments/?accession_code=${accessionCode}`
      )).json();

      // there should only be one result for each experiment response
      const experimentInfo = experiment.results[0];
      const { samples: sampleList } = experimentInfo;
      const samples = (await (await fetch(
        `/samples/?ids=${sampleList.join(',')}`
      )).json()).results;
      dataSetArray.push({
        ...experimentInfo,
        samples
      });
    }

    dispatch({
      type: 'DOWNLOAD_FETCH_DATA',
      data: { dataSet: dataSetArray }
    });
  };
};

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

export const addedExperiment = experiment => {
  return async dispatch => {
    const dataSetId = localStorage.getItem('dataSetId');
    const bodyData = {
      data: {
        [experiment.accession_code]: experiment.samples
      }
    };

    let response;

    if (!dataSetId) {
      response = await (await fetch('/dataset/create/', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      })).json();

      const { id } = response;
      localStorage.setItem('dataSetId', id);
    } else {
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
      type: 'DOWNLOAD_DATASET_FETCH'
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

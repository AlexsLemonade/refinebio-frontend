import { getDataSet, getSamplesAndExperiments } from '../../api/dataSet';

export const loadViewDownload = data => ({
  type: 'LOAD_VIEW_DOWNLOAD',
  data
});

export const fetchDataSetDetailsForView = dataSetId => async dispatch => {
  // 1. fetch dataset information
  const { data: dataSet } = await getDataSet(dataSetId);

  // 2. fetch details associated with dataset
  const { experiments, samples } = await getSamplesAndExperiments(dataSet);

  // 3. store data in `viewDownload` reducer
  dispatch(loadViewDownload({ dataSet, experiments, samples }));
};

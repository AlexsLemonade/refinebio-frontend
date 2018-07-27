import { getDataSet, getSamplesAndExperiments } from '../../api/dataSet';
import { replace } from '../../state/routerActions';

export const loadViewDownload = data => ({
  type: 'LOAD_VIEW_DOWNLOAD',
  data
});

export const fetchDataSetDetailsForView = dataSetId => async dispatch => {
  try {
    // 1. fetch dataset information
    const { data: dataSet, aggregate_by } = await getDataSet(dataSetId);

    // 2. fetch details associated with dataset
    const { experiments, samples } = await getSamplesAndExperiments(dataSet);

    // 3. store data in `viewDownload` reducer
    dispatch(loadViewDownload({ dataSet, experiments, samples, aggregate_by }));
  } catch (e) {
    // TODO: check the type of error
    dispatch(replace('/no-match'));
  }
};

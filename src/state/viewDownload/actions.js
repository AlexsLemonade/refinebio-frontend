import {
  getDataSetDetails,
  formatSamples,
  formatExperiments
} from '../../api/dataSet';
import { replace } from '../../state/routerActions';
import {} from '../../common/helpers';

export const loadViewDownload = data => ({
  type: 'LOAD_VIEW_DOWNLOAD',
  data
});

export const fetchDataSetDetailsForView = dataSetId => async dispatch => {
  try {
    // 1. fetch dataset information
    let {
      data: dataSet,
      aggregate_by,
      scale_by,
      experiments,
      samples
    } = await getDataSetDetails(dataSetId);

    // 2. Format the output
    samples = formatSamples(dataSet, samples);
    experiments = formatExperiments(experiments);

    // 3. store data in `viewDownload` reducer
    dispatch(
      loadViewDownload({
        dataSet,
        experiments,
        samples,
        aggregate_by,
        scale_by
      })
    );
  } catch (e) {
    // TODO: check the type of error
    dispatch(replace('/no-match'));
  }
};

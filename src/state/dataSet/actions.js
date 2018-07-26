import { asyncFetch } from '../../common/helpers';
import reportError from '../reportError';
import { replace } from '../../state/routerActions';

export const loadDataSet = dataSet => ({
  type: 'LOAD_DATASET',
  data: dataSet
});

export const updateDataSet = props => ({
  type: 'UPDATE_DATASET',
  data: props
});

/**
 * Fetches data for a given dataset
 * @param {*} id Identifier of the dataset (hash `730ad4b9-f789-48a0-a114-ca3a8c5ab030)
 */
export const fetchDataSet = dataSetId => async dispatch => {
  try {
    const dataSet = await asyncFetch(`/dataset/${dataSetId}/`);
    dispatch(loadDataSet(dataSet));
  } catch (e) {
    dispatch(reportError(e));
    dispatch(replace('/no-match'));
  }
};

export const editEmail = ({ dataSetId, email }) => async dispatch => {
  const dataSet = await asyncFetch(`/dataset/${dataSetId}/`);
  await asyncFetch(`/dataset/${dataSetId}/`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      data: dataSet.data,
      email_address: email
    })
  });
  dispatch(updateDataSet({ email_address: email }));
};

export const editAggregation = ({
  dataSetId,
  aggregation
}) => async dispatch => {
  const dataSet = await asyncFetch(`/dataset/${dataSetId}/`);
  await asyncFetch(`/dataset/${dataSetId}/`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      data: dataSet.data,
      aggregate_by: aggregation.toUpperCase()
    })
  });
  dispatch(updateDataSet({ aggregate_by: aggregation }));
};

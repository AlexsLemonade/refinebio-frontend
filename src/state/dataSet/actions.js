import { asyncFetch } from '../../common/helpers';
import { push } from '../../state/routerActions';

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
    dispatch(push('/no-match'));
  }
};

export const editEmail = ({ dataSetId, email }) => async dispatch => {
  await asyncFetch(`/dataset/${dataSetId}/`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      data: {},
      email_address: email
    })
  });
  dispatch(updateDataSet({ email_address: email }));
};

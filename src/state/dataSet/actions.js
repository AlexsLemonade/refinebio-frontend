import { Ajax } from '../../common/helpers';
import reportError from '../reportError';
import { replace, push } from '../../state/routerActions';
import { getDataSet, getDataSetDetails } from '../../api/dataSet';

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
    // To render a dataset page we need information from these two endpoints, in the future we should
    // consider unifying them or adding more information to the dataset details serializer
    // https://github.com/AlexsLemonade/refinebio/blob/dev/api/data_refinery_api/serializers.py#L513-L537
    // so that it also returns `expires_on` and the s3 information
    const [dataSet, dataSetDetails] = await Promise.all([
      getDataSet(dataSetId),
      getDataSetDetails(dataSetId)
    ]);

    dispatch(
      loadDataSet({
        ...dataSet,
        ...dataSetDetails
      })
    );
  } catch (e) {
    dispatch(reportError(e));
    dispatch(replace('/no-match'));
  }
};

export const editEmail = ({ dataSetId, email }) => async dispatch => {
  const dataSet = await Ajax.get(`/dataset/${dataSetId}/`);
  await Ajax.put(`/dataset/${dataSetId}/`, {
    data: dataSet.data,
    email_address: email
  });
  dispatch(updateDataSet({ email_address: email }));
};

/**
 * Once generated the datasets are immutable on the server, so to be able to re-generate one we have
 * to create a new dataset and redirect to the associated page.
 */
export const regenerateDataSet = () => async (dispatch, getState) => {
  let { data, aggregate_by, scale_by } = getState().dataSet;

  try {
    // create a new dataset
    let { id: dataSetId } = await Ajax.post('/dataset/create/', {
      data,
      aggregate_by,
      scale_by
    });

    // redirect to the new dataset page, where the user will be able to add an email
    dispatch(
      push({
        pathname: `/dataset/${dataSetId}`,
        state: { regenerate: true, dataSetId, dataSet: data }
      })
    );
  } catch (e) {
    dispatch(reportError(e));
  }
};

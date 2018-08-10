
import {fetchDataSet} from './actions';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { REPORT_ERROR } from '../reportError';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('fetchDataSet', () => {
  it('loads dataset in store', async () => {
    const DataSetId = "08c429ab-01dd-43c7-b51a-c850ad4b9902";
    const DataSet = {"id":DataSetId,"data":{}};

    global.localStorage.getItem.mockReturnValueOnce(DataSetId);
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve(DataSet) }));

    const store = mockStore({ });

    await store.dispatch(fetchDataSet());

    expect(global.fetch.mock.calls[0]).toEqual([`/dataset/${DataSetId}/`]);
    expect(global.localStorage.getItem.mock.calls[0]).toEqual(['dataSetId']);
    expect(store.getActions().map((x)=> x.type)).toEqual(["DOWNLOAD_DATASET_FETCH", "DOWNLOAD_DATASET_FETCH_SUCCESS"]);
  });

  it('current dataset is removed with a fetch error', async () => {
    const DataSetId = "08c429ab-01dd-43c7-b51a-c850ad4b9902";
    const DataSet = {"id":DataSetId,"data":{}};

    global.localStorage.getItem.mockReturnValueOnce(DataSetId);
    global.fetch = jest
      .fn()
      .mockImplementation(() => {throw new Error('')});

    const store = mockStore({ });

    await store.dispatch(fetchDataSet());

    expect(store.getActions().map((x)=> x.type)).toEqual(["DOWNLOAD_DATASET_FETCH", "DOWNLOAD_CLEAR", "DOWNLOAD_CLEAR_SUCCESS", REPORT_ERROR]);
  });
});



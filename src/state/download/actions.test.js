import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fetchDataSet, startDownload } from './actions';
import { REPORT_ERROR } from '../reportError';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('fetchDataSet', () => {
  it('loads dataset in store', async () => {
    const DataSetId = '08c429ab-01dd-43c7-b51a-c850ad4b9902';
    const DataSet = { id: DataSetId, data: {} };

    global.fetch = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve(DataSet) })
      );

    const store = mockStore({ download: { dataSetId: DataSetId } });

    await store.dispatch(fetchDataSet());

    expect(global.fetch.mock.calls[0][0]).toEqual(`/dataset/${DataSetId}/`);
    expect(store.getActions().map(x => x.type)).toEqual([
      'DOWNLOAD_DATASET_FETCH',
      'DOWNLOAD_DATASET_UPDATE',
    ]);
  });

  it('current dataset is removed with a fetch error', async () => {
    const DataSetId = '08c429ab-01dd-43c7-b51a-c850ad4b9902';

    global.fetch = jest.fn().mockImplementation(() => {
      throw new Error('');
    });

    const store = mockStore({ download: { dataSetId: DataSetId } });

    await store.dispatch(fetchDataSet());

    expect(store.getActions().map(x => x.type)).toEqual([
      'DOWNLOAD_DATASET_FETCH',
      'DOWNLOAD_CLEAR',
      REPORT_ERROR,
    ]);
  });

  it('current dataset is removed if its processed', async () => {
    const DataSetId = '08c429ab-01dd-43c7-b51a-c850ad4b9902';
    const DataSet = { id: DataSetId, data: {}, is_processed: true };

    global.fetch = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve(DataSet) })
      );

    const store = mockStore({ download: { dataSetId: DataSetId } });

    await store.dispatch(fetchDataSet());

    expect(global.fetch.mock.calls[0][0]).toEqual(`/dataset/${DataSetId}/`);
    expect(store.getActions().map(x => x.type)).toEqual([
      'DOWNLOAD_DATASET_FETCH',
      'DOWNLOAD_CLEAR',
    ]);
  });
});

describe('startDownload', () => {
  it('current dataset is removed after download is started', async () => {
    const DataSetId = '08c429ab-01dd-43c7-b51a-c850ad4b9902';
    const DataSet = { id: DataSetId, data: {} };

    global.fetch = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve(DataSet) })
      );

    const store = mockStore({
      download: { dataSetId: DataSetId, dataSet: DataSet },
    });

    await store.dispatch(
      startDownload({
        dataSetId: DataSetId,
        dataSet: DataSet,
      })
    );
    expect(store.getActions().map(x => x.type)).toEqual([
      'LOAD_TOKEN',
      'DOWNLOAD_CLEAR',
      'refinebio/CALL_HISTORY_METHOD',
    ]);
  });
});

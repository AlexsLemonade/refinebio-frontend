import configureMockStore from 'redux-mock-store';
import fetch from 'isomorphic-unfetch';
import thunk from 'redux-thunk';
import { fetchDataSet, startDownload } from './actions';
import { REPORT_ERROR } from '../reportError';

jest.mock('isomorphic-unfetch');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('fetchDataSet', () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  it('loads dataset in store', async () => {
    const DataSetId = '08c429ab-01dd-43c7-b51a-c850ad4b9902';
    const DataSet = { id: DataSetId, data: {} };

    fetch.mockImplementation(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(DataSet) })
    );

    const store = mockStore({ download: { dataSetId: DataSetId } });

    await store.dispatch(fetchDataSet());

    expect(fetch.mock.calls[0][0]).toEqual(`/v1/dataset/${DataSetId}/`);
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
      'DOWNLOAD_DROP',
      REPORT_ERROR,
    ]);
  });

  it('current dataset is removed if its processed', async () => {
    const DataSetId = '08c429ab-01dd-43c7-b51a-c850ad4b9902';
    const DataSet = { id: DataSetId, data: {}, is_processed: true };

    fetch.mockImplementation(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(DataSet) })
    );

    const store = mockStore({ download: { dataSetId: DataSetId } });

    await store.dispatch(fetchDataSet());

    expect(fetch.mock.calls[0][0]).toEqual(`/v1/dataset/${DataSetId}/`);
    expect(store.getActions().map(x => x.type)).toEqual([
      'DOWNLOAD_DATASET_FETCH',
      'DOWNLOAD_DROP',
    ]);
  });

  it('current dataset is removed after download is started', async () => {
    const DataSetId = '08c429ab-01dd-43c7-b51a-c850ad4b9902';
    const DataSet = { id: DataSetId, data: {} };

    fetch.mockImplementation(() =>
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
      'DOWNLOAD_DROP',
      'refinebio/CALL_HISTORY_METHOD',
    ]);
  });
});


import {fetchExperiment} from './actions';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('fetchExperiment', () => {
  it('loads experiment in store', async () => {
    const Experiment = {id: 1};

    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve(Experiment) }));
    const store = mockStore({ });

    // dispatch fetchExperiment action
    await store.dispatch(fetchExperiment(1));

    expect(global.fetch.mock.calls[0]).toEqual(['/experiments/1/']);
    expect(store.getActions()).toEqual([{
      type: 'LOAD_EXPERIMENT',
      data: Experiment
    }]);
  });
});



import {
  toggleFilterHelper,
  updateFilterOrderHelper,
  fetchResults
} from './actions';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe('toggleFilterHelper', () => {
  it('adds filter when none selected', () => {
    let filters = {};
    let toggled = toggleFilterHelper(filters, 'name', 'value');
    expect(toggled).toEqual({ name: ['value'] });
  });

  it('adds a second value to the list of selected filters', () => {
    let filters = { name: ['value1'] };
    let toggled = toggleFilterHelper(filters, 'name', 'value2');
    expect(toggled).toEqual({ name: ['value1', 'value2'] });
  });

  it('removes a filter when its already selected', () => {
    let filters = { name: ['value1', 'value2'] };
    let toggled = toggleFilterHelper(filters, 'name', 'value2');
    expect(toggled).toEqual({ name: ['value1'] });
  });
});

describe('updateFilterOrderHelper', () => {
  it('adds new filter', () => {
    let filters = { name: ['value1'] };
    let newOrder = updateFilterOrderHelper({
      filters,
      filterOrder: [],
      type: 'name',
      value: 'value0'
    });
    expect(newOrder).toEqual(['name']);
  });

  it('adds second category to filter order', () => {
    let filters = { name: ['value1'] };
    let newOrder = updateFilterOrderHelper({
      filters,
      filterOrder: ['name'],
      type: 'name',
      value: 'value0'
    });
    expect(newOrder).toEqual(['name', 'name']);
  });

  it('removes added filter', () => {
    let filters = { name: ['value1'] };
    let newOrder = updateFilterOrderHelper({
      filters,
      filterOrder: ['name'],
      type: 'name',
      value: 'value1'
    });
    expect(newOrder).toEqual([]);
  });
});

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('fetching a dataset', () => {
  beforeEach(function() {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => ({ results: [], count: 0, facets: [] })
      })
    );
  });

  it('sends correct ordering parameter by default', async () => {
    const store = mockStore();
    await store.dispatch(fetchResults({ query: 'cancer', ordering: '' }));
    expect(global.fetch.mock.calls[0]).toEqual([
      '/es/?search=cancer&limit=10&offset=0&ordering=_score'
    ]);
  });

  it('pass ordering parameter', async () => {
    const store = mockStore();
    await store.dispatch(
      fetchResults({ query: 'cancer', ordering: 'num_processed_samples' })
    );
    expect(global.fetch.mock.calls[0]).toEqual([
      '/es/?search=cancer&limit=10&offset=0&ordering=num_processed_samples'
    ]);
  });
});

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetch from 'isomorphic-unfetch';

import {
  toggleFilterHelper,
  updateFilterOrderHelper,
  fetchResults,
} from './actions';

jest.mock('isomorphic-unfetch');

describe('toggleFilterHelper', () => {
  it('adds filter when none selected', () => {
    const filters = {};
    const toggled = toggleFilterHelper(filters, 'name', 'value');
    expect(toggled).toEqual({ name: ['value'] });
  });

  it('adds a second value to the list of selected filters', () => {
    const filters = { name: ['value1'] };
    const toggled = toggleFilterHelper(filters, 'name', 'value2');
    expect(toggled).toEqual({ name: ['value1', 'value2'] });
  });

  it('removes a filter when its already selected', () => {
    const filters = { name: ['value1', 'value2'] };
    const toggled = toggleFilterHelper(filters, 'name', 'value2');
    expect(toggled).toEqual({ name: ['value1'] });
  });
});

describe('updateFilterOrderHelper', () => {
  it('adds new filter', () => {
    const filters = { name: ['value1'] };
    const newOrder = updateFilterOrderHelper({
      filters,
      filterOrder: [],
      type: 'name',
      value: 'value0',
    });
    expect(newOrder).toEqual(['name']);
  });

  it('adds second category to filter order', () => {
    const filters = { name: ['value1'] };
    const newOrder = updateFilterOrderHelper({
      filters,
      filterOrder: ['name'],
      type: 'name',
      value: 'value0',
    });
    expect(newOrder).toEqual(['name', 'name']);
  });

  it('removes added filter', () => {
    const filters = { name: ['value1'] };
    const newOrder = updateFilterOrderHelper({
      filters,
      filterOrder: ['name'],
      type: 'name',
      value: 'value1',
    });
    expect(newOrder).toEqual([]);
  });
});

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('fetching a dataset', () => {
  beforeEach(() => {
    fetch.mockReset().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => ({ results: [], count: 0, facets: [] }),
      })
    );
  });

  it('sends correct ordering parameter by default', async () => {
    const store = mockStore();
    await store.dispatch(fetchResults({ query: 'cancer', ordering: '' }));
    expect(fetch.mock.calls[0]).toEqual([
      '/v1/search/?search=cancer&limit=10&offset=0&ordering=_score&num_downloadable_samples__gt=0',
    ]);
  });

  it('pass ordering parameter', async () => {
    const store = mockStore();
    await store.dispatch(
      fetchResults({ query: 'cancer', ordering: 'num_downloadable_samples' })
    );
    expect(fetch.mock.calls[0]).toEqual([
      '/v1/search/?search=cancer&limit=10&offset=0&ordering=num_downloadable_samples&num_downloadable_samples__gt=0',
    ]);
  });
});

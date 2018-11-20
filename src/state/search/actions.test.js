import { toggleFilterHelper, updateFilterOrderHelper } from './actions';

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

import { toggleFilterHelper } from './actions';

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

import DataSetManager from './DataSetManager';

describe('DataSetManager', () => {
  describe('adding to dataset', () => {
    it('add different id', () => {
      const dataset = { e1: ['s1'] };
      const newDataSet = new DataSetManager(dataset).add({
        e2: ['s2'],
      });
      expect(newDataSet).toEqual({
        e1: ['s1'],
        e2: ['s2'],
      });
    });

    it('add new sample in same experiment', () => {
      const dataset = { e1: ['s1'] };
      const newDataSet = new DataSetManager(dataset).add({
        e1: ['s2'],
      });
      expect(newDataSet).toEqual({
        e1: ['s1', 's2'],
      });
    });
  });

  describe('remove slice', () => {
    it('remove existing sample', () => {
      const dataset = { e1: ['s1', 's2'] };
      const newDataSet = new DataSetManager(dataset).remove({
        e1: ['s2'],
      });
      expect(newDataSet).toEqual({
        e1: ['s1'],
      });
    });
  });
});

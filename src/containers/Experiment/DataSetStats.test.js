import DataSetStats from './DataSetStats';

describe('DataSetStats', () => {
  it('getAddedSlice', () => {
    let dataset = { e1: ['s1', 's2'] };
    const slice = { e1: ['s1'] };
    let addedSlice = new DataSetStats(dataset, slice).getAddedSlice();
    expect(addedSlice).toEqual({ e1: ['s1'] });
  });

  describe('getSamplesInDataSet', () => {
    it('returns samples in dataset', () => {
      let dataset = { e1: ['s1', 's2'] };
      const slice = { e1: ['s1'] };
      let processedSamples = new DataSetStats(
        dataset,
        slice
      ).getSamplesInDataSet();
      expect(processedSamples).toEqual(['s1']);
    });

    it('returns unique values', () => {
      let dataset = { e1: ['s1', 's2'], e2: ['s1'] };
      const slice = { e1: ['s1'], e2: ['s1'] };
      let processedSamples = new DataSetStats(
        dataset,
        slice
      ).getSamplesInDataSet();
      expect(processedSamples).toEqual(['s1']);
    });
  });

  describe('all samples in dataset', () => {
    it('not all samples are present', () => {
      let dataset = { e1: ['s1'] };
      const slice = { e1: ['s1', 's2'] };
      let allProcessedInDataSet = new DataSetStats(
        dataset,
        slice
      ).allProcessedInDataSet();
      expect(allProcessedInDataSet).toBeFalsy();
    });
  });
});

describe('DataSetOperations', () => {});

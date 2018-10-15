import DataSetStats, { DataSetOperations } from './DataSetStats';

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

describe('DataSetOperations', () => {
  it('intersect with one common value', () => {
    const d1 = { e1: ['s1'], e2: ['s2'] };
    const d2 = { e1: ['s1', 's2'] };
    expect(DataSetOperations.intersect(d1, d2)).toEqual({ e1: ['s1'] });
  });

  it('isEqual to empty dataset', () => {
    const d1 = {};
    const d2 = { e1: ['s1', 's2'] };
    expect(DataSetOperations.equal(d1, d2)).toBeFalsy();
  });

  it('isEqual ignores order where items appear', () => {
    const d1 = { e1: ['s2', 's1'], e2: ['s3'] };
    const d2 = { e2: ['s3'], e1: ['s1', 's2'] };
    expect(DataSetOperations.equal(d1, d2)).toBeTruthy();
  });
});

import DataSetStats from './DataSetStats';

describe('DataSetStats', () => {
  let samples = [
    { accession_code: 's1', is_processed: true },
    { accession_code: 's2', is_processed: true },
    { accession_code: 's3', is_processed: true },
    { accession_code: 's4', is_processed: false },
    { accession_code: 's5', is_processed: false }
  ];

  it('getAddedSlice', () => {
    let dataset = { e1: ['s1', 's2'] };
    const slice = { e1: ['s1'] };
    let addedSlice = new DataSetStats(dataset, slice).getAddedSlice();
    expect(addedSlice).toEqual({ e1: ['s1'] });
  });

  it('returns samples in dataset', () => {
    let dataset = { e1: ['s1', 's2'] };
    const slice = { e1: ['s1'] };
    let processedSamples = new DataSetStats(
      dataset,
      slice
    ).getSamplesInDataSet();
    expect(processedSamples).toEqual(['s1']);
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

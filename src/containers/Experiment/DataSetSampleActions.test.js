import { DataSetStats } from './DataSetSampleActions';

describe('DataSetStats', () => {
  let samples = [
    { accession_code: 's1', is_processed: true },
    { accession_code: 's2', is_processed: true },
    { accession_code: 's3', is_processed: true },
    { accession_code: 's4', is_processed: false },
    { accession_code: 's5', is_processed: false }
  ];

  it('returns samples in dataset', () => {
    let dataset = { e1: ['s1'] };
    let processedSamples = new DataSetStats(
      dataset,
      samples
    ).getSamplesInDataSet();
    expect(processedSamples.map(x => x.accession_code)).toEqual(['s1']);
  });

  it('returns processed samples', () => {
    let dataset = { e1: ['s1'] };
    let processedSamples = new DataSetStats(
      dataset,
      samples
    ).getProcessedSamples();
    expect(processedSamples.map(x => x.accession_code)).toEqual([
      's1',
      's2',
      's3'
    ]);
  });

  it('checks sample in dataset', () => {
    let dataset = { e1: ['s1'] };
    let sample = { accession_code: 's1', is_processed: true };
    let result = new DataSetStats(dataset, samples).sampleInDataSet(sample);
    expect(result).toBeTruthy();
  });
});

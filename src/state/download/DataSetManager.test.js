import DataSetManager from './DataSetManager';

describe('DataSetManager', () => {
  it('adds an experiment to the dataset when empty', () => {
    let dataset = {};
    let newDataSet = new DataSetManager(dataset).addExperiment([
      {
        accession_code: 'e1',
        samples: [
          { accession_code: 's1', is_processed: true },
          { accession_code: 's2', is_processed: true }
        ]
      }
    ]);
    expect(newDataSet).toEqual({ e1: ['s1', 's2'] });
  });

  it('add new sample to existing experiment', () => {
    let dataset = { e1: ['s1'] };
    let newDataSet = new DataSetManager(dataset).addExperiment([
      {
        accession_code: 'e1',
        samples: [{ accession_code: 's2', is_processed: true }]
      }
    ]);
    expect(newDataSet).toEqual({ e1: ['s1', 's2'] });
  });

  it('adds samples to new experiment', () => {
    let dataset = { e1: ['s1'] };
    let newDataSet = new DataSetManager(dataset).addExperiment([
      {
        accession_code: 'e2',
        samples: [{ accession_code: 's2', is_processed: true }]
      }
    ]);
    expect(newDataSet).toEqual({
      e1: ['s1'],
      e2: ['s2']
    });
  });

  describe('adding to dataset', () => {
    it('add different id', () => {
      let dataset = { e1: ['s1'] };
      let newDataSet = new DataSetManager(dataset).add({
        e2: ['s2']
      });
      expect(newDataSet).toEqual({
        e1: ['s1'],
        e2: ['s2']
      });
    });

    it('add new sample in same experiment', () => {
      let dataset = { e1: ['s1'] };
      let newDataSet = new DataSetManager(dataset).add({
        e1: ['s2']
      });
      expect(newDataSet).toEqual({
        e1: ['s1', 's2']
      });
    });
  });

  describe('remove slice', () => {
    it('remove existing sample', () => {
      let dataset = { e1: ['s1', 's2'] };
      let newDataSet = new DataSetManager(dataset).remove({
        e1: ['s2']
      });
      expect(newDataSet).toEqual({
        e1: ['s1']
      });
    });
  });
});

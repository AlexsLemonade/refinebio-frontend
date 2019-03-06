import { Ajax } from '../common/helpers';

export async function fetchDashboardData(range = null) {
  return YEAR;
  return range
    ? await Ajax.get('/stats/', { range })
    : await Ajax.get('/stats');
}

const YEAR = {
  survey_jobs: {
    total: 57167,
    pending: 27595,
    completed: 19389,
    successful: 16738,
    open: 0,
    average_time: 797.964116,
    timeline: [
      {
        start: '2018-12-01T00:00:00Z',
        total: 28432,
        completed: 12308,
        pending: 13481,
        failed: 16124,
        open: 0
      },
      {
        start: '2018-11-01T00:00:00Z',
        total: 18245,
        completed: 3338,
        pending: 14114,
        failed: 14907,
        open: 0
      },
      {
        start: '2018-09-01T00:00:00Z',
        total: 10490,
        completed: 1092,
        pending: 0,
        failed: 9398,
        open: 0
      }
    ]
  },
  downloader_jobs: {
    total: 1339515,
    pending: 736150,
    completed: 518718,
    successful: 373167,
    open: 0,
    average_time: 200.856814,
    timeline: [
      {
        start: '2018-09-01T00:00:00Z',
        total: 125500,
        completed: 127,
        pending: 123905,
        failed: 125373,
        open: 0
      },
      {
        start: '2018-10-01T00:00:00Z',
        total: 191186,
        completed: 30176,
        pending: 82030,
        failed: 161010,
        open: 0
      },
      {
        start: '2018-11-01T00:00:00Z',
        total: 477044,
        completed: 176985,
        pending: 272419,
        failed: 300059,
        open: 0
      },
      {
        start: '2018-12-01T00:00:00Z',
        total: 545785,
        completed: 165879,
        pending: 257796,
        failed: 379906,
        open: 0
      }
    ]
  },
  processor_jobs: {
    total: 956595,
    pending: 190360,
    completed: 475657,
    successful: 308761,
    open: 172,
    average_time: 1179.089652,
    timeline: [
      {
        start: '2018-09-01T00:00:00Z',
        total: 11283,
        completed: 7691,
        pending: 1781,
        failed: 3509,
        open: 83
      },
      {
        start: '2018-10-01T00:00:00Z',
        total: 62971,
        completed: 43951,
        pending: 6354,
        failed: 18679,
        open: 341
      },
      {
        start: '2018-11-01T00:00:00Z',
        total: 407580,
        completed: 95838,
        pending: 161966,
        failed: 308788,
        open: 2954
      },
      {
        start: '2018-12-01T00:00:00Z',
        total: 474721,
        completed: 161281,
        pending: 20220,
        failed: 310938,
        open: 2502
      },
      {
        start: '2019-01-01T00:00:00Z',
        total: 39,
        completed: 0,
        pending: 38,
        failed: 1,
        open: 38
      },
      {
        start: '2019-02-01T00:00:00Z',
        total: 1,
        completed: 0,
        pending: 1,
        failed: 0,
        open: 1
      }
    ]
  },
  samples: { total: 458472 },
  experiments: {
    total: 12860,
    timeline: [
      { start: '2018-09-01T00:00:00Z', total: 1014 },
      { start: '2018-12-01T00:00:00Z', total: 8211 },
      { start: '2018-11-01T00:00:00Z', total: 3635 }
    ]
  },
  processed_samples: {
    total: 133217,
    timeline: [
      { start: '2018-12-01T00:00:00Z', total: 84774 },
      { start: '2018-11-01T00:00:00Z', total: 36787 },
      { start: '2018-09-01T00:00:00Z', total: 11656 }
    ],
    last_hour: 0,
    technology: { MICROARRAY: 126178, 'RNA-SEQ': 7039 },
    organism: {
      CHLOROCEBUS_SABAEUS: 2,
      SACCHAROMYCES_CEREVISIAE: 15,
      DROSOPHILA_MELANOGASTER: 57,
      MARMOTA_MONAX: 12,
      OVIS_ARIES: 26,
      MUS_MUSCULUS_X_MUS_SPRETUS: 75,
      'MUS_MUSCULUS_MUSCULUS_X_M._M._CASTANEUS': 12,
      'MUS_MUSCULUS_MUSCULUS_X_M._M._DOMESTICUS': 17,
      CAENORHABDITIS_ELEGANS: 10,
      MUS_SPRETUS: 13,
      PAPIO_ANUBIS: 5,
      TRYPANOSOMA_CRUZI: 1,
      RATTUS_NORVEGICUS: 15615,
      MACACA_FASCICULARIS: 199,
      CHLOROCEBUS_AETHIOPS_VERVET: 1,
      CHLOROCEBUS_AETHIOPS: 16,
      MUS_MUSCULUS: 51648,
      GALLUS_GALLUS: 54,
      HOMO_SAPIENS: 57662,
      SUS_SCROFA: 60,
      RATTUS_RATTUS: 10,
      MUS_MUSCULUS_MUSCULUS: 6,
      CERVUS_ELAPHUS: 16,
      PAN_TROGLODYTES: 43,
      MUS_MUSCULUS_DOMESTICUS: 35,
      MICROCEBUS_MURINUS: 26,
      XENOPUS_LAEVIS: 43,
      BOS_TAURUS: 18,
      MACACA_MULATTA: 75,
      MUS_MUSCULUS_CASTANEUS: 6,
      DANIO_RERIO: 7439
    }
  },
  processed_experiments: { total: 9882 },
  active_volumes: [],
  input_data_size: 4281596985758,
  output_data_size: 0,
  dataset: {
    total: 164,
    aggregated_by_experiment: 147,
    aggregated_by_species: 0,
    scale_by_none: 155,
    scale_by_minmax: 2,
    scale_by_standard: 7,
    scale_by_robust: 0
  }
};

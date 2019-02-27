import React from 'react';
import Dropdown from '../../components/Dropdown';
import LineChart from '../../components/LineChart';

const YESTERDAY = 'Yesterday';

export default function SamplesProcessedBlock({ data }) {
  return (
    <div className="exec-dash__sample-graph">
      <div className="exec-dash__block-header">
        <div>Samples Processed - Yesterday</div>
        <div>
          View:{' '}
          <Dropdown
            className=""
            selectedOption={YESTERDAY}
            options={[YESTERDAY]}
            onChange={selected => {}}
          />
        </div>
      </div>

      <table className="exec-dash__chart-table">
        <tbody>
          <tr>
            <th>100</th>
            <th>$1000</th>
          </tr>
          <tr>
            <td>Samples</td>
            <td>Estimated Value</td>
          </tr>
        </tbody>
      </table>

      <div className="exec-dash__chart">
        <div className="responsive-chart__absolute">
          <LineChart data={DATA} series={['experiments', 'samples']} />
        </div>
      </div>
    </div>
  );
}

const DATA = [
  { date: '2019-02-21T15:05:21.073686Z', samples: 0, experiments: 0 },
  { date: '2019-02-22T15:05:21.073686Z', samples: 0, experiments: 0 },
  { date: '2019-02-23T15:05:21.073686Z', samples: 10, experiments: 0 },
  { date: '2019-02-24T15:05:21.073686Z', samples: 0, experiments: 0 },
  { date: '2019-02-25T15:05:21.073686Z', samples: 0, experiments: 0 },
  { date: '2019-02-26T15:05:21.073686Z', samples: 0, experiments: 0 }
];

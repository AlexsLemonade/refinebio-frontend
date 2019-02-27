import React from 'react';
import Spinner from '../../components/Spinner';
import Dropdown from '../../components/Dropdown';
import LineChart from '../../components/LineChart';
import { useLoader } from '../../components/Loader';
import { fetchDashboardData } from '../../api/dashboad';

const YESTERDAY = 'Yesterday';
const WEEK = 'Last Week';
const MONTH = 'Last Month';

export default function SamplesProcessedBlock() {
  const [interval, setInterval] = React.useState(WEEK);
  const rangeParam =
    interval === YESTERDAY ? 'day' : interval === WEEK ? 'week' : 'month';
  const { data, isLoading, hasError, refresh } = useLoader(
    () => fetchDashboardData(rangeParam),
    [rangeParam]
  );
  const totalSamples = !isLoading
    ? data.samples.timeline.reduce((acc, x) => acc + x.total, 0)
    : 0;

  return (
    <div className="exec-dash__sample-graph">
      <div className="exec-dash__block-header">
        <div>Samples Processed - {interval}</div>
        <div>
          View:{' '}
          <Dropdown
            selectedOption={interval}
            options={[YESTERDAY, WEEK, MONTH]}
            onChange={selected => setInterval(selected)}
          />
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <table className="exec-dash__chart-table">
            <tbody>
              <tr>
                <th>{totalSamples}</th>
                <th>${totalSamples * 1000}</th>
              </tr>
              <tr>
                <td>Samples</td>
                <td>Estimated Value</td>
              </tr>
            </tbody>
          </table>

          <div className="exec-dash__chart">
            <div className="responsive-chart__absolute">
              <LineChart
                data={transformSamplesTimeline(data.samples.timeline)}
                series={['samples']}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function transformSamplesTimeline(timeline) {
  return timeline.map(x => ({
    date: x.start,
    samples: x.total
  }));
}

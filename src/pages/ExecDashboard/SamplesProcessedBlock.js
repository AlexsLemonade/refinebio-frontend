import React from 'react';
import Spinner from '../../components/Spinner';
import Dropdown from '../../components/Dropdown';
import LineChart from '../../components/LineChart';
import { useLoader } from '../../components/Loader';
import { fetchDashboardData } from '../../api/dashboad';
import { formatNumber } from '../../common/helpers';
import moment from 'moment';

const YESTERDAY = 'Yesterday';
const WEEK = 'Last Week';
const MONTH = 'Last Month';
const YEAR = 'Last Year';

export default function SamplesProcessedBlock() {
  const [interval, setInterval] = React.useState(WEEK);
  const rangeParam =
    interval === YESTERDAY
      ? 'day'
      : interval === WEEK
        ? 'week'
        : interval === MONTH
          ? 'month'
          : 'year';
  const { data, isLoading } = useLoader(() => fetchDashboardData(rangeParam), [
    rangeParam
  ]);
  const totalSamples = !isLoading
    ? data.processed_samples.timeline.reduce((acc, x) => acc + x.total, 0)
    : 0;

  return (
    <div className="exec-dash__sample-graph">
      <div className="exec-dash__block-header">
        <div>Samples Processed - {interval}</div>
        <div>
          View:{' '}
          <Dropdown
            selectedOption={interval}
            options={[YESTERDAY, WEEK, MONTH, YEAR]}
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
                <th>{formatNumber(totalSamples, 0)}</th>
                <th>${formatNumber(totalSamples * 1000)}</th>
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
                range={rangeParam}
                data={transformSamplesTimeline(
                  data.processed_samples.timeline,
                  rangeParam
                )}
                formatLabel={label => {
                  const format =
                    {
                      day: 'HH:00',
                      week: 'dddd',
                      month: 'MMM Do',
                      year: 'MMMM'
                    }[rangeParam] || null;
                  return moment(label).format(format);
                }}
                formatValue={x => formatNumber(x, 0)}
                series={['samples']}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Returns a timeline that is sorted chronologically, and that has all datapoints
 * for a given `range`.
 * The `/stats` endpoint only returns the datapoints that have some value.
 * @param {*} timeline as returned by the /stats endpoint
 * @param {*} range range param that the graph will be displaying
 */
function transformSamplesTimeline(timeline, range) {
  const result = [...getTimeline(range)].map(date => ({
    date,
    samples: 0
  }));

  for (let observation of timeline) {
    // find the closest datapoint to `data.start`
    let closestTemp = null;
    for (let graphPoint of result) {
      if (
        !closestTemp ||
        Math.abs(moment(observation.start).diff(graphPoint.date)) <
          Math.abs(moment(observation.start).diff(closestTemp.date))
      ) {
        closestTemp = graphPoint;
      }
    }
    if (closestTemp) {
      // add the total samples to that datapoint
      closestTemp.samples += observation.total;
    }
  }

  return result;
}

/**
 * Given a range returns the
 * @param {*} range day/ | week | month | year
 */
function* getTimeline(range) {
  const now = moment().startOf('day');

  const data = {
    day: {
      start: now.clone().subtract(1, 'days'),
      interval: moment.duration(1, 'hour')
    },
    week: {
      start: now.clone().subtract(1, 'weeks'),
      interval: moment.duration(1, 'days')
    },
    month: {
      start: now.clone().subtract(30, 'days'),
      interval: moment.duration(1, 'days')
    },
    year: {
      start: now
        .clone()
        .subtract(365, 'days')
        .startOf('month'),
      interval: moment.duration(1, 'months')
    }
  };
  let nextDate = data[range].start;
  let interval = data[range].interval;
  yield nextDate.format();

  while (true) {
    nextDate = nextDate.add(interval);
    if (nextDate.isAfter(now)) {
      break;
    }
    yield nextDate.format();
  }
}

import React from 'react';
import moment from 'moment';
import Spinner from '../../components/Spinner';
import Dropdown from '../../components/Dropdown';
import LineChart from '../../components/LineChart';
import { useLoader } from '../../components/Loader';
import { fetchDashboardData } from '../../api/dashboad';
import { formatNumber, numberFormatter } from '../../common/helpers';

export default function SamplesProcessedBlock() {
  const ranges = {
    day: 'Yesterday',
    week: 'Last Week',
    month: 'Last Month',
    year: 'Last Year',
  };
  const [interval, setInterval] = React.useState(ranges.year);
  const rangeParam = Object.keys(ranges).find(r => ranges[r] === interval);
  const { data, isLoading, hasError, refresh } = useLoader(
    () => fetchDashboardData(rangeParam),
    [rangeParam]
  );

  React.useEffect(() => {
    let cancel = false;
    if (!isLoading && hasError) {
      setTimeout(() => {
        if (!isLoading && !cancel) refresh();
      }, 3000);
    }
    return () => {
      cancel = true;
    };
  }, [hasError, refresh, isLoading]);

  const totalSamples =
    !isLoading && data
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
            options={Object.values(ranges)}
            onChange={i => setInterval(i)}
          />
        </div>
      </div>

      {isLoading || !data ? (
        <Spinner />
      ) : (
        <>
          <table className="exec-dash__chart-table">
            <tbody>
              <tr>
                <th>{formatNumber(totalSamples, 0)}</th>
                <th>${formatNumber(totalSamples * 1000, 0)}</th>
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
                      year: 'MMMM',
                    }[rangeParam] || null;
                  return moment(label).format(format);
                }}
                formatValue={x => numberFormatter(x)}
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
    samples: 0,
  }));

  for (const observation of timeline) {
    // find the closest datapoint to `data.start`
    let closestTemp = null;
    for (const graphPoint of result) {
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
      interval: moment.duration(1, 'hour'),
    },
    week: {
      start: now.clone().subtract(1, 'weeks'),
      interval: moment.duration(1, 'days'),
    },
    month: {
      start: now.clone().subtract(30, 'days'),
      interval: moment.duration(1, 'days'),
    },
    year: {
      start: now
        .clone()
        .subtract(365, 'days')
        .startOf('month'),
      interval: moment.duration(1, 'months'),
    },
  };
  let nextDate = data[range].start;
  const { interval } = data[range];
  yield nextDate.format();

  while (true) {
    nextDate = nextDate.add(interval);
    if (nextDate.isAfter(now)) {
      break;
    }
    yield nextDate.format();
  }
}

import moment from 'moment';
import { Ajax } from '../../common/helpers';
import reportError from '../reportError';

function getTimePoints(timeRange = 'week', timeUnit = 'day') {
  const gtDate = moment().startOf(timeRange),
    timePoints = [];
  let datePoint = gtDate.clone().startOf(timeUnit);

  while (datePoint.isSameOrBefore(moment())) {
    timePoints.push(datePoint.clone());
    datePoint.add(1, timeUnit);
  }

  return timePoints;
}

function getTimeUnit(range) {
  switch (range) {
    case 'day': {
      return 'hour';
    }
    case 'year': {
      return 'month';
    }
    default: {
      return 'day';
    }
  }
}

async function createTimeQueries(
  endPoint = '/jobs/survey/',
  timePoints = [],
  isCumulative = false,
  limit = 1000000000
) {
  const promiseArray = timePoints.map(async (datePoint, i) => {
    const gte = isCumulative
      ? timePoints[0].utc().format()
      : timePoints[i].utc().format();
    const lte = timePoints[i + 1]
      ? timePoints[i + 1].utc().format()
      : moment()
          .utc()
          .format();

    const response = await Ajax.get(endPoint, {
      created_at__gte: gte,
      created_at__lte: lte,
      limit
    });
    return response;
  });
  return await Promise.all(promiseArray);
}

function getJobStatusesOverTime(jobData = []) {
  const pending = jobData.map(
    jobs =>
      jobs.results
        ? jobs.results.filter(job => job.start_time === null).length
        : null
  );
  const failed = jobData.map(
    jobs =>
      jobs.results
        ? jobs.results.filter(job => job.success === false).length
        : null
  );
  const completed = jobData.map(
    jobs =>
      jobs.results ? jobs.results.filter(job => !!job.success).length : null
  );
  const open = jobData.map(
    jobs =>
      jobs.results
        ? jobs.results.filter(job => job.success === null).length
        : null
  );
  return {
    pending,
    failed,
    open,
    completed
  };
}

const fetchDataOverTime = timePoints => {
  return async dispatch => {
    const [
      survey,
      processor,
      downloader,
      samples,
      experiments
    ] = await Promise.all([
      createTimeQueries('/jobs/survey/', timePoints),
      createTimeQueries('/jobs/processor/', timePoints),
      createTimeQueries('/jobs/downloader/', timePoints),

      // for samples and experiments, we only need the count,
      // not the results themselves, so we don't need a high limit
      createTimeQueries('/samples/', timePoints, true, 1),
      createTimeQueries('/experiments/', timePoints, true, 1)
    ]);

    const surveyStatus = getJobStatusesOverTime(survey);
    const processorStatus = getJobStatusesOverTime(processor);
    const downloaderStatus = getJobStatusesOverTime(downloader);

    dispatch({
      type: 'DASHBOARD_TIME_REQUESTS_SUCCESS',
      data: {
        jobs: {
          survey: {
            all: survey,
            ...surveyStatus
          },
          processor: {
            all: processor,
            ...processorStatus
          },
          downloader: {
            all: downloader,
            ...downloaderStatus
          }
        },
        samplesOverTime: samples.map(sample => sample.count),
        experimentsOverTime: experiments.map(experiments => experiments.count)
      }
    });
  };
};

export const fetchDashboardData = () => {
  return async dispatch => {
    try {
      const [stats, allSamples, allExperiments] = await Promise.all([
        Ajax.get('/stats/'),
        // samples and experiments will most likely go in another reducer when time comes
        Ajax.get('/samples/'),
        Ajax.get('/experiments/')
      ]);

      dispatch({
        type: 'DASHBOARD_REQUEST_SUCCESS',
        data: {
          stats,
          samples: {
            count: allSamples.count
          },
          experiments: {
            count: allExperiments.count
          }
        }
      });
    } catch (e) {
      reportError(e);
    }
  };
};

export const selectedTimeRange = (range = 'week') => {
  return dispatch => {
    dispatch({
      type: 'DASHBOARD_TIME_OPTIONS_SELECTED'
    });
    dispatch(updatedTimeRange(range));
  };
};

export const updatedTimeRange = (range = 'week') => {
  return dispatch => {
    const unit = getTimeUnit(range);
    const timePoints = getTimePoints(range, unit);
    dispatch(fetchDataOverTime(timePoints));
    dispatch({
      type: 'DASHBOARD_TIME_OPTIONS_UPDATED',
      data: {
        timeOptions: {
          range,
          timePoints
        }
      }
    });
  };
};

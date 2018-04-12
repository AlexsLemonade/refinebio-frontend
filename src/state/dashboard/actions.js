import moment from 'moment';

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

function createTimeQueries(
  endPoint = '/jobs/survey/',
  timePoints = [],
  isCumulative = false
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

    const response = await fetch(
      `${endPoint}?created_at__gte=${gte}&created_at__lte=${lte}&limit=100`
    );

    if (response.status === 200) {
      return await response.json();
    } else {
      return [
        {
          error: 'there was an error with response'
        }
      ];
    }
  });
  return Promise.all(promiseArray);
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
    const survey = await createTimeQueries('/jobs/survey/', timePoints);
    const processor = await createTimeQueries('/jobs/processor/', timePoints);
    const downloader = await createTimeQueries('/jobs/downloader/', timePoints);

    const samples = await createTimeQueries('/samples/', timePoints, true);
    const experiments = await createTimeQueries(
      '/experiments/',
      timePoints,
      true
    );

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
      const stats = await (await fetch('/stats/')).json();

      // samples and experiments will most likely go in another reducer when time comes
      const allSamples = await (await fetch('/samples/')).json();
      const allExperiments = await (await fetch('/experiments/')).json();

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
      console.log(e);
    }
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

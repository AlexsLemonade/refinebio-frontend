import React, { Component } from 'react';
import Helmet from 'react-helmet';
import * as chartSelectors from './chartSelectors';
import DashboardSection from './DashboardSection';
import TimeRangeSelect from '../../components/TimeRangeSelect';
import Loader, { useLoader } from '../../components/Loader';
import { timeout, getQueryParamObject } from '../../common/helpers';
import { useInterval } from '../../common/hooks';
import { fetchDashboardData } from '../../api/dashboad';
import Spinner from '../../components/Spinner';

import './Dashboard.scss';

function Dashboard() {
  const [range, setRange] = React.useState('year');
  const { data, isLoading, refresh } = useLoader(
    async () => {
      const stats = await fetchDashboardData(range);
      return getDashboardChartConfig(stats, range);
    },
    [range]
  );

  // refresh data every 25 mins
  useInterval(() => {
    if (!!data) refresh();
  }, 25 * 60 * 60 * 1000);

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <TimeRangeSelect
          selectedOption={range}
          options={[
            { label: 'Today', value: 'day' },
            { label: 'Last Week', value: 'week' },
            { label: 'Last Month', value: 'month' },
            { label: 'Last Year', value: 'year' }
          ]}
          onChange={setRange}
        />

        {isLoading ? (
          <Spinner />
        ) : (
          data.map(section => {
            const { title, charts } = section;
            return (
              <DashboardSection
                key={title}
                title={title}
                charts={charts}
                isLoading={isLoading}
                range={range}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
export default Dashboard;

/**
 * Returns the options for the charts in the dashboard
 * @param {*} state Redux state
 */
function getDashboardChartConfig(state, range) {
  const {
    totalLengthOfQueuesByType,
    averageTimesTilCompletion,
    estimatedTimesTilCompletion,
    experimentsCount,
    samplesCount,
    jobsByStatus,
    jobsCompletedOverTime,
    samplesAndExperimentsOverTime,
    processorJobsOverTimeByStatus,
    downloaderJobsOverTimeByStatus,
    surveyJobsOverTimeByStatus
  } = {
    samplesCount: chartSelectors.getSamplesCount(state),
    experimentsCount: chartSelectors.getExperimentsCount(state),
    samplesAndExperimentsOverTime: chartSelectors.getSamplesAndExperimentsCreatedOverTime(
      state,
      range
    ),
    jobsCompletedOverTime: chartSelectors.getJobsCompletedOverTime(
      state,
      range
    ),
    totalLengthOfQueuesByType: chartSelectors.getTotalLengthOfQueuesByType(
      state
    ),
    averageTimesTilCompletion: chartSelectors.getAllAverageTimeTilCompletion(
      state
    ),
    estimatedTimesTilCompletion: chartSelectors.getAllEstimatedTimeTilCompletion(
      state
    ),
    jobsByStatus: chartSelectors.getJobsByStatus(state),
    processorJobsOverTimeByStatus: chartSelectors.getJobsByStatusOverTime(
      state.processor_jobs.timeline,
      range
    ),
    surveyJobsOverTimeByStatus: chartSelectors.getJobsByStatusOverTime(
      state.survey_jobs.timeline,
      range
    ),
    downloaderJobsOverTimeByStatus: chartSelectors.getJobsByStatusOverTime(
      state.downloader_jobs.timeline,
      range
    )
  };

  return [
    {
      title: 'Experiments and Samples',
      charts: [
        {
          title: 'Total Experiments Created',
          data: experimentsCount,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Total Samples Created',
          data: samplesCount,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Samples and Experiments Created Over Time',
          data: samplesAndExperimentsOverTime,
          series: ['experiments', 'samples'],
          type: 'line',
          size: 'large'
        }
      ]
    },
    {
      title: 'Jobs',
      charts: [
        {
          title: 'Jobs Over Time by Type',
          data: jobsCompletedOverTime,
          type: 'line',
          series: ['survey', 'processor', 'downloader'],
          size: 'large'
        },
        {
          title: 'Total Length of Queues by Type',
          data: totalLengthOfQueuesByType,
          type: 'pie',
          size: 'medium'
        },
        {
          title: 'Survey Jobs by Status',
          data: jobsByStatus.survey_jobs,
          type: 'pie',
          size: 'medium'
        },
        {
          title: 'Processor Jobs by Status',
          data: jobsByStatus.processor_jobs,
          type: 'pie',
          size: 'medium'
        },
        {
          title: 'Downloader Jobs by Status',
          data: jobsByStatus.downloader_jobs,
          type: 'pie',
          size: 'medium'
        },
        {
          title: 'Average Time: Survey Jobs',
          data: averageTimesTilCompletion.survey_jobs,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Estimated Time Till Completion: Survey Jobs',
          data: estimatedTimesTilCompletion.survey_jobs,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Average Time: Processor Jobs',
          data: averageTimesTilCompletion.processor_jobs,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Estimated Time Till Completion: Processor Jobs',
          data: estimatedTimesTilCompletion.processor_jobs,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Average Time: Downloader Jobs',
          data: averageTimesTilCompletion.downloader_jobs,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Estimated Time Till Completion: Downloader Jobs',
          data: estimatedTimesTilCompletion.downloader_jobs,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Processor Jobs Over Time by Status',
          data: processorJobsOverTimeByStatus,
          type: 'line',
          series: ['pending', 'open', 'completed', 'failed'],
          size: 'large'
        },
        {
          title: 'Survey Jobs Over Time by Status',
          data: surveyJobsOverTimeByStatus,
          type: 'line',
          series: ['pending', 'open', 'completed', 'failed'],
          size: 'large'
        },
        {
          title: 'Downloader Jobs Over Time by Status',
          data: downloaderJobsOverTimeByStatus,
          type: 'line',
          series: ['pending', 'open', 'completed', 'failed'],
          size: 'large'
        }
      ]
    }
  ];
}

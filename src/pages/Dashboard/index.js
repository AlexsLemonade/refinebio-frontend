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

  // refresh data every 10 mins
  useInterval(() => {
    if (!!data) refresh();
  }, 10 * 60 * 1000);

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

        {!data ? (
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
    processorJobsOverTimeByStatus,
    downloaderJobsOverTimeByStatus,
    surveyJobsOverTimeByStatus
  } = {
    samplesCount: chartSelectors.getSamplesCount(state),
    experimentsCount: chartSelectors.getExperimentsCount(state),
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
          title: 'Total experiments created',
          data: experimentsCount,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Total samples created',
          data: state.samples.total + state.processed_samples.total,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Total samples processed',
          data: state.processed_samples.total,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Samples created and processed over time',
          data: chartSelectors.getSamplesOverTime(state, range),
          series: ['unprocessed', 'processed'],
          type: 'area',
          size: 'large'
        },
        {
          title: 'Experiments created over time',
          data: chartSelectors.getExperimentsCreatedOverTime(state, range),
          series: ['experiments'],
          type: 'line',
          size: 'large'
        }
      ]
    },
    {
      title: 'Downloads',
      charts: [
        {
          title: 'Total datasets processed',
          data: state.dataset.total,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Aggregate',
          data: [
            {
              name: 'Experiment',
              value: state.dataset.aggregated_by_experiment
            },
            {
              name: 'Species',
              value: state.dataset.aggregated_by_species
            }
          ],
          type: 'pie',
          size: 'medium'
        },
        {
          title: 'Transformation',
          data: [
            {
              name: 'None',
              value: state.dataset.scale_by_none
            },
            {
              name: 'Minmax',
              value: state.dataset.aggregated_by_minmax
            },
            {
              name: 'Standard',
              value: state.dataset.aggregated_by_standard
            },
            {
              name: 'Robust',
              value: state.dataset.aggregated_by_robust
            }
          ],
          type: 'pie',
          size: 'medium'
        },
        {
          title: "Dataset's processed over time",
          data: chartSelectors.getDatasetsOverTime(state, range),
          series: ['total'],
          type: 'line',
          size: 'large'
        },
        {
          title: 'Volume of data downloaded over time',
          data: chartSelectors.getVolumeOfDataOverTime(state, range),
          series: ['total_size'],
          type: 'line',
          size: 'large'
        }
      ]
    },
    {
      title: 'Jobs',
      charts: [
        {
          title: 'Jobs over time by type',
          data: jobsCompletedOverTime,
          type: 'line',
          series: ['survey', 'processor', 'downloader'],
          size: 'large'
        },
        {
          title: 'Total length of queues by type',
          data: totalLengthOfQueuesByType,
          type: 'pie',
          size: 'medium'
        },
        {
          title: 'Survey jobs by status',
          data: jobsByStatus.survey_jobs,
          type: 'pie',
          size: 'medium'
        },
        {
          title: 'Processor jobs by status',
          data: jobsByStatus.processor_jobs,
          type: 'pie',
          size: 'medium'
        },
        {
          title: 'Downloader jobs by status',
          data: jobsByStatus.downloader_jobs,
          type: 'pie',
          size: 'medium'
        },
        {
          title: 'Average time: Survey jobs',
          data: averageTimesTilCompletion.survey_jobs,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Estimated time till completion: Survey jobs',
          data: estimatedTimesTilCompletion.survey_jobs,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Average Time: Processor jobs',
          data: averageTimesTilCompletion.processor_jobs,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Estimated time till completion: Processor jobs',
          data: estimatedTimesTilCompletion.processor_jobs,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Average Time: Downloader jobs',
          data: averageTimesTilCompletion.downloader_jobs,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Estimated time till completion: Downloader jobs',
          data: estimatedTimesTilCompletion.downloader_jobs,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Processor jobs over time by status',
          data: processorJobsOverTimeByStatus,
          type: 'line',
          series: ['pending', 'open', 'completed', 'failed'],
          size: 'large'
        },
        {
          title: 'Survey jobs over time by status',
          data: surveyJobsOverTimeByStatus,
          type: 'line',
          series: ['pending', 'open', 'completed', 'failed'],
          size: 'large'
        },
        {
          title: 'Downloader jobs over time by status',
          data: downloaderJobsOverTimeByStatus,
          type: 'line',
          series: ['pending', 'open', 'completed', 'failed'],
          size: 'large'
        }
      ]
    }
  ];
}

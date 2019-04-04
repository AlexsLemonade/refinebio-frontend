import React from 'react';
import * as chartSelectors from './chartSelectors';
import DashboardSection from './DashboardSection';
import TimeRangeSelect from '../../components/TimeRangeSelect';
import { useLoader } from '../../components/Loader';
import { useInterval } from '../../common/hooks';
import { fetchDashboardData } from '../../api/dashboad';
import Spinner from '../../components/Spinner';
import ServerErrorPage from '../ServerError';
import { getQueryParamObject, formatBytes } from '../../common/helpers';
import './Dashboard.scss';

function Dashboard(props) {
  const [chartUpdating, setChartUpdating] = React.useState(true);
  let { range: rangeParam } = getQueryParamObject(props.location.search);
  if (!['day', 'week', 'month', 'year'].includes(rangeParam)) {
    rangeParam = 'day';
  }
  const [range, setRange] = React.useState(rangeParam);
  const { data, refresh, hasError } = useLoader(
    async () => {
      const stats = await fetchDashboardData(range);
      setChartUpdating(false);
      return getDashboardChartConfig(stats, range);
    },
    [range]
  );

  // refresh data every 10 mins
  useInterval(() => {
    if (!!data) refresh();
  }, 10 * 60 * 1000);

  if (hasError) {
    return <ServerErrorPage />;
  }

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
          onChange={range => {
            setChartUpdating(true);
            setRange(range);
          }}
        />

        {!data || chartUpdating ? (
          <Spinner />
        ) : (
          data.map(section => {
            const { title, charts } = section;
            return (
              <DashboardSection
                key={title}
                title={title}
                charts={charts}
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
    jobsByStatus,
    jobsCompletedOverTime,
    processorJobsOverTimeByStatus,
    downloaderJobsOverTimeByStatus,
    surveyJobsOverTimeByStatus
  } = {
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
          data: state.unprocessed_samples.total + state.processed_samples.total,
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
          title: 'Samples processed over time',
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
              value: state.dataset.scale_by_minmax
            },
            {
              name: 'Standard',
              value: state.dataset.scale_by_standard
            },
            {
              name: 'Robust',
              value: state.dataset.scale_by_robust
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
          size: 'large',
          formatValue: x => formatBytes(x)
        }
      ]
    },
    {
      title: 'Nomad Jobs (from nomad service)',
      charts: [
        {
          title: 'Running jobs',
          data: state.nomad_running_jobs,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Pending jobs',
          data: state.nomad_pending_jobs,
          type: 'text',
          size: 'small'
        },
        {
          title: 'Jobs by type',
          data: jobsCompletedOverTime,
          type: 'bar',
          series: ['running', 'pending'],
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

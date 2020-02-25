import React from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';
import * as chartSelectors from './chartSelectors';
import DashboardSection from './DashboardSection';
import TimeRangeSelect from '../../components/TimeRangeSelect';
import { useLoader } from '../../components/Loader';
import { useInterval } from '../../common/hooks';
import { fetchDashboardData } from '../../api/dashboad';
import Spinner from '../../components/Spinner';
import ServerErrorPage from '../ServerError';
import { formatBytes } from '../../common/helpers';

function Dashboard(props) {
  const router = useRouter();
  const [chartUpdating, setChartUpdating] = React.useState(true);
  let { range: rangeParam } = router.query;
  if (!['day', 'week', 'month', 'year'].includes(rangeParam)) {
    rangeParam = 'day';
  }
  const [range, setRange] = React.useState(rangeParam);
  const { data, refresh, hasError } = useLoader(async () => {
    const stats = await fetchDashboardData(range);
    setChartUpdating(false);
    return {
      charts: getDashboardChartConfig(stats, range),
      generatedOn: stats.generated_on,
    };
  }, [range]);

  // refresh data every 10 mins
  useInterval(() => {
    if (data) refresh();
  }, 10 * 60 * 1000);

  if (hasError) {
    return <ServerErrorPage />;
  }

  return (
    <div className="dashboard layout__content">
      <div className="dashboard__container">
        <TimeRangeSelect
          selectedOption={range}
          options={[
            { label: 'Today', value: 'day' },
            { label: 'Last Week', value: 'week' },
            { label: 'Last Month', value: 'month' },
            { label: 'Last Year', value: 'year' },
          ]}
          onChange={range => {
            setChartUpdating(true);
            setRange(range);
          }}
        />

        <DashboardUpdatedOn time={data && data.generatedOn} />

        {!data || chartUpdating ? (
          <Spinner />
        ) : (
          data.charts.map(section => {
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

function DashboardUpdatedOn({ time }) {
  let result = 'Updated ...';
  if (time) {
    const duration = moment.duration(moment().diff(time)).humanize();
    result = `Updated ${duration} ago`;
  }
  return <p>{result}</p>;
}

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
    surveyJobsOverTimeByStatus,
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
    ),
  };

  return [
    {
      title: 'Experiments and Samples',
      charts: [
        {
          title: 'Total experiments surveyed',
          data: experimentsCount,
          type: 'text',
          size: 'small',
        },
        {
          title: 'Total samples surveyed',
          data: state.unprocessed_samples.total + state.processed_samples.total,
          type: 'text',
          size: 'small',
        },
        {
          title: 'Total samples available for download',
          data: state.processed_samples.total,
          type: 'text',
          size: 'small',
        },
        {
          title: 'Downloadable Samples over time',
          data: chartSelectors.getProcessedSamplesOverTime(state, range),
          series: ['total'],
          type: 'area',
          size: 'large',
        },
        {
          title: 'Surveyed Samples over time',
          data: chartSelectors.getUnprocessedSamplesOverTime(state, range),
          series: ['total'],
          type: 'area',
          size: 'large',
        },
        {
          title: 'Experiments surveyed',
          data: chartSelectors.getExperimentsCreatedOverTime(state, range),
          series: ['experiments'],
          type: 'line',
          size: 'large',
        },
      ],
    },
    {
      title: 'Current Nomad Jobs (from service)',
      charts: [
        {
          title: 'Running jobs',
          data: state.nomad_running_jobs,
          type: 'text',
          size: 'small',
        },
        {
          title: 'Pending jobs',
          data: state.nomad_pending_jobs,
          type: 'text',
          size: 'small',
        },
        {
          title: 'Running jobs by type',
          data: chartSelectors.getJobsByType(
            state.nomad_running_jobs_by_type,
            state.nomad_pending_jobs_by_type
          ),
          type: 'bar',
          series: ['running', 'pending'],
          size: 'large',
        },
        {
          title: 'Running jobs by volume',
          data: chartSelectors.getJobsByType(
            state.nomad_running_jobs_by_volume,
            state.nomad_pending_jobs_by_volume
          ),
          type: 'bar',
          series: ['running', 'pending'],
          size: 'large',
        },
      ],
    },
    {
      title: 'Jobs',
      charts: [
        {
          title: 'Jobs over time by type',
          data: jobsCompletedOverTime,
          type: 'line',
          series: ['surveyor', 'processor', 'downloader'],
          size: 'large',
        },
        {
          title: 'Total length of queues by type',
          data: totalLengthOfQueuesByType,
          type: 'pie',
          size: 'medium',
        },
        {
          title: 'Surveyor jobs by status',
          data: jobsByStatus.survey_jobs,
          type: 'pie',
          size: 'medium',
        },
        {
          title: 'Processor jobs by status',
          data: jobsByStatus.processor_jobs,
          type: 'pie',
          size: 'medium',
        },
        {
          title: 'Downloader jobs by status',
          data: jobsByStatus.downloader_jobs,
          type: 'pie',
          size: 'medium',
        },
        {
          title: 'Average time: Surveyor jobs',
          data: averageTimesTilCompletion.survey_jobs,
          type: 'text',
          size: 'small',
        },
        {
          title: 'Estimated time till completion: Surveyor jobs',
          data: estimatedTimesTilCompletion.survey_jobs,
          type: 'text',
          size: 'small',
        },
        {
          title: 'Average Time: Processor jobs',
          data: averageTimesTilCompletion.processor_jobs,
          type: 'text',
          size: 'small',
        },
        {
          title: 'Estimated time till completion: Processor jobs',
          data: estimatedTimesTilCompletion.processor_jobs,
          type: 'text',
          size: 'small',
        },
        {
          title: 'Average Time: Downloader jobs',
          data: averageTimesTilCompletion.downloader_jobs,
          type: 'text',
          size: 'small',
        },
        {
          title: 'Estimated time till completion: Downloader jobs',
          data: estimatedTimesTilCompletion.downloader_jobs,
          type: 'text',
          size: 'small',
        },
        {
          title: 'Processor jobs over time by status',
          data: processorJobsOverTimeByStatus,
          type: 'line',
          series: chartSelectors.JOB_STATUS,
          size: 'large',
        },
        {
          title: 'Surveyor jobs over time by status',
          data: surveyJobsOverTimeByStatus,
          type: 'line',
          series: chartSelectors.JOB_STATUS,
          size: 'large',
        },
        {
          title: 'Downloader jobs over time by status',
          data: downloaderJobsOverTimeByStatus,
          type: 'line',
          series: chartSelectors.JOB_STATUS,
          size: 'large',
        },
      ],
    },
    {
      title: 'Downloads',
      charts: [
        {
          title: 'Total datasets processed',
          data: state.dataset.total,
          type: 'text',
          size: 'small',
        },
        {
          title: 'Aggregate',
          data: [
            {
              name: 'Experiment',
              value: state.dataset.aggregated_by_experiment,
            },
            {
              name: 'Species',
              value: state.dataset.aggregated_by_species,
            },
          ],
          type: 'pie',
          size: 'medium',
        },
        {
          title: 'Transformation',
          data: [
            {
              name: 'None',
              value: state.dataset.scale_by_none,
            },
            {
              name: 'Minmax',
              value: state.dataset.scale_by_minmax,
            },
            {
              name: 'Standard',
              value: state.dataset.scale_by_standard,
            },
            {
              name: 'Robust',
              value: state.dataset.scale_by_robust,
            },
          ],
          type: 'pie',
          size: 'medium',
        },
        {
          title: "Dataset's processed over time",
          data: chartSelectors.getDatasetsOverTime(state, range),
          series: ['total'],
          type: 'line',
          size: 'large',
        },
        {
          title: 'Volume of data downloaded over time',
          data: chartSelectors.getVolumeOfDataOverTime(state, range),
          series: ['total_size'],
          type: 'line',
          size: 'large',
          formatValue: x => formatBytes(x),
        },
      ],
    },
  ];
}

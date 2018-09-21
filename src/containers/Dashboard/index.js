import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import * as actions from '../../state/dashboard/actions';
import * as chartSelectors from '../../state/dashboard/reducer';
import DashboardSection from './DashboardSection';
import TimeRangeSelect from '../../components/TimeRangeSelect';
import Loader from '../../components/Loader';
import { timeout } from '../../common/helpers';

import './Dashboard.scss';

class Dashboard extends Component {
  _liveUpdate = true;

  state = {
    timeRange: 'year',
    firstRender: true
  };

  componentWillUnmount() {
    // disable live updates after the component is unmounted
    this._liveUpdate = false;
  }

  async updateData() {
    await Promise.all([
      this.props.fetchDashboardData(this.state.timeRange)
      // this.props.updatedTimeRange(this.state.timeRange)
    ]);
    this.setState({ firstRender: false });

    // this._startLiveUpdate();
  }

  async _startLiveUpdate() {
    await timeout(5000);
    if (this._liveUpdate) {
      // update the data again, after a timeout
      this.updateData();
    }
  }

  render() {
    const { chartConfig } = this.props;

    return (
      <div className="dashboard">
        <Helmet>
          <title>refine.bio - Dashboard</title>
        </Helmet>
        <div className="dashboard__container">
          <TimeRangeSelect
            initialValues={{ timeRange: this.state.timeRange }}
            options={[
              { label: 'Today', value: 'day' },
              { label: 'Last Week', value: 'week' },
              { label: 'Last Month', value: 'month' },
              { label: 'Last Year', value: 'year' }
            ]}
            selectedTimeRange={range => this.setState({ timeRange: range })}
          />

          <Loader fetch={() => this.updateData()}>
            {({ isLoading }) =>
              this.state.firstRender ? (
                <div className="loader" />
              ) : (
                chartConfig().map((section, i) => {
                  const { title, charts } = section;
                  return (
                    <DashboardSection
                      key={i}
                      title={title}
                      charts={charts}
                      isLoading={isLoading}
                    />
                  );
                })
              )
            }
          </Loader>
        </div>
      </div>
    );
  }
}
Dashboard = connect(
  state => ({
    timeRangeForm: state.form.timeRange,
    isLoading: state.dashboard.isLoading,
    timeOptions: state.dashboard.timeOptions,
    chartConfig: () => getDashboardChartConfig(state)
  }),
  actions
)(Dashboard);
export default Dashboard;

/**
 * Returns the options for the charts in the dashboard
 * @param {*} state Redux state
 */
function getDashboardChartConfig(state) {
  const {
    totalLengthOfQueuesByType,
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
      state
    ),
    jobsCompletedOverTime: chartSelectors.getJobsCompletedOverTime(state),
    totalLengthOfQueuesByType: chartSelectors.getTotalLengthOfQueuesByType(
      state
    ),
    estimatedTimesTilCompletion: chartSelectors.getAllEstimatedTimeTilCompletion(
      state
    ),
    jobsByStatus: chartSelectors.getJobsByStatus(state)
    // processorJobsOverTimeByStatus: chartSelectors.getJobsByStatusOverTime(
    //   state,
    //   'processor'
    // ),
    // surveyJobsOverTimeByStatus: chartSelectors.getJobsByStatusOverTime(
    //   state,
    //   'survey'
    // ),
    // downloaderJobsOverTimeByStatus: chartSelectors.getJobsByStatusOverTime(
    //   state,
    //   'downloader'
    // )
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
          title: 'Estimated Time Till Completion: Survey Jobs',
          data: estimatedTimesTilCompletion.survey_jobs,
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
          title: 'Estimated Time Till Completion: Downloader Jobs',
          data: estimatedTimesTilCompletion.downloader_jobs,
          type: 'text',
          size: 'small'
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
        }
        // {
        //   title: 'Processor Jobs Over Time by Status',
        //   data: processorJobsOverTimeByStatus,
        //   type: 'line',
        //   series: ['pending', 'open', 'completed', 'failed'],
        //   size: 'large'
        // },
        // {
        //   title: 'Survey Jobs Over Time by Status',
        //   data: surveyJobsOverTimeByStatus,
        //   type: 'line',
        //   series: ['pending', 'open', 'completed', 'failed'],
        //   size: 'large'
        // },
        // {
        //   title: 'Downloader Jobs Over Time by Status',
        //   data: downloaderJobsOverTimeByStatus,
        //   type: 'line',
        //   series: ['pending', 'open', 'completed', 'failed'],
        //   size: 'large'
        // }
      ]
    }
  ];
}

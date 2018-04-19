import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../state/dashboard/actions';
import * as chartSelectors from '../../state/dashboard/reducer';
import DashboardSection from './DashboardSection';
import TimeRangeSelect from '../../components/TimeRangeSelect';

import './Dashboard.scss';

class Dashboard extends Component {
  componentWillMount() {
    const {
      timeOptions: { range },
      updatedTimeRange,
      fetchDashboardData
    } = this.props;

    fetchDashboardData();

    // data live reloads every 5 seconds
    this.intervalId = setInterval(
      (function fetchData() {
        updatedTimeRange(range);
        return fetchData;
      })(),
      5000
    );
  }

  handleSelectChange = range => {
    const { selectedTimeRange, updatedTimeRange } = this.props;
    clearInterval(this.intervalId);
    selectedTimeRange(range);

    this.intervalId = setInterval(
      (function fetchData() {
        updatedTimeRange(range);
        return fetchData;
      })(),
      5000
    );
  };

  render() {
    const {
      totalLengthOfQueuesByType,
      estimatedTimesTilCompletion,
      experimentsCount,
      samplesCount,
      jobsByStatus,
      jobsCompletedOverTime,
      timeOptions,
      samplesOverTime,
      processorJobsOverTimeByStatus,
      downloaderJobsOverTimeByStatus,
      surveyJobsOverTimeByStatus,
      isLoading
    } = this.props;

    const chartsConfig = [
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
            data: samplesOverTime,
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

    return (
      <div className="dashboard">
        <div className="dashboard__container">
          <TimeRangeSelect
            initialValues={{ timeRange: timeOptions.range }}
            options={[
              { label: 'Today', value: 'day' },
              { label: 'Last Week', value: 'week' },
              { label: 'Last Month', value: 'month' },
              { label: 'Last Year', value: 'year' }
            ]}
            selectedTimeRange={this.handleSelectChange}
          />
          {chartsConfig.map((section, i) => {
            const { title, charts } = section;
            return (
              <DashboardSection
                key={i}
                title={title}
                charts={charts}
                isLoading={isLoading}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    timeRangeForm: state.form.timeRange,
    isLoading: state.dashboard.isLoading,
    timeOptions: state.dashboard.timeOptions,
    totalLengthOfQueuesByType: chartSelectors.getTotalLengthOfQueuesByType(
      state
    ),
    jobsByStatus: chartSelectors.getJobsByStatus(state),
    estimatedTimesTilCompletion: chartSelectors.getAllEstimatedTimeTilCompletion(
      state,
      'processor_jobs'
    ),
    experimentsCount: chartSelectors.getExperimentsCount(state),
    samplesCount: chartSelectors.getSamplesCount(state),
    jobsCompletedOverTime: chartSelectors.getJobsCompletedOverTime(state),
    samplesOverTime: chartSelectors.getSamplesCreatedOverTime(state),
    processorJobsOverTimeByStatus: chartSelectors.getJobsByStatusOverTime(
      state,
      'processor'
    ),
    surveyJobsOverTimeByStatus: chartSelectors.getJobsByStatusOverTime(
      state,
      'survey'
    ),
    downloaderJobsOverTimeByStatus: chartSelectors.getJobsByStatusOverTime(
      state,
      'downloader'
    )
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actions, dispatch);
};

const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(
  Dashboard
);

export default DashboardContainer;

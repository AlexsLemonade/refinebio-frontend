import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/dashboard';
import * as chartSelectors from '../../reducers/dashboard';
import DashboardItem from '../../components/DashboardItem';
import TimeRangeSelect from '../../components/TimeRangeSelect';

import './Dashboard.scss';

class Dashboard extends Component {
  componentWillMount() {
    const { timeOptions: { range }, updatedTimeRange } = this.props;
    updatedTimeRange(range);
  }

  render() {
    const {
      totalLengthOfQueuesByType,
      estimatedTimesTilCompletion,
      experimentsCount,
      samplesCount,
      jobsByStatus,
      jobsCompletedOverTime,
      updatedTimeRange,
      timeOptions,
      samplesOverTime
    } = this.props;

    const chartsConfig = [
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
        title: 'Jobs Over Time by Type',
        data: samplesOverTime,
        series: ['experiments', 'samples'],
        type: 'line',
        size: 'large'
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
            updatedTimeRange={updatedTimeRange}
          />
          <div className="dashboard__grid">
            {chartsConfig.map((chart, i) => {
              const { type, title, data, size, series } = chart;
              return (
                <DashboardItem
                  key={i}
                  type={type}
                  data={data}
                  title={title}
                  size={size}
                  series={series}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    timeRangeForm: state.form.timeRange,
    timeOptions: state.dashboard.timeOptions,
    totalLengthOfQueuesByType: chartSelectors.getTotalLengthofQueuesByType(
      state
    ),
    jobsByStatus: chartSelectors.getJobsByStatusStatus(state),
    estimatedTimesTilCompletion: chartSelectors.getAllEstimatedTimeTilCompletion(
      state,
      'processor_jobs'
    ),
    experimentsCount: chartSelectors.getExperimentsCount(state),
    samplesCount: chartSelectors.getSamplesCount(state),
    jobsCompletedOverTime: chartSelectors.getJobsCompletedOverTime(state),
    samplesOverTime: chartSelectors.getSamplesCreatedOverTime(state)
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actions, dispatch);
};

const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(
  Dashboard
);

export default DashboardContainer;

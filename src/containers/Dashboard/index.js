import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/dashboard';
import * as chartSelectors from '../../reducers/dashboard';
import DashboardItem from '../../components/DashboardItem';

import './Dashboard.scss';

class Dashboard extends Component {
  componentWillMount() {
    this.props.fetchDashboardData();
  }

  render() {
    const {
      totalLengthOfQueuesByType,
      estimatedTimesTilCompletion,
      experimentsCount,
      samplesCount,
      jobsByStatus
    } = this.props;

    const chartsConfig = [
      {
        title: 'Total Length of Queues by Type',
        data: totalLengthOfQueuesByType,
        type: 'pie',
        size: 'one-one'
      },
      {
        title: 'Survey Jobs by Status',
        data: jobsByStatus.survey_jobs,
        type: 'pie',
        size: 'one-one'
      },
      {
        title: 'Processor Jobs by Status',
        data: jobsByStatus.processor_jobs,
        type: 'pie',
        size: 'one-one'
      },
      {
        title: 'Downloader Jobs by Status',
        data: jobsByStatus.downloader_jobs,
        type: 'pie',
        size: 'one-one'
      },
      {
        title: 'Estimated Time Till Completion: Processor Jobs',
        data: estimatedTimesTilCompletion.processor_jobs,
        type: 'text',
        size: 'two-one'
      },
      {
        title: 'Estimated Time Till Completion: Survey Jobs',
        data: estimatedTimesTilCompletion.survey_jobs,
        type: 'text',
        size: 'two-one'
      },
      {
        title: 'Estimated Time Till Completion: Downloader Jobs',
        data: estimatedTimesTilCompletion.downloader_jobs,
        type: 'text',
        size: 'two-one'
      },
      {
        title: 'Total Experiments Created',
        data: experimentsCount,
        type: 'text',
        size: 'two-one'
      },
      {
        title: 'Total Samples Created',
        data: samplesCount,
        type: 'text',
        size: 'two-one'
      }
    ];

    return (
      <div className="dashboard">
        <div className="dashboard__container">
          {chartsConfig.map((chart, i) => {
            const { type, title, data, size } = chart;
            return (
              <DashboardItem
                key={i}
                type={type}
                data={data}
                title={title}
                size={size}
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
    totalLengthOfQueuesByType: chartSelectors.getTotalLengthofQueuesByType(
      state
    ),
    jobsByStatus: chartSelectors.getJobsByStatusStatus(state),
    estimatedTimesTilCompletion: chartSelectors.getAllEstimatedTimeTilCompletion(
      state,
      'processor_jobs'
    ),
    experimentsCount: chartSelectors.getExperimentsCount(state),
    samplesCount: chartSelectors.getSamplesCount(state)
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actions, dispatch);
};

const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(
  Dashboard
);

export default DashboardContainer;

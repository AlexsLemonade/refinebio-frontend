import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/dashboard';
import * as chartSelectors from '../../reducers/dashboard';
import ResponsiveChart, { PieChart } from '../../components/ResponsiveChart';

class Dashboard extends Component {
  componentWillMount() {
    this.props.fetchDashboardData();
  }

  render() {
    const {
      totalLengthOfQueuesByType,
      estimatedTimesTilCompletion
    } = this.props;

    return (
      <div className="Dashboard">
        <h2>Total Estimated Time Til Completion for Processor Jobs</h2>
        <h3>{estimatedTimesTilCompletion.processor_jobs}</h3>
        <h2>Total Estimated Time Til Completion for survey Jobs</h2>
        <h3>{estimatedTimesTilCompletion.survey_jobs}</h3>
        <h2>Total Estimated Time Til Completion for downloader Jobs</h2>
        <h3>{estimatedTimesTilCompletion.downloader_jobs}</h3>
        <h2>Total Length of Queues by Type</h2>
        <ResponsiveChart>
          <PieChart data={totalLengthOfQueuesByType} />
        </ResponsiveChart>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    totalLengthOfQueuesByType: chartSelectors.getTotalLengthofQueuesByType(
      state
    ),
    estimatedTimesTilCompletion: chartSelectors.getAllEstimatedTimeTilCompletion(
      state,
      'processor_jobs'
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

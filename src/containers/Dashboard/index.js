import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/dashboard';
import * as chartSelectors from '../../reducers/dashboard';
import ResponsiveChart from '../../components/ResponsiveChart';

import * as styles from './Dashboard.module.scss';

class Dashboard extends Component {
  componentWillMount() {
    this.props.fetchDashboardData();
  }

  render() {
    const {
      totalLengthOfQueuesByType,
      estimatedTimesTilCompletion,
      experimentsCount,
      samplesCount
    } = this.props;

    const chartsConfig = [
      {
        title: 'Total Estimated Time Till Completion: Processor Jobs',
        data: estimatedTimesTilCompletion.processor_jobs,
        type: 'text'
      },
      {
        title: 'Total Estimated Time Till Completion: Survey Jobs',
        data: estimatedTimesTilCompletion.survey_jobs,
        type: 'text'
      },
      {
        title: 'Total Estimated Time Till Completion: Downloader Jobs',
        data: estimatedTimesTilCompletion.downloader_jobs,
        type: 'text'
      },
      {
        title: 'Total Experiments Created',
        data: experimentsCount,
        type: 'text'
      },
      {
        title: 'Total Samples Created',
        data: samplesCount,
        type: 'text'
      },
      {
        title: 'Total Length of Queues by Type',
        data: totalLengthOfQueuesByType,
        type: 'pie'
      }
    ];

    return (
      <div className={styles.dashboard}>
        <div className={styles.container}>
          {chartsConfig.map((chart, i) => {
            const { type, title, data } = chart;
            return (
              <ResponsiveChart key={i} type={type} data={data} title={title} />
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

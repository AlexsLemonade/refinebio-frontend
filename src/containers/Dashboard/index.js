import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import * as actions from '../../actions/dashboard';
import * as chartSelectors from '../../reducers/dashboard';

class Dashboard extends Component {
  componentWillMount() {
    this.props.fetchDashboardData();
  }

  render() {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const { totalLengthOfQueuesByType } = this.props;

    return (
      <div className="Dashboard">
        <h2>Total Length of Queues by Type</h2>
        <div
          style={{
            paddingBottom: '50%',
            width: '50%',
            position: 'relative',
            height: 0
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%'
            }}
          >
            <ResponsiveContainer>
              <PieChart>
                <Tooltip />
                <Pie
                  data={totalLengthOfQueuesByType}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={'100%'}
                  fill="#8884d8"
                >
                  {totalLengthOfQueuesByType.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { dashboard } = state;
  return {
    totalLengthOfQueuesByType: chartSelectors.getTotalLengthofQueuesByType(
      state
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

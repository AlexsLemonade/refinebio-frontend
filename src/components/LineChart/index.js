import React from 'react';
import {
  ResponsiveContainer,
  LineChart as LineRechart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  Legend
} from 'recharts';
import moment from 'moment';

const COLORS = ['#36AEB5', '#3CC7B0', '#65DDA1', '#9BF18D'];

const LineChart = props => {
  const { data = [] } = props;

  function formatXAxis(tickItem) {
    return moment(tickItem).format('MMM Do hh:mm');
  }

  return (
    <ResponsiveContainer>
      <LineRechart
        data={data}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <XAxis dataKey="date" tickFormatter={formatXAxis} />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="survey"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="processor"
          stroke="#36AEB5"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="downloader"
          stroke="#65DDA1"
          activeDot={{ r: 8 }}
        />
      </LineRechart>
    </ResponsiveContainer>
  );
};

export default LineChart;

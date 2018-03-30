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

const COLORS = ['#36AEB5', '#3CC7B0', '#65DDA1', '#9BF18D'];

const LineChart = props => {
  /*const { data = [] } = props;
  console.log(data);*/
  const data = [
    { x: '06-09', y: 2.978 },
    { x: '06-10', y: 2.973 },
    { x: '06-11', y: 2.964 },
    { x: '06-12', y: 2.955 },
    { x: '06-13', y: 2.937 },
    { x: '06-14', y: 2.919 },
    { x: '06-15', y: 2.902 }
  ];

  return (
    <ResponsiveContainer>
      <LineRechart
        data={data}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <XAxis dataKey="x" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="y"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineRechart>
    </ResponsiveContainer>
  );
};

export default LineChart;

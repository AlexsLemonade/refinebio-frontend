// @flow
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

const COLORS = ['#D094CE', '#41E0AD', '#59C4EB', '#EA7576', '#D8AE41'];

type Props = {
  series: Array<string>,
  data: Array<{ date: string }>
};

const LineChart = (props: Props) => {
  const { data = [], series = [] } = props;
  console.log(series);

  function formatXAxis(tickItem) {
    return moment(tickItem).format('MMM Do hh:mm');
  }

  function renderCustomTooltip(args) {
    console.log(args);
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
        {series.map((set, i) => (
          <Line key={i} type="monotone" dataKey={set} stroke={COLORS[i]} />
        ))}
      </LineRechart>
    </ResponsiveContainer>
  );
};

export default LineChart;

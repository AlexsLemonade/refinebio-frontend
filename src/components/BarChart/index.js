// @flow
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { COLORS } from '../../common/constants';

export default props => {
  const { data = [], series = [] } = props;

  return (
    <ResponsiveContainer>
      <BarChart
        data={data}
        height={400}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tickFormatter={props.formatLabel} />
        <YAxis tickFormatter={props.formatValue} />
        <Tooltip />
        {series.length > 1 && <Legend />}
        {series.map((set, i) => (
          <Bar key={set} dataKey={set} fill={COLORS[i]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

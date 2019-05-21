// @flow
import React from 'react';
import {
  ResponsiveContainer,
  AreaChart as AreaRechart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
} from 'recharts';
import { COLORS } from '../../common/constants';

type Props = {
  series: Array<string>,
  data: Array<{ date: string }>,
  isLoading: boolean,
  formatValue: Function,
  formatLabel: Function,
};

const AreaChart = (props: Props) => {
  const { data = [], series = [] } = props;
  return (
    <ResponsiveContainer>
      <AreaRechart
        data={data}
        height={400}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <XAxis dataKey="date" tickFormatter={props.formatLabel} />
        <YAxis tickFormatter={props.formatValue} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        {series.length > 1 && <Legend />}
        {series.map((set, i) => (
          <Area
            key={set}
            type="monotone"
            dataKey={set}
            stroke={COLORS[i]}
            fill={COLORS[i]}
            strokeWidth={2}
            stackId="1"
          />
        ))}
      </AreaRechart>
    </ResponsiveContainer>
  );
};

export default AreaChart;

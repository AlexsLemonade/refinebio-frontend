// @flow
import React from 'react';
import {
  ResponsiveContainer,
  PieChart as PieRechart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { COLORS } from '../../common/constants';

type Props = {
  data: Array<{ value: any, name: string }>
};

const PieChart = (props: Props) => {
  const { data = [] } = props;
  return (
    <ResponsiveContainer>
      <PieRechart>
        <Tooltip />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={'100%'}
          fill="#8884d8"
          paddingAngle={0}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend iconType={'circle'} iconSize={10} />
      </PieRechart>
    </ResponsiveContainer>
  );
};

export default PieChart;

import React from 'react';
import {
  ResponsiveContainer,
  PieChart as PieRechart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieChart = props => {
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
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieRechart>
    </ResponsiveContainer>
  );
};

export default PieChart;

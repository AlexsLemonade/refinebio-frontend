import React, { Component } from 'react';
import {
  ResponsiveContainer,
  PieChart as PieRechart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function PieChart(props) {
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
}

class ResponsiveChart extends Component {
  render() {
    return (
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
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default ResponsiveChart;

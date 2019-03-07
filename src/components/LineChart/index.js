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
import { COLORS } from '../../common/constants';
import Spinner from '../Spinner';

import './LineChart.scss';

type Props = {
  series: Array<string>,
  data: Array<{ date: string }>,
  isLoading: boolean,
  formatValue: Function,
  formatLabel: Function
};

const LineChart = (props: Props) => {
  const { data = [], series = [] } = props;
  return (
    <ResponsiveContainer>
      <LineRechart
        data={data}
        height={400}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <XAxis dataKey="date" tickFormatter={props.formatLabel} />
        <YAxis tickFormatter={props.formatValue} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          content={
            <TooltipContent
              formatLabel={props.formatLabel}
              formatValue={props.formatValue}
            />
          }
        />
        {series.length > 1 && <Legend />}
        {series.map((set, i) => (
          <Line
            isAnimationActive={false}
            key={i}
            type="monotone"
            dataKey={set}
            stroke={COLORS[i]}
            strokeWidth={2}
          />
        ))}
      </LineRechart>
    </ResponsiveContainer>
  );
};

export default LineChart;

function TooltipContent({
  payload,
  label,
  active,
  range,
  formatLabel,
  formatValue
}) {
  if (!active) return null;

  return (
    <div className="tooltip">
      <b>{formatLabel ? formatLabel(label) : label}</b>
      {payload.map(data => (
        <div key={data.name}>
          {data.name}: {formatValue ? formatValue(data.value) : data.value}
        </div>
      ))}
    </div>
  );
}

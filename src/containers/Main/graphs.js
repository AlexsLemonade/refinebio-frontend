import React from 'react';
import { connect } from 'react-redux';
import { formatSentenceCase } from '../../common/helpers';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart
} from 'recharts';
import moment from 'moment';
import { accumulateByKeys } from '../../common/helpers';
import { push } from '../../state/routerActions';
import apiData from '../../apiData.json';

function getSamplesPerSpecies() {
  const { organism } = apiData;
  return Object.keys(organism)
    .map(name => ({
      name: formatSentenceCase(name),
      organism: name,
      samples: organism[name]
    }))
    .sort((x, y) => y.samples - x.samples)
    .slice(0, 20);
}

let SamplesPerSpeciesGraph = ({ push }) => {
  const data = getSamplesPerSpecies();
  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ height: 500 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 30, bottom: 150 }}
          >
            <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} />
            <YAxis
              label={{
                value: 'Number of Samples',
                angle: -90,
                position: 'insideLeft',
                offset: -22
              }}
            />
            <Tooltip />
            <Bar
              dataKey="samples"
              fill="#386db0"
              onClick={({ payload }) =>
                // show all results for a given sample when bar is clicked
                push('/results?organisms__name=' + payload.organism)
              }
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
SamplesPerSpeciesGraph = connect(
  null,
  { push }
)(SamplesPerSpeciesGraph);
export { SamplesPerSpeciesGraph };

function getSamplesOverTime() {
  const { samples } = apiData.stats;
  return accumulateByKeys(samples.timeline, ['total']).filter(
    x => moment(x.start).isAfter('2018-07-01') // only show data after our launch
  );
}

export function SamplesOverTimeGraph() {
  const data = getSamplesOverTime();
  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ height: 500 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
          >
            <XAxis
              dataKey="start"
              tickFormatter={x => moment(x).format('MMM')}
            />
            <YAxis
              label={{
                value: 'Number of Samples',
                angle: -90,
                position: 'insideLeft',
                offset: -24
              }}
            />
            <Tooltip
              label="Total Samples"
              labelFormatter={value => moment(value).format('MMMM')}
            />
            <Line
              dataKey="total"
              type="monotone"
              stroke="#386db0"
              strokeWidth={2}
              label="Total Samples"
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

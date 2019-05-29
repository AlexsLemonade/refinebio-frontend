import React from 'react';
import pick from 'lodash/pick';
import Dropdown from '../../components/Dropdown';
import { formatSentenceCase, numberFormatter } from '../../common/helpers';

const ORGANISMS = 'Organisms';
const TECHNOLOGIES = 'Technologies';

export default function SampleBreakdownBlock({ data }) {
  const [showTechnology, setShowTechnology] = React.useState(false);

  const totalData = getTotalData(
    data.processed_samples.total,
    showTechnology
      ? data.processed_samples.technology
      : data.processed_samples.organism
  );

  return (
    <div className="exec-dash__sample-breakdown">
      <div className="exec-dash__block-header">
        {showTechnology ? (
          <div>Samples by Technology</div>
        ) : (
          <div>Samples by Organisms</div>
        )}
        <div>
          View:{' '}
          <Dropdown
            className=""
            selectedOption={showTechnology ? TECHNOLOGIES : ORGANISMS}
            options={[ORGANISMS, TECHNOLOGIES]}
            onChange={selected => {
              setShowTechnology(selected === TECHNOLOGIES);
            }}
          />
        </div>
      </div>

      <Table data={totalData} />
    </div>
  );
}

function getTotalData(total, data) {
  const topKeys = Object.keys(data)
    .sort((c1, c2) => data[c2] - data[c1])
    .slice(0, 3);
  const totalSelected = topKeys.reduce(
    (accumulator, column) => accumulator + data[column],
    0
  );
  return {
    ...pick(data, topKeys),
    other: total - totalSelected,
  };
}

function Table({ data }) {
  return (
    <div className="exec-dash__numbers-table">
      {Object.keys(data).map(column => (
        <div key={column}>
          <div>{formatSentenceCase(column)}</div>
          <div>{numberFormatter(data[column])}</div>
        </div>
      ))}
    </div>
  );
}

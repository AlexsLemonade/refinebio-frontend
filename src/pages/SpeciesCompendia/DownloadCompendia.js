import React from 'react';
import Dropdown from '../../components/Dropdown';
import { Ajax, formatSentenceCase } from '../../common/helpers';
import { useLoader } from '../../components/Loader';

import groupBy from 'lodash/groupBy';

const DownloadCompendia = props => {
  const { data, isLoading } = useLoader(fetchCompendiaData);

  if (isLoading || data.length === 0) return null;

  return (
    <div className="download-compendia">
      <div>
        <div className="download-compendia__title">Download the Compendia</div>

        <div>
          <span className="download-compendia__choose">Choose Organism</span>
          <Dropdown
            options={data}
            selectedOption={props.selected}
            label={x => formatSentenceCase(x.organism)}
            onChange={selected => {}}
          />
        </div>

        <a
          href={props.selected ? props.selected.url : data[0].url}
          className="button download-compendia__button"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Now
        </a>
      </div>
    </div>
  );
};

export default DownloadCompendia;

async function fetchCompendiaData() {
  try {
    const data = await Ajax.get('/compendia');

    return Object.values(groupBy(data, x => x.organism_name))
      .map(
        group =>
          group.sort((x, y) => y.compendia_version - x.compendia_version)[0]
      )
      .map(result => ({
        organism: result.organism_name,
        url: result.s3_url
      }));
  } catch (e) {
    return [];
  }
}

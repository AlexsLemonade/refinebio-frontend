import React from 'react';
import Dropdown from '../../components/Dropdown';
import { Ajax, formatSentenceCase } from '../../common/helpers';
import Loader from '../../components/Loader';

import groupBy from 'lodash/groupBy';

export default class DownloadCompendia extends React.Component {
  state = {
    selected: null
  };

  render() {
    return (
      <div className="download-compendia">
        <Loader fetch={fetchCompendiaData}>
          {({ data, isLoading }) => {
            if (isLoading || data.length === 0) return <div>Loading..</div>;
            return (
              <div>
                <div className="download-compendia__title">
                  Download the Compendia
                </div>

                <div>
                  <span className="download-compendia__choose">
                    Choose Organism
                  </span>
                  <Dropdown
                    options={data}
                    selectedOption={this.state.selected}
                    label={x => formatSentenceCase(x.organism)}
                    onChange={selected => this.setState({ selected })}
                  />
                </div>

                <a
                  href={
                    this.state.selected ? this.state.selected.url : data[0].url
                  }
                  className="button download-compendia__button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Now
                </a>
              </div>
            );
          }}
        </Loader>
      </div>
    );
  }
}

async function fetchCompendiaData() {
  try {
    const data = Ajax.get('/compendia');

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

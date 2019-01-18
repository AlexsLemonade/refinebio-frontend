import React from 'react';
import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';
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
            if (isLoading) return <div>Loading..</div>;
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
  // const data = Ajax.get('/compendia');
  const data = DummyCompendia;

  return Object.values(groupBy(data, x => x.organism_name))
    .map(
      group =>
        group.sort((x, y) => y.compendia_version - x.compendia_version)[0]
    )
    .map(result => ({
      organism: result.organism_name,
      url: result.s3_url
    }));
}

const DummyCompendia = [
  {
    id: 3,
    filename: '1.tsv',
    size_in_bytes: 1,
    is_compendia: true,
    organism_name: 'DANIO_RERIO',
    compendia_version: 1,
    sha1: 'abc',
    s3_bucket: 'dr-compendia',
    s3_key: 'drc2.tsv',
    s3_url: 'https://s3.amazonaws.com/dr-compendia/drc2.tsv',
    created_at: '2019-01-18T18:23:28.956503Z',
    last_modified: '2019-01-18T18:23:28.956503Z'
  },
  {
    id: 2,
    filename: '2.tsv',
    size_in_bytes: 1,
    is_compendia: true,
    organism_name: 'HOMO_SAPIENS',
    compendia_version: 2,
    sha1: 'abc',
    s3_bucket: 'dr-compendia',
    s3_key: 'hsc2.tsv',
    s3_url: 'https://s3.amazonaws.com/dr-compendia/hsc2.tsv',
    created_at: '2019-01-18T18:23:28.955350Z',
    last_modified: '2019-01-18T18:23:28.955350Z'
  },
  {
    id: 1,
    filename: '1.tsv',
    size_in_bytes: 1,
    is_compendia: true,
    organism_name: 'HOMO_SAPIENS',
    compendia_version: 1,
    sha1: 'abc',
    s3_bucket: 'dr-compendia',
    s3_key: 'hsc1.tsv',
    s3_url: 'https://s3.amazonaws.com/dr-compendia/hsc1.tsv',
    created_at: '2019-01-18T18:23:28.945112Z',
    last_modified: '2019-01-18T18:23:28.945112Z'
  }
];

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import uniq from 'lodash/uniq';
import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';
import { Ajax, formatSentenceCase } from '../../common/helpers';
import { useLoader } from '../../components/Loader';
import Checkbox from '../../components/Checkbox';
import Spinner from '../../components/Spinner';

import { createToken } from '../../state/token';
import { push } from '../../state/routerActions';

let DownloadCompendia = ({
  token,
  createToken,
  push,
  title,
  filter,
  children,
}) => {
  const agreedToTerms = !!token;
  const [selected, setSelected] = React.useState(null);
  const [agree, setAgree] = React.useState(agreedToTerms);
  const { data, isLoading } = useLoader(() => fetchCompendiaData(filter));

  if (isLoading)
    return (
      <div className="download-compendia">
        <Spinner />
      </div>
    );

  if (!isLoading && data.length === 0)
    return (
      <div className="download-compendia">
        Download unavailable at this time.
        <br />
        Please check again soon!
      </div>
    );

  return (
    <div className="download-compendia">
      <div>
        <div className="download-compendia__title">Download the {title}</div>
        <div className="download-compendia__row">
          <span className="download-compendia__choose">Choose Organism</span>
          <Dropdown
            multiple={false}
            options={data}
            selectedOption={selected ? selected.organism_name : null}
            label={c => formatSentenceCase(c.organism_name)}
            onChange={setSelected}
          />
        </div>

        {children}

        {!agreedToTerms && (
          <div className="download-compendia__terms download-compendia__row">
            <Checkbox
              name="termsOfService"
              checked={agree}
              onClick={() => setAgree(!agree)}
            >
              I agree to the{' '}
              <Link
                to="/terms"
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Use
              </Link>
            </Checkbox>
          </div>
        )}
        <div className="download-compendia__row">
          <span>
            Download Size:{' '}
            {getPrettyFileSize((selected || data[0]).size_in_bytes)}{' '}
          </span>
          <Button
            text="Download Now"
            className="download-compendia__button"
            isDisabled={!agree}
            onClick={async () => {
              const tokenId = token || (await createToken());
              const selectedOrganism = selected || data[0];
              const downloadUrl = await downloadCompendia(
                selectedOrganism,
                tokenId
              );
              push({
                pathname: '/species-compendia/download',
                state: { organism: selectedOrganism, downloadUrl },
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};
DownloadCompendia = connect(
  state => ({
    token: state.token,
  }),
  { createToken, push }
)(DownloadCompendia);
export default DownloadCompendia;

const filterForLatestCompendia = data => {
  data.forEach(c => {
    c.organism_name = c.result.annotations[0].data.organism_name;
  });

  const organismNames = uniq(data.map(c => c.organism_name));
  const filtered = [];

  for (const organismName of organismNames) {
    const organismCompendium = data
      .filter(c => c.organism_name === organismName)
      .sort((x, y) => y.compendia_version - x.compendia_version);
    filtered.push(organismCompendium[0]);
  }
  return filtered.sort((a, b) =>
    b.organism_name.toUpperCase() < a.organism_name.toUpperCase() ? 1 : -1
  );
};

async function fetchCompendiaData(additionalFilters = {}) {
  try {
    const filters = {
      ...{
        is_compendia: true,
        is_public: true,
        is_qn_target: false,
      },
      ...additionalFilters,
    };
    const values = Object.entries(filters).map(([key, value]) => {
      return `${key}=${value}`;
    });

    const { results: data } = await Ajax.get(
      `/v1/computed_files/?${values.join('&')}`
    );
    return filterForLatestCompendia(data);
  } catch (e) {
    return [];
  }
}

async function downloadCompendia(organism, token) {
  // refetch the compendia, now sending the token id to retrieve the download urls
  const data = await Ajax.get('/v1/computed_files', null, { 'API-KEY': token });

  const computedFile = data
    .filter(x => x.organism_name === organism)
    .sort((x, y) => y.compendia_version - x.compendia_version);

  // set the download url
  return computedFile[0].download_url;
}

const getPrettyFileSize = size => {
  for (const unit of ['B', 'KB', 'MB', 'GB', 'TB']) {
    if (Math.abs(size) < 1024.0) return `${size.toFixed(1)}${unit}`;
    size /= 1024.0;
  }

  return '';
};

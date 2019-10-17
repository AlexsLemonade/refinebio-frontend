import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import uniq from 'lodash/uniq';
import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';
import { Ajax, formatSentenceCase, formatBytes } from '../../common/helpers';
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
        <p className="download-compendia__title">Fetching {title}</p>
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
            selectedOption={selected}
            label={c => formatSentenceCase(c.organism_name)}
            onChange={s => setSelected(s)}
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
            Download Size: {formatBytes((selected || data[0]).size_in_bytes)}{' '}
          </span>
          <Button
            text="Download Now"
            className="download-compendia__button"
            isDisabled={!agree}
            onClick={async () => {
              const tokenId = token || (await createToken());
              const selectedOrganism = selected || data[0];
              const downloadUrl = await downloadCompendia(
                filter,
                tokenId,
                selectedOrganism
              );
              push({
                pathname: '/compendia/download',
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

const filterForLatestCompendia = (data, organism = false) => {
  data.forEach(c => {
    c.organism_name = c.result.annotations[0].data.organism_name;
  });

  const filtered = uniq(data.map(c => c.organism_name)).map(o => {
    return data
      .filter(c => c.organism_name === o)
      .sort((x, y) => y.compendia_version - x.compendia_version)[0];
  });

  if (organism) return filtered.find(c => c.organism_name === organism);
  return filtered.sort((a, b) =>
    b.organism_name.toUpperCase() < a.organism_name.toUpperCase() ? 1 : -1
  );
};

async function fetchCompendiaData(additionalFilters = {}, token) {
  try {
    const filters = {
      ...{
        is_compendia: true,
        is_public: true,
        is_qn_target: false,
      },
      ...additionalFilters,
    };

    const tokenObject = token ? { 'API-KEY': token } : null;
    const values = Object.entries(filters).map(([key, value]) => {
      return `${key}=${value}`;
    });

    const { results: data } = await Ajax.get(
      `/v1/computed_files/?${values.join('&')}`,
      null,
      tokenObject
    );
    return filterForLatestCompendia(data);
  } catch (e) {
    return [];
  }
}

async function downloadCompendia(additionalFilters = {}, token, organism) {
  // refetch the compendia, now sending the token id to retrieve the download urls
  const computedFiles = await fetchCompendiaData(additionalFilters, token);
  const downloadableFile = computedFiles.find(
    c => c.organism_name === organism.organism_name
  );
  if (downloadableFile && downloadableFile.download_url) {
    return downloadableFile.download_url;
  }
  // throw error? or alert slack
  return '';
}

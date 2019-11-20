import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { formatSentenceCase, formatBytes } from '../../common/helpers';

import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';
import { useLoader } from '../../components/Loader';
import Checkbox from '../../components/Checkbox';
import Spinner from '../../components/Spinner';

import { fetchCompendium, fetchCompendiaData } from '../../api/compendia';
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
            label={c => formatSentenceCase(c.primary_organism)}
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
            Download Size:{' '}
            {formatBytes((selected || data[0]).computed_file.size_in_bytes)}{' '}
          </span>
          <Button
            text="Download Now"
            className="download-compendia__button"
            isDisabled={!agree}
            onClick={async () => {
              const tokenId = token || (await createToken());
              const selectedCompendium = selected || data[0];
              push({
                pathname: '/compendia/download',
                state: await fetchCompendium(tokenId, selectedCompendium),
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

import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import ReactGA from 'react-ga';

import { formatSentenceCase, formatBytes } from '../../common/helpers';
import InfoBadge from '../../common/icons/info-badge.svg';

import DropdownSearch from '../../components/DropdownSearch';
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
  const { data, isLoading } = useLoader(() =>
    fetchCompendiaData({
      latest_version: true,
      ...filter,
    })
  );

  const trackDownloadType = compendium => {
    if (process.env.NODE_ENV === 'production') {
      const type = compendium.quant_sf_only ? 'RNA-seq' : 'Normalized';
      ReactGA.event({
        category: 'Compendia',
        action: `${type} Download`,
        label: compendium.primary_organism_name,
      });
    }
  };

  const clickDownload = async () => {
    if (selected) {
      const tokenId = token || (await createToken());
      trackDownloadType(selected);
      push({
        pathname: '/compendia/download',
        state: await fetchCompendium(tokenId, selected.id),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="download-compendia">
        <p className="download-compendia__title">Fetching {title}</p>
        <Spinner />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="download-compendia">
        Download unavailable at this time.
        <br />
        Please check again soon!
      </div>
    );
  }

  return (
    <div className="download-compendia">
      <div>
        <div className="download-compendia__title">Download the {title}</div>
        <span className="download-compendia__choose">Choose Organism</span>
        <div className="download-compendia__row">
          <div className="download-compendia__dropdown">
            <DropdownSearch
              options={data}
              selectedOption={selected}
              label={c => formatSentenceCase(c.primary_organism_name)}
              onChange={s => setSelected(s)}
              placeholder="Search for an organism"
            />
          </div>
        </div>

        {children}

        {selected && selected.organism_names.length > 1 && (
          <div className="download-compendia__info">
            <img src={InfoBadge} alt="Attention" />
            <p>
              Also contains small number of samples from other
              <br />
              organisms from the same species.{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="//docs.refine.bio/en/latest/main_text.html#collapsing-by-genus"
              >
                View list
              </a>
            </p>
          </div>
        )}

        {!agreedToTerms && (
          <div className="download-compendia__terms download-compendia__row">
            <Checkbox
              name="termsOfService"
              checked={agree}
              onClick={() => setAgree(!agree)}
            >
              I agree to the{' '}
              <Link
                href="/terms"
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <a>Terms of Use</a>
              </Link>
            </Checkbox>
          </div>
        )}
        <div className="download-compendia__row">
          <span>
            {selected && 'Download Size: '}
            {selected && formatBytes(selected.computed_file.size_in_bytes)}
          </span>
          <Button
            text="Download Now"
            className="download-compendia__button"
            isDisabled={!agree}
            onClick={clickDownload}
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

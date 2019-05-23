import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import uniq from 'lodash/uniq';
import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';
import { Ajax, formatSentenceCase } from '../../common/helpers';
import { useLoader } from '../../components/Loader';
import Checkbox from '../../components/Checkbox';

import { createToken } from '../../state/token';
import { push } from '../../state/routerActions';

let DownloadCompendia = ({ token, createToken, push }) => {
  const agreedToTerms = !!token;
  const [selected, setSelected] = React.useState(null);
  const [agree, setAgree] = React.useState(agreedToTerms);
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
            selectedOption={selected}
            label={formatSentenceCase}
            onChange={setSelected}
          />
        </div>

        <div className="download-compendia__row">
          {!agreedToTerms && (
            <div>
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

async function fetchCompendiaData() {
  try {
    const data = await Ajax.get('/compendia');
    return uniq(data.map(x => x.organism_name));
  } catch (e) {
    return [];
  }
}

async function downloadCompendia(organism, token) {
  // refetch the compendia, now sending the token id to retrieve the download urls
  const data = await Ajax.get('/compendia', null, { 'API-KEY': token });

  const computedFile = data
    .filter(x => x.organism_name === organism)
    .sort((x, y) => y.compendia_version - x.compendia_version);

  // set the download url
  return computedFile[0].download_url;
}

import React from 'react';
import { connect } from 'react-redux';
import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';
import { Ajax, formatSentenceCase } from '../../common/helpers';
import { useLoader } from '../../components/Loader';
import { Link } from 'react-router-dom';
import Checkbox from '../../components/Checkbox';

import groupBy from 'lodash/groupBy';

let DownloadCompendia = ({ agreedToTerms }) => {
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
            options={data.map(x => x.organism)}
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
          />
        </div>
      </div>
    </div>
  );
};
DownloadCompendia = connect(state => ({
  agreedToTerms: !!state.token
}))(DownloadCompendia);
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

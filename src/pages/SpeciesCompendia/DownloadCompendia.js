import React from 'react';
import { connect } from 'react-redux';
import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';
import { Ajax, formatSentenceCase } from '../../common/helpers';
import { useLoader } from '../../components/Loader';
import { Link } from 'react-router-dom';
import Checkbox from '../../components/Checkbox';

import { createToken } from '../../state/token';
import uniq from 'lodash/uniq';
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
              // const downloadUrl = await downloadCompendia(
              //   selectedOrganism,
              //   tokenId
              // );
              const downloadUrl =
                'https://data-refinery-s3-results-circleci-prod.s3.amazonaws.com/55723fa8-d86f-4abb-b198-eeb4d883c0b0.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAYSVVCNE5S5XWNKUK%2F20190506%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20190506T193953Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Security-Token=AgoJb3JpZ2luX2VjECMaCXVzLWVhc3QtMSJIMEYCIQCLkWWAo4gtbzewXAVvs6IdfbpsNeHDLYD1KhwV66DqaQIhAOZRoCgrc7Yyc7F7%2FN%2BKnFoLAEn3SAeAnUaxLW752xJkKtoDCBwQABoMNTg5ODY0MDAzODk5IgyTzqN5C3V8zS8bZGcqtwM4hoR7UZcJ5S3p%2FCTg205C7rQUhO0lROqx6bbIKFzLeFk6QfCEqCknXGFPLbQUPv6UOay5KAOpGc3VbA1KIFF4G3wYbb0v6U9y3gvpjA7L71LNz112xVr3k7rnDloP2Um%2BbPjEsMD811DQAy3XPFI0zz%2FrDMxzJeye79Fw%2BwPuEDKmKZPfW9uxoFsi%2FDWWrvb7KngR%2FuSeN7r9pEoo0lAFbZsxBswAhuXUPEvgdMjxvKYGKzExwISABcSo3QRR4uvRloue4o%2Fxfol9Yr4p%2BJRcGcoM%2B88bLpJAbhyTe33Yh7kBCeG0qhUPJOUb5%2Bkcy4pzrloCGOTJsLOArpcMovEQ6k0Sr2reBC991RVTKlDpwDYeP6ZBSt7avrLWVY7fnx%2BhK9a2YNCQOHqkUcy%2BhtF6YYves6DOvoQTjDxSp07Z0KLzjDckcAKCttxn2gweYZenvChGbEP0CShXw3QyVcbOYXcDifTQJfFIuP4L%2FauW62bxDDc1ywl0gUQYOteAbmoiPrc9NadJM9p8CLu3UroSL5CXmPyrwu8jr3rCxIIgOOkQALVF6Zf3mDTx6Kl7WAo2QZm4VZt5MLD4weYFOrMBJMRmFjNjcUqpZQuPiIixpBnLIuQV47LHuOYICHRt9SSmYoizy%2FpY1Wad2N0CjvpkphyQgNW9FvX%2FGFuuL%2FwZlP1Eh5gao22YRZbK7R%2Bo0azQ%2BaFc3TgLm5J85Qo50J0bAC3o%2BHohSdCg4DDvbjwWyOYTTXNkuB0of%2BzVHD3eD%2FcwQILWcwjPTRrap71pdwqoKTmPza8dpsdPn%2BOcg6h49SLmaCePXRaWXJFyOwo0k9S42XM%3D&X-Amz-Signature=f7f0f9c2fdc1d64ac1dcc282cf3c319903bd0390025bf9d05871ed7921d51113';
              push({
                pathname: '/species-compendia/download',
                state: { organism: selectedOrganism, downloadUrl }
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
    token: state.token
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
  // refetch the compendias, now sending the token id to retrieve the download urls
  const data = await Ajax.get('/compendia', null, { 'API-KEY': token });

  const computedFile = data
    .filter(x => x.organism_name === organism)
    .sort((x, y) => y.compendia_version - x.compendia_version);

  // set the download url
  return computedFile[0].download_url;
}

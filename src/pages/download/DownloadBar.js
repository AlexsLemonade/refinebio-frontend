import React from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import ModalManager from '../../components/Modal/ModalManager';
import InputCopy from '../../components/InputCopy';
import './DownloadBar.scss';
import { getDomain } from '../../common/helpers';
import { editDataSet } from '../../state/download/actions';
import DownloadOptionsForm from './DownloadOptionsForm';
import { push } from '../../state/routerActions';

let DownloadBar = ({ dataSet, push, editDataSet }) => {
  return (
    <div className="downloads__bar">
      <div className="flex-row mb-2">
        <div className="downloads__heading">My Dataset</div>

        <div>
          <ShareDatasetButton dataSet={dataSet} />
        </div>
      </div>

      <DownloadOptionsForm
        dataSet={dataSet}
        onChange={values => editDataSet(values)}
        onSubmit={() => push('/download?start=true', '/download')}
      />
    </div>
  );
};
DownloadBar = connect(
  null,
  {
    editDataSet,
    push,
  }
)(DownloadBar);
export default DownloadBar;

export function ShareDatasetButton({ dataSet: { id: dataSetId } }) {
  return (
    <ModalManager
      component={showModal => (
        <Button
          buttonStyle="secondary"
          text="Share Dataset"
          onClick={showModal}
        />
      )}
      modalProps={{ center: true, className: 'share-link-modal' }}
    >
      {() => (
        <div>
          <h1 className="share-link-modal__title">Shareable Link</h1>
          <InputCopy value={`${getDomain()}/dataset/${dataSetId}?ref=share`} />
        </div>
      )}
    </ModalManager>
  );
}

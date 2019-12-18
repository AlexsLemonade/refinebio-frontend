import React from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import ModalManager from '../../components/Modal/ModalManager';
import InputCopy from '../../components/InputCopy';
import './DownloadBar.scss';
import { getDomain } from '../../common/helpers';
import {
  editAggregation,
  editTransformation,
  editQuantileNormalize,
} from '../../state/download/actions';

let DownloadBar = ({ dataSet }) => {
  const { dataSetId } = dataSet;

  return (
    <div className="downloads__bar">
      <div className="flex-row mb-2">
        <div className="downloads__heading">My Dataset</div>

        <div>
          <ShareDatasetButton dataSetId={dataSetId} />
        </div>
      </div>
    </div>
  );
};
DownloadBar = connect(
  null,
  {
    editAggregation,
    editTransformation,
    editQuantileNormalize,
  }
)(DownloadBar);
export default DownloadBar;

export function ShareDatasetButton({ dataSetId }) {
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

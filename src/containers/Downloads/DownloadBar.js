import React from 'react';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';

const DownloadBar = () => {
  return (
    <div className="downloads__bar">
      <Button buttonStyle="secondary" text="Share" />
      <div className="downloads__actions">
        <div className="downloads__fieldset">
          <label className="downloads__label">
            Aggregate
            <Dropdown
              options={['Experiments', 'Samples']}
              selectedOption={'Experiments'}
            />
          </label>
          <label className="downloads__label">
            Transformation
            <Dropdown options={['None', 'Samples']} selectedOption={'None'} />
          </label>
        </div>
        <Button text="Download" />
      </div>
    </div>
  );
};

export default DownloadBar;

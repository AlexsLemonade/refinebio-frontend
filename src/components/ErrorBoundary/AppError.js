import React from 'react';
import Image from 'next/image';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/browser';
import SpilledSample from './spilled-sample.svg';
import Button from '../Button';
import { goBack } from '../../state/routerActions';

let AppError = ({ goBack }) => (
  <div className="error-page">
    <div className="error-page__text">
      <h1>Uh-oh something went wrong!</h1>
      <div>
        Try refreshing the page or <Button text="Go Back" onClick={goBack} />
      </div>

      {Sentry.lastEventId() && (
        <div className="error-page__button-row">
          <Button
            text="Submit Feedback"
            buttonStyle="secondary"
            onClick={() => Sentry.showReportDialog()}
          />
        </div>
      )}
    </div>

    <div>
      <Image
        src={SpilledSample}
        alt="Something went wrong"
        className="img-responsive"
      />
    </div>
  </div>
);
AppError = connect(null, {
  goBack,
})(AppError);

export default AppError;

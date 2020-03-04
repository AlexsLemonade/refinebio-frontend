import React from 'react';
import Head from 'next/head';
import DistressedTubey from '../common/images/distressed-tubey.svg';

const ServerError = () => (
  <div className="error-page">
    <Head>
      <title>We’re a little overwhelmed at the moment - refine.bio</title>
    </Head>
    <div className="error-page__text">
      <ApiOverwhelmed />
    </div>

    <div>
      <img
        src={DistressedTubey}
        alt="server error"
        className="img-responsive"
      />
    </div>
  </div>
);

export default ServerError;

export function ApiOverwhelmed() {
  return (
    <>
      <h1>We’re a little overwhelmed at the moment.</h1>
      <p>
        We apologize for the inconvenience. We are working hard to restore
        normal service.
      </p>
      <p>
        Follow us on twitter (
        <a
          href="https://twitter.com/CancerDataLab"
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="link"
        >
          @CancerDataLab
        </a>
        ) for updates.
      </p>
    </>
  );
}

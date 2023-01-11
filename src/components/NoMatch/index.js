import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { connect } from 'react-redux';
import RewardPoster from './404-reward-poster.svg';
import Button from '../Button';

import { goBack } from '../../state/routerActions';

let NoMatch = ({ goBack }) => (
  <div className="error-page">
    <Head>
      <title>The page you're looking for isn't expressed. - refine.bio</title>
    </Head>
    <div className="error-page__text">
      <h1>The page you are looking for isn’t expressed.</h1>
      <Button text="Go Back" onClick={goBack} />
    </div>

    <div>
      <Image
        src={RewardPoster}
        alt="404 not found reward poster"
        className="img-responsive"
      />
    </div>
  </div>
);
NoMatch = connect(null, { goBack })(NoMatch);

export default NoMatch;

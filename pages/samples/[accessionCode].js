import React from 'react';
import dynamic from 'next/dynamic';
import Spinner from '../../src/components/Spinner';

const Sample = dynamic(() => import('../../src/pages/Sample'), {
  ssr: false,
  loading: () => <Spinner />,
});

export default function() {
  return (
    <div className="layout__content">
      <Sample />
    </div>
  );
}

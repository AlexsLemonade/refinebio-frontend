import dynamic from 'next/dynamic';

const Sample = dynamic(() => import('../src/pages/Sample'), {
  ssr: false,
});

export default Sample;

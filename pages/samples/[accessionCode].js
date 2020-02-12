import dynamic from 'next/dynamic';

const Sample = dynamic(() => import('../src/pages/sample'), {
  ssr: false,
});

export default Sample;

import dynamic from 'next/dynamic';

const Download = dynamic(() => import('../src/pages/download'), {
  ssr: false,
});

export default Download;

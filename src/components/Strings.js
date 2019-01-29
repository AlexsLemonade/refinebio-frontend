import React from 'react';

export function NSamples({ total }) {
  if (!total) {
    return 'No Samples';
  } else if (total === 1) {
    return '1 Sample';
  } else {
    return `${total} Samples`;
  }
}

export function NDownloadableSamples({ total }) {
  if (!total) {
    return 'No Downloadable Samples';
  } else if (total === 1) {
    return '1 Downloadable Sample';
  } else {
    return `${total} Downloadable Samples`;
  }
}

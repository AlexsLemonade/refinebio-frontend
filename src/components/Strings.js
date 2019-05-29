export function NSamples({ total }) {
  if (!total) {
    return 'No Samples';
  }
  if (total === 1) {
    return '1 Sample';
  }
  return `${total} Samples`;
}

export function NDownloadableSamples({ total }) {
  if (!total) {
    return 'No Downloadable Samples';
  }
  if (total === 1) {
    return '1 Downloadable Sample';
  }
  return `${total} Downloadable Samples`;
}

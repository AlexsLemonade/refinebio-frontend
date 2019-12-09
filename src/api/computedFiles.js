import { Ajax } from '../common/helpers';

export async function getComputedFiles(sampleId) {
  try {
    return await Ajax.get('/v1/computed_files/', {
      samples: sampleId,
    });
  } catch {
    return [];
  }
}

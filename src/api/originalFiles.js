import { Ajax } from '../common/helpers';

export async function getOriginalFiles(sampleId) {
  try {
    return await Ajax.get('/v1/original_files/', {
      samples: sampleId,
    });
  } catch {
    return [];
  }
}

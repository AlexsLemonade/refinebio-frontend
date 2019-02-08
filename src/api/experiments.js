import { Ajax } from '../common/helpers';

export async function getExperiment(accessionCode) {
  return await Ajax.get(`/experiments/${accessionCode}/`);
}

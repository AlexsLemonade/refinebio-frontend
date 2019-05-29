import { Ajax } from '../common/helpers';

export async function getExperiment(accessionCode) {
  return Ajax.get(`/experiments/${accessionCode}/`);
}

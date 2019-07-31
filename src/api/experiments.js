import { Ajax } from '../common/helpers';

export async function getExperiment(accessionCode) {
  return Ajax.get(`/v1/experiments/${accessionCode}/`);
}

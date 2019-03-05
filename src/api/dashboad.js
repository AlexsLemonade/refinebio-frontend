import { Ajax } from '../common/helpers';

export async function fetchDashboardData(range = null) {
  return range
    ? await Ajax.get('/stats/', { range })
    : await Ajax.get('/stats');
}

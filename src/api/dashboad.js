import { Ajax } from '../common/helpers';

export async function fetchDashboardData(range) {
  const stats = await Ajax.get('/stats/', { range });
  return stats;
}

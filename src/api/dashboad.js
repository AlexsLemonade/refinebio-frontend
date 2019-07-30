import { Ajax } from '../common/helpers';

export async function fetchDashboardData(range = null) {
  return range ? Ajax.get('/v1/stats/', { range }) : Ajax.get('/v1/stats');
}

import { Ajax } from '../common/helpers';

export async function fetchDashboardData(range = null) {
  return range ? Ajax.get('/stats/', { range }) : Ajax.get('/stats');
}

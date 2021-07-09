import { Ajax } from '../common/helpers';

export async function fetchDashboardData(range = null) {
  return range
    ? Ajax.get('/v1/stats/', { range, dashboard: true })
    : Ajax.get('/v1/stats', { dashboard: true });
}

export async function fetchExecutiveDashboardData(range = null) {
  return range ? Ajax.get('/v1/stats/', { range }) : Ajax.get('/v1/stats');
}

import { Ajax } from '../../common/helpers';
import reportError from '../reportError';

export const fetchDashboardData = range => {
  return async dispatch => {
    try {
      const stats = await Ajax.get('/stats', { range });

      dispatch({
        type: 'DASHBOARD_REQUEST_SUCCESS',
        data: {
          stats
        }
      });
    } catch (e) {
      reportError(e);
    }
  };
};

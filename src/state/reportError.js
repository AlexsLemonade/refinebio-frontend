export const REPORT_ERROR = 'refinebio/REPORT_ERROR';

const reportError = error => ({
  type: REPORT_ERROR,
  data: error
});

export default reportError;

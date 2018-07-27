const initialState = {};

export default function(state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case 'LOAD_VIEW_DOWNLOAD': {
      const { dataSet, experiments, samples, aggregate_by } = data;
      return {
        ...state,
        dataSet,
        experiments,
        samples,
        aggregate_by
      };
    }
    default:
      return state;
  }
}

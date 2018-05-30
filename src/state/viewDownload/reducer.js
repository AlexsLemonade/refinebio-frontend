const initialState = {};

export default function(state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case 'LOAD_VIEW_DOWNLOAD': {
      const { dataSet, experiments, samples } = data;
      return {
        ...state,
        dataSet,
        experiments,
        samples
      };
    }
    default:
      return state;
  }
}

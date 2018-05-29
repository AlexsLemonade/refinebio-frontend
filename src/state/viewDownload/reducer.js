const initialSatate = {};

export default function(state = initialSatate, action) {
  const { type, data } = action;

  switch (type) {
    case 'LOAD_VIEW_DOWNLOAD': {
      return {
        ...state,
        ...data
      };
    }
    default:
      return state;
  }
}

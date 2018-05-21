import { combineReducers } from 'redux';
import dashboard from './dashboard/reducer';
import download from './download/reducer';
import search from './search/reducer';
import { reducer as formReducer } from 'redux-form';

import experiment from './experiment/reducer';

const rootReducer = combineReducers({
  form: formReducer,
  dashboard,
  download,
  experiment,
  search
});

export default rootReducer;

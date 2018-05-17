import { combineReducers } from 'redux';
import dashboard from './dashboard/reducer';
import download from './download/reducer';
import { reducer as formReducer } from 'redux-form';

import experiment from './experiment/reducer';

const rootReducer = combineReducers({
  form: formReducer,
  dashboard,
  download,
  experiment
});

export default rootReducer;

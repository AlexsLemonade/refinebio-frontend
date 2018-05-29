import { combineReducers } from 'redux';
import dashboard from './dashboard/reducer';
import download from './download/reducer';
import viewDownload from './viewDownload/reducer';
import search from './search/reducer';
import dataSet from './dataSet/reducer';
import { reducer as formReducer } from 'redux-form';

import experiment from './experiment/reducer';

const rootReducer = combineReducers({
  form: formReducer,
  dashboard,
  download,
  viewDownload,
  experiment,
  search,
  dataSet
});

export default rootReducer;

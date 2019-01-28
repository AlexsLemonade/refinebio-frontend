import { combineReducers } from 'redux';
import dashboard from './dashboard/reducer';
import download from './download/reducer';
import search from './search/reducer';
import dataSet from './dataSet/reducer';
import token from './token';
import experiment from './experiment/reducer';

const rootReducer = combineReducers({
  dashboard,
  download,
  experiment,
  search,
  dataSet,
  token
});

export default rootReducer;

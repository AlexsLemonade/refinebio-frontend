import { combineReducers } from 'redux';
import dashboard from './dashboard/reducer';
import download from './download/reducer';
import search from './search/reducer';
import token from './token';

const rootReducer = combineReducers({
  dashboard,
  download,
  search,
  token
});

export default rootReducer;

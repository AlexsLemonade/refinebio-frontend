import { combineReducers } from 'redux';
import download from './download/reducer';
import search from './search/reducer';
import token from './token';

const rootReducer = combineReducers({
  download,
  search,
  token,
});

export default rootReducer;

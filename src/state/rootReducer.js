import { combineReducers } from 'redux';
import dashboard from './dashboard/reducer';
import download from './download/reducer';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  form: formReducer,
  dashboard,
  download
});

export default rootReducer;

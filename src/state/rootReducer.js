import { combineReducers } from 'redux';
import dashboard from './dashboard/reducer';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  form: formReducer,
  dashboard
});

export default rootReducer;

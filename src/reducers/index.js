import counterReducer from './counter';
import authenticationReducer from './authenticationReducer';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
  counterReducer, authenticationReducer
});

export default allReducers;
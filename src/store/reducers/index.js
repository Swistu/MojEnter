import modalReducer from './modalReducer';
import authenticationReducer from './authenticationReducer';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
  modalReducer, authenticationReducer
});

export default allReducers;
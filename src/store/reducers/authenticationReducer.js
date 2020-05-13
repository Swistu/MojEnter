import * as actionTypes from '../actionTypes';

const initialState = {
  user: null,
}

const authenticationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTHENTICATION:
      return {
        ...state,
        realtimeDatabaseUser: action.payLoad.realtimeDatabaseUser
      }
    default:
      return state;
  }
}

export default authenticationReducer;

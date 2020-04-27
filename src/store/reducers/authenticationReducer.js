import * as actionTypes from '../actionTypes';

const initialState = {
  user: null,
}

const authenticationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTHENTICATION:
      state = {
        ...state,
        firebaseUser: action.payLoad.firebaseUser,
        data: action.payLoad.data
      }
      return state;
      break;
    default:
      return state;
  }
}

export default authenticationReducer;

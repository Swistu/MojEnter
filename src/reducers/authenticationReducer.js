export const SIGN_IN = "SIGN_IN";

const initialState = {
  isAuth: false,
  user: null,
}

const authenticationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      state = {
        ...state,
        user: action.payLoad.user
      }
      return state;
      break;
    default:
      return state;
  }
}

export default authenticationReducer;

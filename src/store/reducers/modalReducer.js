import * as actionTypes from '../actionTypes';

const modalReducer = (state = false, action) => {
  switch (action.type) {
    case actionTypes.SHOW:
      state = {
        ...state,
        showModal: true,
        title: action.payLoad.title,
        component: action.payLoad.component
      }
      return state;
    case actionTypes.HIDE:
      state = {
        ...state,
        showModal: false
      }
      return state;
    default:
      return state;
  }
}

export default modalReducer;

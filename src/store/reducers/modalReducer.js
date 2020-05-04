import * as actionTypes from '../actionTypes';

const modalReducer = (state = false, action) => {
  switch (action.type) {
    case actionTypes.SHOW:
      return {
        ...state,
        showModal: true,
        title: action.payLoad.title,
        component: action.payLoad.component
      }
    case actionTypes.HIDE:
      return {
        ...state,
        showModal: false
      }
    default:
      return state;
  }
}

export default modalReducer;

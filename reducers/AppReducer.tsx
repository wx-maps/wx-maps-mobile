import {HIDE_SNACKBAR, SHOW_SNACKBAR} from '../actions/AppActions'

const INITIAL_STATE = {
    snackBarVisible: false,
    snackBarText: null,
};

export const AppReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case HIDE_SNACKBAR:
            return {...state, snackBarVisible: false, snackBarText: null }
        case SHOW_SNACKBAR:
            return {...state, snackBarVisible: true, snackBarText: action.payload }
      default:
        return state
    }
  };
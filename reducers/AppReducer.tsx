import {HIDE_SNACKBAR, SHOW_SNACKBAR} from '../actions/AppActions'

const INITIAL_STATE = {
    snackbarVisible: false,
    snackbarText: null,
};

export const AppReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case HIDE_SNACKBAR:
            return {...state, snackbarVisible: false, snackbarText: null }
        case SHOW_SNACKBAR:
            return {...state, snackbarVisible: true, snackbarText: action.payload }
      default:
        return state
    }
  };
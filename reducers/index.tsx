import { combineReducers } from 'redux';

import {BLEReducer} from './BLEReducer'
import {AppReducer} from './AppReducer'

const rootReducer = combineReducers({
    BLE: BLEReducer, 
    App: AppReducer
});
  
export default rootReducer;
import { combineReducers } from 'redux';

import {BLEReducer} from './BLEReducer'
import {AppReducer} from './AppReducer'
import {ControlReducer} from './ControlReducer'


const rootReducer = combineReducers({
    BLE: BLEReducer, 
    App: AppReducer,
    Control: ControlReducer,
});
  
export default rootReducer;
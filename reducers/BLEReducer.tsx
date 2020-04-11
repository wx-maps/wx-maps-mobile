import { combineReducers } from 'redux';

import { ADD_DEVICE } from '../actions/BLEActions'

const INITIAL_STATE = {
  manager: null,
  devices: [],
  wifiService: 'ed6695dd-be8a-44d6-a11d-cb3348faa85a',
  mapService: 'a5023bbe-29f9-4385-ab43-a9b3600ab7c4',
};

const BLEReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_DEVICE:
      
      const device = action.payload
      //currentState.devices = currentState.devices.concat(device)
      const currentState = {...state, devices: state.devices.concat(device)}
      console.log(currentState.devices.length)
      return currentState
    default:
      return state
  }
};
  
export default combineReducers({
  BLE: BLEReducer,
});
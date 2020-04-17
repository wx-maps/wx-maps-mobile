import { combineReducers } from 'redux';

import { ADD_DEVICE, ADD_WIFI_DATA, RECONSTRUCT_DATA } from '../actions/BLEActions'

const INITIAL_STATE = {
  manager: null,
  devices: [],
  wifiService: 'ed6695dd-be8a-44d6-a11d-cb3348faa85a',
  mapService: 'a5023bbe-29f9-4385-ab43-a9b3600ab7c4',
  scanCharacteristic: 'fe600987-e2ea-4c16-b938-f5d04e904af2',
  snackBarVisible: false,
  snackBarText: null,
  wifiDataBuffer: [],
  wifiNetworks: [],
};

const BLEReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_DEVICE:
      return {...state, devices: state.devices.concat(action.payload)}
    case ADD_WIFI_DATA:
      return {...state, wifiDataBuffer: state.wifiDataBuffer.concat(action.payload)}
    case RECONSTRUCT_DATA:
      let wifiNetworkData = JSON.parse(state.wifiDataBuffer.join(''))
      return {...state, wifiNetworks: wifiNetworkData }
    default:
      return state
  }
};
  
export default combineReducers({
  BLE: BLEReducer,
});
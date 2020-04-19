import { combineReducers } from 'redux';

import { ADD_DEVICE, CONNECTED_DEVICE, ADD_WIFI_DATA, RECONSTRUCT_DATA } from '../actions/BLEActions'

const INITIAL_STATE = {
  manager: null,
  devices: [],
  snackBarVisible: false,
  snackBarText: null,
  wifiDataBuffer: [],
  wifiNetworks: [],
  connectedDevice: null,
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
    case CONNECTED_DEVICE:
      return {...state, connectedDevice: action.payload, snackBarVisible: true, snackBarText: "Connected to device " + action.payload.name + "\n(" + action.payload.id + ')'}
    default:
      return state
  }
};
  
export default combineReducers({
  BLE: BLEReducer,
});
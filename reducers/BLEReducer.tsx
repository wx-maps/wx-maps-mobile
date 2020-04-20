// import { combineReducers } from 'redux';

import { ADD_DEVICE, CONNECTED_DEVICE, ADD_WIFI_DATA, RECONSTRUCT_DATA, SET_IP_ADDRESS, SET_INTERNET_CONNECTION_STATUS } from '../actions/BLEActions'

const INITIAL_STATE = {
  manager: null,
  devices: [],
  wifiDataBuffer: [],
  wifiNetworks: [],
  connectedDevice: null,
  wifi: { 
    connectedToInternet: false,
    ipAddress: null
  }
};

export const BLEReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_DEVICE:
      return {...state, devices: state.devices.concat(action.payload)}
    case ADD_WIFI_DATA:
      return {...state, wifiDataBuffer: state.wifiDataBuffer.concat(action.payload)}
    case RECONSTRUCT_DATA:
      let wifiNetworkData = JSON.parse(state.wifiDataBuffer.join(''))
      return {...state, wifiNetworks: wifiNetworkData }
    case CONNECTED_DEVICE:
      return {...state, connectedDevice: action.payload}
    case SET_IP_ADDRESS:
        return {...state, wifi: { ...state.wifi, ipAddress: action.payload}}
    case SET_INTERNET_CONNECTION_STATUS:
          return {...state, wifi: { ...state.wifi, connectedToInternet: action.payload } }
    default:
      return state
  }
};

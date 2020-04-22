// import { combineReducers } from 'redux';

import { 
  ADD_DEVICE, 
  CONNECTED_DEVICE, 
  ADD_WIFI_DATA, 
  RECONSTRUCT_DATA, 
  SET_IP_ADDRESS, 
  SET_INTERNET_CONNECTION_STATUS, 
  CLEAR_WIFI_DATA,
  SHOW_CONNECT_DIALOG,
  HIDE_CONNECT_DIALOG,
} from '../actions/BLEActions'

const INITIAL_STATE = {
  manager: null,
  devices: [],
  wifiDataBuffer: [],
  wifiNetworks: [],
  connectedDevice: null,
  wifi: { 
    connectedToInternet: false,
    ipAddress: null,
    connectDialogVisible: false,
    connecting: false,
    selectedWifiNetwork: '',
    wifiPassword: null,
  }
};

export const BLEReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_DEVICE:
      return {...state, devices: state.devices.concat(action.payload)}
    case ADD_WIFI_DATA:
      return {...state, wifiDataBuffer: state.wifiDataBuffer.concat(action.payload)}
    case CLEAR_WIFI_DATA:
      return {...state, wifiDataBuffer: [], wifiNetworkData: []}
    case RECONSTRUCT_DATA:
      let wifiNetworkData = state.wifiDataBuffer.join('');
      try{  
        return {...state, wifiNetworks:  JSON.parse(wifiNetworkData) }
      } catch {
        console.log('Failed to parse state:')
        console.log(wifiNetworkData)
        return {...state}
      }
    case CONNECTED_DEVICE:
      return {...state, connectedDevice: action.payload}
    case SET_IP_ADDRESS:
      return {...state, wifi: { ...state.wifi, ipAddress: action.payload}}
    case SET_INTERNET_CONNECTION_STATUS:
      return {...state, wifi: { ...state.wifi, connectedToInternet: action.payload } }
    case SHOW_CONNECT_DIALOG:
      return {...state, wifi: { ...state.wifi, connectDialogVisible: true, selectedWifiNetwork: action.payload}}
    case HIDE_CONNECT_DIALOG:
      return {...state, wifi: { ...state.wifi, connectDialogVisible: false}} 
    default:
      return state
  }
};

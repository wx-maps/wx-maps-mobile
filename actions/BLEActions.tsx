import { Buffer } from 'buffer';
import * as BLE from '../lib/BLE'

import * as App from './AppActions'
import { BLECommunicator } from '../lib/BLECommunicator';


export const ADD_DEVICE = 'ADD_DEVICE'
export const CONNECTED_DEVICE = 'CONNECTED_DEVICE'
export const ADD_WIFI_DATA = 'ADD_WIFI_DATA'
export const CLEAR_WIFI_DATA = 'CLEAR_WIFI_DATA'
export const RECONSTRUCT_WIFI_DATA = 'RECONSTRUCT_DATA'
export const RECONSTRUCT_AIRPORT_DATA = 'RECONSTRUCT_AIRPORT_DATA'
export const SET_IP_ADDRESS = 'SET_IP_ADDRESS'
export const SET_INTERNET_CONNECTION_STATUS = 'SET_INTERNET_CONNECTION_STATUS'
export const SHOW_CONNECT_DIALOG = 'SHOW_CONNECT_DIALOG'
export const HIDE_CONNECT_DIALOG = 'HIDE_CONNECT_DIALOG'
export const ADD_AIRPORT_DATA = 'ADD_AIRPORT_DATA'

/*
 *
 * Tradition Actions
 * 
 */
export const addDevice = device => (
    {
        type: ADD_DEVICE,
        payload: device,
    }
)

export const connectedDevice = device => (
    {
        type: CONNECTED_DEVICE,
        payload: device,
    }
)

export const addWifiData = data => (
    {
        type: ADD_WIFI_DATA,
        payload: data,
    }

)

export const clearWifiData = () => (
    {
        type: CLEAR_WIFI_DATA,
        payload: null,
    }
)

export const reconstructWifiData = () => (
    {
        type: RECONSTRUCT_WIFI_DATA,
        payload: null,
    }
)

export const reconstructAirportData = () => (
    {
        type: RECONSTRUCT_AIRPORT_DATA,
        payload: null,
    }
)

export const setIPAddress = (value) => (
    {
        type: SET_IP_ADDRESS,
        payload: value,
    }
)

export const showConnectDialog = (network) => (
    {
        type: SHOW_CONNECT_DIALOG,
        payload: network,
    }
)

export const hideConnectDialog = () => (
    {
        type: HIDE_CONNECT_DIALOG,
        payload: null,
    }
)

export const setInternetConnectionStatus = (value) => (
    {
        type: SET_INTERNET_CONNECTION_STATUS,
        payload: value,
    }
)

export const addAirportData = (value) => (
    {
        type: ADD_AIRPORT_DATA,
        payload: value,
    }
)

/*
 *
 * Thunk Actions
 * 
 */
 export const disconnected = () => {
    return async (dispatch, _getState, _BLEManager) => {
        dispatch(scan());
        dispatch(App.showSnackbar('Device disconnected'))
    }
 }

export const scanWifi = () => {
    return async (_dispatch, getState, {BLEManager, BleCommunicator}) => { BleCommunicator.scanWifi(getState().BLE.connectedDevice); }
}
    
export const startScan = () => {
    return (_dispatch, _getState, {BLEManager, BleCommunicator}) => { BleCommunicator.startScan(); };
}

export const scan = () => {
    return (_dispatch, getState, {BLEManager, BleCommunicator}) => { BleCommunicator.scan() }
}

// For now we assume there's only 1 map in range and if we find our 
// service UUID we will automatically connect to it
export const connectTo = (device) => {
    return (_dispatch, getState, {BLEManager, BleCommunicator}) => { BleCommunicator.connectTo(device) }
}

export const connectToWifi = (details) => {
    return async (_dispatch, getState, {BLEManager, BleCommunicator}) => {
        BleCommunicator.connectToWifi(getState().BLE.connectedDevice)
    }
}

export const disconnectWifi = () => {
    return async (_dispatch, getState, {BleCommunicator}) => { BleCommunicator.disconnectFromWifi(getState().BLE.connectedDevice) }
}

export const disconnectDevices = () => {
    return (_dispatch, _getState, {BleCommunicator}) => { BleCommunicator.disconnectDevices(); }
}

// FIXME: This doesn't appear to do anything...?
function updateRSSI(device){
    // device.readRSSI().then(() => {
    //     setTimeout(updateRSSI, 3000, device)
    // })
}

export const readIPAddress = (device) => {
    return (dispatch, getState, {BleCommunicator}) => { BleCommunicator.readIPAddress(device); }
}

export const readInternetStatus = (device) => {
    return (dispatch, getState, {BleCommunicator}) => { BleCommunicator.readInternetStatus(device) }
}

export const readWeatherData = (device) => {
    return (dispatch, getState, {BleCommunicator}) => { BleCommunicator.readWeatherData(getState().BLE.connectedDevice); }
}

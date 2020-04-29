import { Buffer } from 'buffer';
import * as BLE from '../lib/BLE'

import * as App from './AppActions'


export const ADD_DEVICE = 'ADD_DEVICE'
export const CONNECTED_DEVICE = 'CONNECTED_DEVICE'
export const ADD_WIFI_DATA = 'ADD_WIFI_DATA'
export const CLEAR_WIFI_DATA = 'CLEAR_WIFI_DATA'
export const RECONSTRUCT_DATA = 'RECONSTRUCT_DATA'
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

export const reconstructData = () => (
    {
        type: RECONSTRUCT_DATA,
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

// FIXME unhandled promise
export const scanWifi = () => {
    return async (dispatch, getState, BLEManager) => {
        dispatch(clearWifiData())
        
        try{ 
            getState().BLE.connectedDevice.writeCharacteristicWithResponseForService(BLE.WIFI_SERVICE, BLE.SCAN_CHARACTERISTIC, encode("1")).then(() => {
                console.log("Done scanning")
            }).catch((error) => {
                console.log("Error")
                console.log(JSON.stringify(error))
                if(error.name == 'BleError' && error.errorCode == 205){
                    console.log('Disconnected')
                    dispatch(disconnected())
                } else {
                    dispatch(App.showError(error))
                }
            })
        } catch(error){
            console.log('Error:')
            console.log(error)   
        }
    }
}
    
export const startScan = () => {
    return (dispatch, _getState, BLEManager) => {
        // you can use Device Manager here
        const subscription = BLEManager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                dispatch(scan());
                subscription.remove();
            }
        }, true);
    };
}

export const scan = () => {
    return (dispatch, getState, BLEManager) => {
        BLEManager.startDeviceScan([BLE.MAP_SERVICE], null, (error, device) => {
            
            if (error) { console.log(error.message); }
            
            console.log("Adding device " + device.id)
            dispatch(addDevice(device))
            dispatch(connectTo(device))
        });
    }
}

// For now we assume there's only 1 map in range and if we find our 
// service UUID we will automatically connect to it
export const connectTo = (device) => {
    return (dispatch, getState, BLEManager) => {
        console.log("Connecting to device " + device.id)
        BLEManager.stopDeviceScan();
        device.connect()
          .then((device) => {
              dispatch(connectedDevice(device))
              dispatch(App.showConnectedSnackbar(device));
            return device.discoverAllServicesAndCharacteristics();
          })
          .then(async (device) => {
                console.log('Subscribing')
                updateRSSI(device);
                dispatch(readIPAddress(device))
                dispatch(readInternetStatus(device))
                dispatch(readWeatherData(device))



                // FIXME - Break out subscriptions
                device.monitorCharacteristicForService(BLE.WIFI_SERVICE, BLE.SCAN_CHARACTERISTIC, (error, characteristic) => {
                    if (characteristic && !error) {
                        const data = decode(characteristic.value);
                        console.log("Data:" + data)

                        if (data.slice(-1) == "\0") {
                            console.log("Got terminator")
                            dispatch(addWifiData(data.slice(0, -1)))
                            dispatch(reconstructData())
                        } else {
                            dispatch(addWifiData(data));
                        }
                    }
                });
                console.log("Subscribing wx")
                await device.monitorCharacteristicForService(BLE.MAP_SERVICE, BLE.WEATHER_DATA_CHARACTERISTIC, (error, characteristic) => {
                    if (characteristic && !error) {
                        const data = decode(characteristic.value);
                        console.log("Data wx:" + data)

                        if (data.slice(-1) == "\0") {
                            console.log("Got terminator")
                            dispatch(addAirportData(data.slice(0, -1)))
                            dispatch(reconstructAirportData())
                        } else {
                            dispatch(addAirportData(data));
                        }
                    }
                })
                
                
                return device
          }, (error) => {
            // this.setState({ status: error.message });
          })
          .then((device) => { console.log('reading wx'); dispatch(readWeatherData(device)) })
          .catch((error) => {
            device.cancelConnection();
            console.log(error);
          });
    }
}

export const connectToWifi = (details) => {
    return async (dispatch, getState, BLEManager) => {
        const connectionDetails = JSON.stringify(details)

        await getState().BLE.connectedDevice.writeCharacteristicWithResponseForService(BLE.WIFI_SERVICE, BLE.CONNECTION_CHARACTERISTIC, encode(connectionDetails)).then( () => {
            console.log('Done!')
            dispatch(hideConnectDialog())
        })
        // TODO:
        // dispatch CONNECTING_TO_WIFI
        
        
    }
}

export const disconnectWifi = () => {
    return async (dispatch, getState, BLEManager) => {
        const connectionDetails = JSON.stringify({operation: "disconnect"});

        await getState().BLE.connectedDevice.writeCharacteristicWithResponseForService(BLE.WIFI_SERVICE, BLE.CONNECTION_CHARACTERISTIC, encode(connectionDetails)).then( () => {
            console.log('Done!')
        })

        
        
    }
}

export const disconnectDevices = () => {
    return (_dispatch, _getState, BLEManager) => {
        BLEManager.connectedDevices().then((UUIDS) => { UUIDS.map((UUID) => { BLEManager.cancelDeviceConnection(UUID); }); });
    }
}

// Bluetooth helpers
//   These have to go somewhere
function encode(data: string) {
    return new Buffer(data).toString('base64');
}

function decode(data: string) {
    return new Buffer(data, 'base64').toString('utf8');
}

// FIXME: This doesn't appear to do anything...?
function updateRSSI(device){
    // device.readRSSI().then(() => {
    //     setTimeout(updateRSSI, 3000, device)
    // })
}

const readIPAddress = (device) => {
    return (dispatch, getState, BLEManager) => {
        device.readCharacteristicForService(BLE.MAP_SERVICE, BLE.IP_CHARACTERISTIC)
        .then((data) => {
            dispatch(setIPAddress(decode(data.value)))
        })
    }
}

const readInternetStatus = (device) => {
    return (dispatch, getState, BLEManager) => {
        device.readCharacteristicForService(BLE.WIFI_SERVICE, BLE.CONNECTED_TO_INTERNET_CHARACTERISTIC)
        .then((data) => {
            dispatch(setInternetConnectionStatus(decode(data.value)))
        })
    }
}

const readWeatherData = (device) => {
    return (dispatch, getState, BLEManager) => {
        getState().BLE.connectedDevice.writeCharacteristicWithResponseForService(BLE.MAP_SERVICE, BLE.WEATHER_DATA_CHARACTERISTIC, encode('1'))
    }
}
// function reconstructData() {
//     let joined = this.dataBuffer.join('');
//     console.log(joined);
//     return JSON.parse(this.dataBuffer.join(''));
//   }

  // End bluetooth helpers
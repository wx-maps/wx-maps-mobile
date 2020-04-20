import { Buffer } from 'buffer';
import * as BLE from '../lib/BLE'

import * as App from './AppActions'


export const ADD_DEVICE = 'ADD_DEVICE'
export const CONNECTED_DEVICE = 'CONNECTED_DEVICE'
export const ADD_WIFI_DATA = 'ADD_WIFI_DATA'
export const RECONSTRUCT_DATA = 'RECONSTRUCT_DATA'
export const SET_IP_ADDRESS = 'SET_IP_ADDRESS'
export const SET_INTERNET_CONNECTION_STATUS = 'SET_INTERNET_CONNECTION_STATUS'


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
export const reconstructData = () => (
    {
        type: RECONSTRUCT_DATA,
        payload: null,
    }
)

export const setIPAddress = (value) => (
    {
        type: SET_IP_ADDRESS,
        payload: value,
    }
)

export const setInternetConnectionStatus = (value) => (
    {
        type: SET_INTERNET_CONNECTION_STATUS,
        payload: value,
    }
)

export const scanWifi = (device) => {
    return async (dispatch, getState, BLEManager) => {
        // console.log('scanning')

        // console.log(getState().BLE.wifiService)
        // console.log(getState().BLE.scanCharacteristic)
        // console.log(encode("1"))
        // console.log(device.characteristics)

        await device.writeCharacteristicWithResponseForService(BLE.WIFI_SERVICE, BLE.SCAN_CHARACTERISTIC, encode("1"))
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
              dispatch(App.showSnackbar("Connected to device " + device.name + "\n(" + device.id + ')'))
            return device.discoverAllServicesAndCharacteristics();
          })
          .then((device) => {
                console.log('Subscribing')
                updateRSSI(device);
                dispatch(readIPAddress(device))
                dispatch(readInternetStatus(device))


                // FIXME - Break out subscriptions
                device.monitorCharacteristicForService(BLE.WIFI_SERVICE, BLE.SCAN_CHARACTERISTIC, (error, characteristic) => {
                    if (characteristic && !error) {
                        const data = decode(characteristic.value);
                        if (data.slice(-1) == "\0") {
                            dispatch(addWifiData(data.slice(0, -1)));
                            dispatch(reconstructData())
                            // this.setState({ wifiNetworks: this.reconstructData() });
                            
                        } else {
                            dispatch(addWifiData(data));
                        }
                    }
                });
                
                return device
          }, (error) => {
            // this.setState({ status: error.message });
          })
          .catch((error) => {
            device.cancelConnection();
            console.log(error);
          });
    }
}



export const disconnectDevices = () => {
    return (_dispatch, _getState, BLEManager) => {
        BLEManager.connectedDevices().then((UUIDS) => { UUIDS.map((UUID) => { BLEManager.cancelDeviceConnection(UUID); }); });
    }
}

// Bluetooth helpers
function encode(data: string) {
    return new Buffer(data).toString('base64');
}

function decode(data: string) {
    return new Buffer(data, 'base64').toString('utf8');
}

function updateRSSI(device){
    // device.readRSSI().then(
    //     setTimeout(updateRSSI, 3000, device)
    // )
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
            console.log(data.value)
        })
    }
}
// function reconstructData() {
//     let joined = this.dataBuffer.join('');
//     console.log(joined);
//     return JSON.parse(this.dataBuffer.join(''));
//   }

  // End bluetooth helpers
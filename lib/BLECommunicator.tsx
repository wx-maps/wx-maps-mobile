import { BleManager } from "react-native-ble-plx"
import * as AppActions from '../actions/AppActions'
import { Buffer } from 'buffer';

import { 
    scan, 
    addDevice, 
    connectTo, 
    connectedDevice,
    readIPAddress,
    readInternetStatus,
    readWeatherData,
    addWifiData,
    addAirportData,
    reconstructData,
    reconstructAirportData,
    clearWifiData,
    disconnected,
    setIPAddress,
    hideConnectDialog,
    setInternetConnectionStatus,
} from '../actions/BLEActions'

import * as MapService from './BLECommunicator/MapService'
import * as WifiService from './BLECommunicator/WifiService'


// export const MapService.UUID                          = 'a5023bbe-29f9-4385-ab43-a9b3600ab7c4'
// export const IP_CHARACTERISTIC                    = '7d17ff43-b02a-4586-a488-5a7fd0bc8856'
// export const WEATHER_DATA_CHARACTERISTIC          = '8dc27e53-225f-40a5-a198-b401b7786a5b'


// export const WifiService  WifiService.                       = 'ed6695dd-be8a-44d6-a11d-cb3348faa85a'
// export const SCAN_CHARACTERISTIC                  = 'fe600987-e2ea-4c16-b938-f5d04e904af2'
// export const CONNECTED_TO_INTERNET_CHARACTERISTIC = '544eb8bb-c6ba-4e94-b2e9-581855102634'
// export const CONNECTION_CHARACTERISTIC            = 'b4a7d251-7467-440c-9bf8-570f1fbc929f'

export class BLECommunicator {
    manager: BleManager
    dispatch: Function

    constructor(){
        this.manager = new BleManager();
        this.dispatch = null;
        console.log('UUID:', Map.UUID)
    }

    /************************************
     *
     *  Utilities
     * 
     *************************************/
    encode(data: string) {
        return new Buffer(data).toString('base64');
    }

     decode = (value: string) => {
        console.log('UUID:', Map.UUID)

        return new Buffer(value, 'base64').toString('utf8');
    }
    
    setDispatch(dispatch: Function){
        this.dispatch = dispatch;
    }

    /************************************
     *
     *  End Utilities
     * 
     *************************************/

    // BLE stuff
    startScan(){
        const subscription = this.manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                this.dispatch(scan());
                subscription.remove();
            }
        }, true);
    }

    scan(){
        this.manager.startDeviceScan([MapService.UUID], null, (error, device) => {
            
            if (error) { console.log(error.message); }
            
            console.log("Adding device " + device.id)
            this.dispatch(addDevice(device))
            this.dispatch(connectTo(device))
        });
    }

    connectTo(device){
        console.log("Connecting to device " + device.id)
        this.manager.stopDeviceScan();
        device.connect()
          .then((device) => {
              this.dispatch(connectedDevice(device))
              this.dispatch(AppActions.showConnectedSnackbar(device));
            return device.discoverAllServicesAndCharacteristics();
          })
          .then(async (device) => {
                console.log('Subscribing')
                // this.updateRSSI(device);
                this.subscribeToServices(device);
                return device
          }, (error) => {
            // this.setState({ status: error.message });
          })
          .then((device) => { 
                this.dispatch(readWeatherData(device)) 
                this.dispatch(readIPAddress(device))
                this.dispatch(readInternetStatus(device))
            })
          .catch((error) => {
            device.cancelConnection();
            console.log(error);
          });
    }
    
    disconnectDevices(){
        this.manager.connectedDevices().then(
            (UUIDS) => { UUIDS.map((UUID) => { this.manager.cancelDeviceConnection(UUID); }); }
        );
    }

    subscribeToServices(device){
        this.subscribeToWifiScanResults(device);
        this.subscribeToWeatherData(device);
    }

    subscribeToWifiScanResults(device){
        device.monitorCharacteristicForService(WifiService.UUID, WifiService.SCAN_CHARACTERISTIC, (error, characteristic) => {
            if (characteristic && !error) {
                const data = this.decode(characteristic.value);
                console.log("Data:" + data)

                if (data.slice(-1) == "\0") {
                    console.log("Got terminator")
                    this.dispatch(addWifiData(data.slice(0, -1)))
                    this.dispatch(reconstructData())
                } else {
                    this.dispatch(addWifiData(data));
                }
            }
        });
    }

    subscribeToWeatherData(device){
        device.monitorCharacteristicForService(MapService.UUID, MapService.WEATHER_DATA_CHARACTERISTIC, (error, characteristic) => {
            if (characteristic && !error) {
                const data = this.decode(characteristic.value);
                console.log("Data wx:" + data)

                if (data.slice(-1) == "\0") {
                    console.log("Got terminator")
                    this.dispatch(addAirportData(data.slice(0, -1)))
                    this.dispatch(reconstructAirportData())
                } else {
                    this.dispatch(addAirportData(data));
                }
            }
        })
    }

    // Wifi stuff
    scanWifi(connectedDevice){
        this.dispatch(clearWifiData())
        
        try{ 
            connectedDevice.writeCharacteristicWithResponseForService(WifiService.UUID, WifiService.SCAN_CHARACTERISTIC, this.encode("1")).then(() => {
                console.log("Done scanning")
            }).catch((error) => {
                console.log("Error")
                console.log(JSON.stringify(error))
                if(error.name == 'BleError' && error.errorCode == 205){
                    console.log('Disconnected')
                    this.dispatch(disconnected())
                } else {
                    this.dispatch(AppActions.showError(error))
                }
            })
        } catch(error){
            console.log('Error:')
            console.log(error)   
        }
    }

    async connectToWifi(connectedDevice){
        const connectionDetails = JSON.stringify(details)

        await connectedDevice.writeCharacteristicWithResponseForService(WifiService.UUID, WifiService.CONNECTION_CHARACTERISTIC, this.encode(connectionDetails))
        .then( () => {
            console.log('Done!')
            this.dispatch(hideConnectDialog())
        })
    }

    async disconnectFromWifi(connectedDevice){
        const connectionDetails = JSON.stringify({operation: "disconnect"});

        await connectedDevice.writeCharacteristicWithResponseForService(WifiService.UUID, WifiService.CONNECTION_CHARACTERISTIC, this.encode(connectionDetails))
        .then( () => {
            console.log('Done!')
        })
    }

    readIPAddress(device){
       device.readCharacteristicForService(MapService.UUID, MapService.IP_CHARACTERISTIC)
            .then((data) => { this.dispatch(setIPAddress(this.decode(data.value))) })
    }

    readInternetStatus(device){
        device.readCharacteristicForService(WifiService.UUID, WifiService.CONNECTED_TO_INTERNET_CHARACTERISTIC)
        .then((data) => {
            this.dispatch(setInternetConnectionStatus(this.decode(data.value)))
        })
    }
    
    // Weather stuff
    readWeatherData(connectedDevice){
        connectedDevice.writeCharacteristicWithResponseForService(MapService.UUID, MapService.WEATHER_DATA_CHARACTERISTIC, this.encode('1'))
    }
}
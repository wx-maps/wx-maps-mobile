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
    reconstructWifiData,
    reconstructAirportData,
    clearWifiData,
    disconnected,
    setIPAddress,
    hideConnectDialog,
    setInternetConnectionStatus,
    updateStatusString,
} from '../actions/BLEActions'

import * as MapService from './BLECommunicator/MapService'
import * as WifiService from './BLECommunicator/WifiService'


export class BLECommunicator {
    manager: BleManager
    dispatch: Function

    constructor(){
        this.manager = new BleManager();
        this.dispatch = null;
    }

    /************************************
     *
     *  Utilities
     * 
     *************************************/
    encode(data: string) { return new Buffer(data).toString('base64'); }

    decode = (value: string) => { return new Buffer(value, 'base64').toString('utf8'); }
    
    setDispatch(dispatch: Function){ this.dispatch = dispatch; }

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
                this.dispatch(updateStatusString("Connected!\nFetching weather data..."))
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
            this.rxData(error, characteristic, addWifiData, reconstructWifiData)
        })

    }

    subscribeToWeatherData(device){
        device.monitorCharacteristicForService(MapService.UUID, MapService.WEATHER_DATA_CHARACTERISTIC, (error, characteristic) => {
            this.rxData(error, characteristic, addAirportData, reconstructAirportData)
        })

    }

    // Receives larger amounts of data from the BLE connection. 
    // The server sends data in 20 byte chunks that we shover into $collector
    // When the transmission is complete the server appends a null terrminator
    // which then signals us we can reassemble the data using $assembler
    rxData(error, characteristic, collector: Function, assembler: Function){
        if (characteristic && !error) {
            const data = this.decode(characteristic.value);
            if (data.slice(-1) == "\0") {
                this.dispatch(collector(data.slice(0, -1)))
                this.dispatch(assembler())
                console.log("RX/Assembling BLE Data")
            } else {
                this.dispatch(collector(data));
            }
        }
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
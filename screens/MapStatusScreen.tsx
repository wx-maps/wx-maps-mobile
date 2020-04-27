import React, { Component } from 'react';
import {View, ScrollView, SafeAreaView} from 'react-native';
import { connect } from 'react-redux';

import { Button } from 'react-native-paper';

import { disconnectDevices, disconnectWifi } from '../actions/BLEActions';

import * as Styles from '../styles';


import { Status } from '../components/Status';
class Bluetooth extends Status{}
class DeviceName extends Status{}
class DeviceID extends Status{}
class DeviceRSSI extends Status{}
class InternetStatus extends Status{}
class IPStatus extends Status {}

class MapStatusScreen extends Component{
    bleConnected(){
        return this.props.BLE.connectedDevice
    }
    
    deviceName(){
        return (this.bleConnected() && this.props.BLE.connectedDevice.name)
    }

    deviceID(){
        return (this.bleConnected() && this.props.BLE.connectedDevice.id)
    }

    deviceRSSI(){
        return (this.props.BLE.devices[0] && this.props.BLE.devices[0].rssi)
    }

    internetConnected(){
        console.log(this.props.BLE)
        return (this.bleConnected() && this.props.BLE.wifi && this.props.BLE.wifi.connectedToInternet === "true")
    }

    ipAddress(){
        return (this.bleConnected() && this.props.BLE.wifi && this.props.BLE.wifi.ipAddress)
    }

    configWifiShouldRender(){
        return (this.bleConnected() && this.internetConnected())
    }

    render(){
        return(
            <SafeAreaView style={{height: '100%'}}>
                <ScrollView>   
                    <View style={Styles.Base.statusBoxContainer}>                     
                        <Bluetooth  itemName='Bluetooth' isConnected={this.props.BLE.isConnected} renderIfDisconnected={true} />
                        <DeviceName itemName='Device Name' connectedString={this.deviceName()} isConnected={this.props.BLE.isConnected}/>
                        <DeviceID   itemName='Device ID' connectedString={this.deviceID()} isConnected={this.props.BLE.isConnected} />
                        <DeviceRSSI itemName='Device RSSI' connectedString={ this.deviceRSSI() } isConnected={this.props.BLE.isConnected} />
                        <InternetStatus itemName='Internet'  isConnected={this.internetConnected()} renderIfDisconnected={true} />
                        <IPStatus itemName='IP Address' connectedString={this.ipAddress()} isConnected={this.internetConnected()}/>
                        <ConfigureWifi shouldRender={this.configWifiShouldRender()} navigation={this.props.navigation} style={{marginTop: 'auto'}} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

type ConfigureWifiProps = {
    shouldRender: boolean,
}
class ConfigureWifi extends Component<ConfigureWifiProps> {
    
    render(){
        if(this.props.shouldRender) { 
            return(
                <Button 
                    style={Styles.Base.statusBoxButton} 
                    mode='contained'
                    onPress={() => this.props.navigation.navigate('ConfigureWifi')}
                >
                    Configure WiFi
                </Button>
            )
        } else{
            return(null)
        }
    }
}



function mapStateToProps(state){
    const { BLE } = state
    return { BLE }
};

const mapDispatchToProps = dispatch => ({
    disconnectDevices: () => dispatch(disconnectDevices()),
    disconnectWifi: () => dispatch(disconnectWifi()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MapStatusScreen);
import React, { Component } from 'react';
import {StyleSheet, View, ScrollView, SafeAreaView} from 'react-native';
import { connect } from 'react-redux';

import { Button } from 'react-native-paper';

import { disconnectDevices, disconnectWifi } from '../actions/BLEActions';



import { Status } from '../components/Status';


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
        return (this.bleConnected() && !this.internetConnected())
    }

    render(){
        return(
            <SafeAreaView style={{height: '100%'}}>
                <ScrollView>   
                    <View style={styles.flexContainer}>                     
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

export const styles = StyleSheet.create({
    flexContainer: { flexDirection: "row", flex: 1,  flexWrap: 'wrap', justifyContent: 'space-evenly' },
    statusBox: {flex: 0, padding: 20, margin: 5, borderColor: 'black', textAlign: 'center', borderWidth: 0, },
});


class InternetStatus extends Status{
}

class ConfigureWifi extends Component {
    render(){
        if(this.props.shouldRender) { 
            return(
                <Button 
                    style={[styles.statusBox, {paddingTop: 40, paddingBottom: 40}]} 
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

class IPStatus extends Status {}
class Bluetooth extends Status{}
class DeviceName extends Status{}
class DeviceID extends Status{}
class DeviceRSSI extends Status{}


function mapStateToProps(state){
    const { BLE } = state
    return { BLE }
};

const mapDispatchToProps = dispatch => ({
    disconnectDevices: () => dispatch(disconnectDevices()),
    disconnectWifi: () => dispatch(disconnectWifi()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MapStatusScreen);
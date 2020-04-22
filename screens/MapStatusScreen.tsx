import React, { Component } from 'react';
import {StyleSheet, View, ScrollView, SafeAreaView} from 'react-native';
import { connect } from 'react-redux';

import { Button } from 'react-native-paper';


import { Status } from '../components/Status';


class MapStatusScreen extends Component{
    render(){
        return(
            <SafeAreaView style={{height: '100%'}}>
                <ScrollView>   
                    <View style={styles.flexContainer}>                     
                        <BluetoothStatus connectedDevice={ this.props.BLE.connectedDevice} renderIfDisconnected={true} />
                        <DeviceName connectedDevice={ this.props.BLE.connectedDevice }/>
                        <DeviceID connectedDevice={ this.props.BLE.connectedDevice } />
                        <DeviceRSSI connectedDevice={ this.props.BLE.devices[0] } />
                        <InternetStatus wifiInfo={this.props.BLE.wifi} renderIfDisconnected={true} />
                        <ConfigureWifi connectedDevice={this.props.BLE.connectedDevice} navigation={this.props.navigation}/>
                        <IPStatus wifiInfo={this.props.BLE.wifi} />
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
    constructor(props){
        super(props);
        this.itemName = 'Internet';

        (this.props.wifiInfo && this.props.wifiInfo.connectedToInternet === 'true') ? this.setIsConnected(true) : this.setIsConnected(false);

    }
}

class ConfigureWifi extends Component {
    constructor(props){
        super(props);
        
        this.shouldRender = false;

        this.bluetoothConnected = true;
        this.wifiConnected = false;

        this.setShouldRender();
    }

    setShouldRender(){
        this.shouldRender = (this.bluetoothConnected && !this.wifiConnected) ? true : false
    }

    render(){
        if(this.shouldRender) { 
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

class IPStatus extends Status {
    constructor(props){
        super(props);
        this.itemName = 'IP Address';

        (this.props.wifiInfo && this.props.wifiInfo.connectedToInternet === 'true') ? this.setIsConnected(true) : this.setIsConnected(false);
    }

    setConnectionString(){
        this.connectionString = (this.isConnected) ?  this.props.wifiInfo.ipAddress : Status.DISCONNECTED
    }
}

class BluetoothStatus extends Status{
    constructor(props){
        super(props);
        this.itemName = 'Bluetooth';

        (this.props.connectedDevice) ? this.setIsConnected(true) : this.setIsConnected(false);
    }
}

class DeviceName extends Status{
    constructor(props){
        super(props);
        this.itemName = 'Device Name';

        
        (this.props.connectedDevice) ? this.setIsConnected(true) : this.setIsConnected(false);
    }
    
    setConnectionString(){
        this.connectionString = (this.isConnected) ?  this.props.connectedDevice.name : Status.DISCONNECTED
    }
}

class DeviceID extends Status{
    constructor(props){
        super(props);
        this.itemName = 'Device ID';

        
        (this.props.connectedDevice) ? this.setIsConnected(true) : this.setIsConnected(false);
    }
    
    setConnectionString(){
        this.connectionString = (this.isConnected) ?  this.props.connectedDevice.id : Status.DISCONNECTED
    }
}

class DeviceRSSI extends Status{
    constructor(props){
        super(props);
        this.itemName = 'Device RSSI';

        
        (this.props.connectedDevice) ? this.setIsConnected(true) : this.setIsConnected(false);
    }
    
    setConnectionString(){
        this.connectionString = (this.isConnected) ?  this.props.connectedDevice.rssi : Status.DISCONNECTED
    }
}


function mapStateToProps(state){
    const { BLE } = state
    return { BLE }
};

const mapDispatchToProps = dispatch => ({
    // addDevice,
    // startScan: () => dispatch(startScan()),
    // disconnectDevices: () => dispatch(disconnectDevices()),
    // scanWifi: () => dispatch(scanWifi())
});

export default connect(mapStateToProps, mapDispatchToProps)(MapStatusScreen);
import React, { Component } from 'react';
import {StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';

import { Text, Card, Title, Caption } from 'react-native-paper';

import * as Styles from '../styles'



class MapStatusScreen extends Component{
    deviceConnected(){
        console.log(this.props.BLE.connectedDevice)
        return this.props.BLE.connectedDevice
    }

    deviceName(){
        if(!this.deviceConnected()){ return 'Disconnected' }
        return this.props.BLE.connectedDevice.name
    }

    deviceID(){
        if(!this.deviceConnected()){ return 'Disconnected' }

        return this.props.BLE.connectedDevice.id
    }

    // FIXME:Why does connectedDevice not show this but devices[0] does?
    deviceRSSI(){
        if(!this.deviceConnected()){ return 'Disconnected' }

        return this.props.BLE.devices[0].rssi
    }

    isConnectedToInternet(){
        if(!this.deviceConnected()){ return 'Disconnected' }

        return this.props.BLE.wifi.connectedToInternet == 'true' ? 'Connected' : 'Disconnected'
    }

    ipAddress(){
        if(!this.deviceConnected()){ return 'Disconnected' }
        return this.props.BLE.wifi.ipAddress
    }

    render(){
        return(
            <SafeAreaView>
                <ScrollView>   
                    <View style={styles.flexContainer}>                     
                        <BluetoothStatus connectedDevice={ this.props.BLE.connectedDevice } />
                    
                        <InternetStatus wifiInfo={this.props.BLE.wifi} />

                        <IPStatus wifiInfo={this.props.BLE.wifi} />

                        <DeviceName connectedDevice={ this.props.BLE.connectedDevice }/>

                        <DeviceID connectedDevice={ this.props.BLE.connectedDevice } />

                        <DeviceRSSI connectedDevice={ this.props.BLE.devices[0] } />
                    
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    flexContainer: { flexDirection: "row", flex: 1,  flexWrap: 'wrap', justifyContent: 'space-evenly' },
    statusBox: {flex: 0, padding: 20, margin: 5, borderColor: 'black', textAlign: 'center', borderWidth: 0, },
    cardContent: {paddingHorizontal: 5, paddingVertical: 5, textAlign: 'center'},
    centered: {textAlign: 'center'},
    success: {color: 'green'}
});


class Status extends Component {
    static CONNECTED= 'Connected'
    static DISCONNECTED = 'Disconnected'

    constructor(props){
        super(props);
        this.isConnected = false;
        this.connectionString = Status.DISCONNECTED;
        this.style = Styles.Colors.Failure;
        this.itemName = 'Generic Status'
    }

    setIsConnected(value){
        this.isConnected = value
        this.setConnectionString();
        this.setStyle()
    }

    setConnectionString(){
        this.connectionString = (this.isConnected) ?  Status.CONNECTED : Status.DISCONNECTED
    }

    setStyle(){
        this.style = (this.isConnected) ?  Styles.Colors.Success : Styles.Colors.Failure
    }

    render() {
        return(
            <StatusBox itemName={this.itemName} itemValue={this.connectionString} style={this.style} />
        )
    }
}
class IPStatus extends Status {
    constructor(props){
        super(props);
        this.itemName = 'IP Address';

        (this.props.wifiInfo) ? this.setIsConnected(true) : this.setIsConnected(false);
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

class InternetStatus extends Status{
    constructor(props){
        super(props);
        this.itemName = 'Internet';

        (this.props.wifiInfo && this.props.wifiInfo.connectedToInternet === 'true') ? this.setIsConnected(true) : this.setIsConnected(false);

    }
}

class StatusBox extends Component {
    render() {
        return(
            <Card style={[styles.statusBox, this.props.style]}>
                <Card.Content style={styles.cardContent}>
                    <Title style={[styles.centered, this.props.style]}>{this.props.itemValue}</Title>
                    <Caption style={[styles.centered, this.props.style]}>{this.props.itemName}</Caption>
                </Card.Content>
            </Card>
        )
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
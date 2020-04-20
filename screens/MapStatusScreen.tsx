import React, { Component } from 'react';
import {StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import { Text, Button, List, Snackbar } from 'react-native-paper';

import { Base } from '../styles'


class MapStatusScreen extends Component{
    connected(){
        return (this.props.BLE.connectedDevice === null) ? "No" : "Yes"
    }

    render(){
        // console.log(this.props)

        return(
            <View style={styles.container}>
                <Text>Map Status Screen</Text>
                <Text>Connected: {this.connected()}</Text>
                <DeviceInfo connectedDevice={this.props.BLE.connectedDevice} />
                <WifiInfo wifi={this.props.BLE.wifi} />
            </View>
        )
    }
}

class DeviceInfo extends Component {
    render(){
        // if(!this.props.connectedDevice) { return}
        return(
            <View style={styles.container}>
                <Text>Connected Device:</Text>
                <Text>Name: {this.props.connectedDevice.name } </Text>
                <Text>ID: { this.props.connectedDevice.id }</Text>
                <Text>RSSI: { this.props.connectedDevice.rssi }</Text>
            </View>
        )
    }
}

class WifiInfo extends Component {
    isConnectedToInternet(){
        return this.props.wifi.connectedToInternet == 'true' ? 'Yes' : 'No'
    }
    

    render(){
        console.log(this.props);
        return(
            <View style={styles.container}>
                <Text>Connected to Internet: {this.isConnectedToInternet()}</Text>
                <Text>IP: {this.props.wifi.ipAddress}</Text> 
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: { ...Base.container }
  });

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
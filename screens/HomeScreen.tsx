import React, { Component } from 'react';

import { View, StyleSheet } from 'react-native';
import { Text, Button, List, Snackbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { startScan, scanWifi, disconnectDevices } from '../actions/BLEActions';
import {hideSnackbar} from '../actions/AppActions'

import { Base } from '../styles'
require("json-circular-stringify");

class HomeScreen extends Component {
    constructor(props){
        super(props)
        this.props.startScan();
    }

    componentWillUnmount() {
        this.props.disconnectDevices()
    }

    render() {
        // console.log(this.props)
        return (<View style={styles.container}>
        <Text>Device count: {this.props.BLE.devices.length}</Text>
        {this.props.BLE.devices.map((device, i) => { return <BleDevice device={device} key={i} navigation={this.props.navigation} manager={this.manager} />; })}
        <Text>Connected Device: { this.props.BLE.connectedDevice && this.props.BLE.connectedDevice.name }</Text>

        <Button onPress={() => this.props.navigation.navigate('Details')}>Go To Details</Button>
        <Snackbar visible={this.props.App.snackBarVisible} duration={3000} onDismiss={() => { this.props.hideSnackbar() } }>{this.props.App.snackBarText}</Snackbar>
        <Button onPress={() => this.props.scanWifi()}>Scan</Button>

        </View>);
    }
}

const styles = StyleSheet.create({
    container: { ...Base.container }
});

class BleDevice extends Component {
    render(){
      return(
          <List.Item 
            title={this.props.device.name} 
            key={this.props.i} 
            description={this.props.device.id} 
            style={{width: '80%'}} 
            onPress={() => { this.props.navigation.navigate('Details')}}
          />
      )
    }
  }

  // const mapDispatchToProps = dispatch => (
//     bindActionCreators({
//         addDevice,
//         // startScan: () => dispatch(startScan())
//     }, dispatch)
// );

function mapStateToProps(state){
    const { BLE, App } = state
    return { BLE, App }
};

const mapDispatchToProps = dispatch => ({
    hideSnackbar: () => dispatch(hideSnackbar()),
    startScan: () => dispatch(startScan()),
    disconnectDevices: () => dispatch(disconnectDevices()),
    scanWifi: () => dispatch(scanWifi()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
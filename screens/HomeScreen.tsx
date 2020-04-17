import React, { Component } from 'react';

import { View, StyleSheet } from 'react-native';
import { Text, Button, List, Snackbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addDevice, startScan, scanWifi, disconnectDevices } from '../actions/BLEActions';

import { Base } from '../styles'

class HomeScreen extends Component {
    constructor(props){
        super(props)
        this.props.startScan();
    }

    componentWillUnmount() {
        this.props.disconnectDevices()
    }

    render() {
        return (<View style={styles.container}>
        <Text>Device count: {this.props.BLE.devices.length}</Text>
        {this.props.BLE.devices.map((device, i) => { return <BleDevice device={device} key={i} navigation={this.props.navigation} manager={this.manager} />; })}

        <Button onPress={() => this.props.navigation.navigate('Details')}>Go To Details</Button>
        <Snackbar visible={this.props.BLE.snackBarVisible}>{this.props.BLE.snackBarText}</Snackbar>
        <Button onPress={() => this.props.scanWifi()}>Go To Details</Button>

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
            onPress={() => { this.props.navigation.navigate('Details', { device: this.props.device, manager: this.props.manager })}}
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
    const { BLE } = state
    return { BLE }
};

const mapDispatchToProps = dispatch => ({
    addDevice,
    startScan: () => dispatch(startScan()),
    disconnectDevices: () => dispatch(disconnectDevices()),
    scanWifi: () => dispatch(scanWifi())
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
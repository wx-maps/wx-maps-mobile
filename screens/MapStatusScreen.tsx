import React, { Component } from 'react';
import {StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import { Text, Button, List, Snackbar } from 'react-native-paper';

import { Base } from '../styles'


class MapStatusScreen extends Component{
    render(){
        return(
            <View style={styles.container}>
                <Text>Map Status Screen</Text>
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
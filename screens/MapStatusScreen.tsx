import React, { Component } from 'react';
import {StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';

import { Text, Card, Title, Caption } from 'react-native-paper';

import { Base } from '../styles'


class MapStatusScreen extends Component{
    isConnected(){
        return this.props.BLE.connectedDevice
    }
    connected(){
        if(!this.isConnected()) { return 'Disconnected' }
        return (this.props.BLE.connectedDevice === null) ? 'Disconnected' : 'Connected'
    }

    deviceName(){
        if(!this.isConnected()) { return 'Disconnected' }

        return this.props.BLE.connectedDevice.name
    }

    deviceID(){
        if(!this.isConnected()) { return 'Disconnected' }

        return this.props.BLE.connectedDevice.id
        // return 'blah'
    }

    // FIXME:Why does connectedDevice not show this but devices[0] does?
    deviceRSSI(){
        if(!this.isConnected()) { return 'Disconnected' }

        return this.props.BLE.devices[0].rssi
    }

    isConnectedToInternet(){
        if(!this.isConnected()) { return 'Disconnected' }

        return this.props.BLE.wifi.connectedToInternet == 'true' ? 'Connected' : 'Disconnected'
    }

    ipAddress(){
        if(!this.isConnected()) { return 'Disconnected' }

        return this.props.BLE.wifi.ipAddress
    }

    render(){
        return(
            <SafeAreaView style={{borderColor: 'black', borderWidth: 2, flex: 1}}>
                <View style={styles.flexContainer}>
                    <ScrollView>                        
                        <RowContainer>
                            <StatusBox  itemName='Bluetooth' itemValue={this.connected()} />
                            <StatusBox  itemName='Internet' itemValue={this.isConnectedToInternet()} />

                        </RowContainer>  
                        <RowContainer>
                            <StatusBox  itemName='IP Address' itemValue={this.ipAddress()} />
                            <StatusBox  itemName='Device Name' itemValue={this.deviceName()} />

                        </RowContainer>
                        <RowContainer>
                        <StatusBox  itemName='Device ID' itemValue={this.deviceID()} />                            

                        </RowContainer>
                        <RowContainer>
                        <StatusBox  itemName='RSSI' itemValue={this.deviceRSSI()} />

                            <StatusBox  itemName='Internet' itemValue={this.isConnectedToInternet()} />
                        </RowContainer>
                
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    rowContainer: { flexDirection: 'row', flex: 2, justifyContent: 'space-between'},
    flexContainer: { flexDirection: "column", flex: 1, },
    statusBox: {flex: 1, padding: 10, margin: 5, borderColor: 'black', textAlign: 'center', borderWidth: 0},
    cardContent: {paddingHorizontal: 5, paddingVertical: 5, textAlign: 'center'},
    centered: {textAlign: 'center'},
    success: {color: 'green'}
});

class RowContainer extends Component {
    render(){
        return(
            <View style={styles.rowContainer}>{this.props.children}</View>
        )
    }
}


class StatusBox extends Component {
    render() {
        return(
            <Card style={styles.statusBox}>
                <Card.Content style={styles.cardContent}>
                    <Title style={styles.centered}>{this.props.itemValue}</Title>
                    <Caption style={styles.centered}>{this.props.itemName}</Caption>
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
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
                <ScrollView style={styles.flexContainer}>                        
                        {/* <RowContainer> */}
                            <StatusBox  itemName='Bluetooth' itemValue={this.connected()} />
                            <StatusBox  itemName='Device Name' itemValue={this.deviceName()} />
                        {/* </RowContainer>  
                        <RowContainer> */}
                            <StatusBox  itemName='Device ID' itemValue={this.deviceID()} />                            
                        {/* </RowContainer>
                        <RowContainer> */}
                            <StatusBox  itemName='RSSI' itemValue={this.deviceRSSI()} />
                            <StatusBox  itemName='Internet' itemValue={this.isConnectedToInternet()} />
                        {/* </RowContainer>
                        <RowContainer> */}
                            <StatusBox  itemName='IP Address' itemValue={this.ipAddress()} />
                            <StatusBox  itemName='Internet' itemValue={this.isConnectedToInternet()} />
                        {/* </RowContainer> */}
                
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    flexContainer: { flexDirection: "row", flex: 1,},
    rowContainer: { flexDirection: 'row', flex: 2, justifyContent: 'space-between'},
    statusBox: {flex: 1, padding: 20, borderColor: 'black', textAlign: 'center', borderWidth: 0, margin: 5, marginLeft: 10},
    cardContent: {paddingHorizontal: 5, paddingVertical: 5, textAlign: 'center'},
    centered: {textAlign: 'center'}


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



class WifiInfo extends Component {
    isConnectedToInternet(){
        return this.props.wifi.connectedToInternet == 'true' ? 'Connected' : 'Disconnected'
    }
    

    render(){
        return(
            <Text>
                <Text>{this.isConnectedToInternet() + "\n"}</Text>
                <Text>IP: {this.props.wifi.ipAddress}</Text> 
            </Text>
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
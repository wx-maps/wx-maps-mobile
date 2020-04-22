import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Headline, Button, Dialog, Portal, Text, TextInput } from 'react-native-paper';
import { scanWifi, connectToWifi, showConnectDialog, hideConnectDialog } from '../actions/BLEActions';
import {Item} from '../components/Item'
const shortid = require('shortid');

import { Base } from '../styles'

class ConfigureWifiScreen extends Component {
  constructor(props) {
    super(props);
    if(this.props.BLE.wifiNetworks.length == 0) { this.props.scanWifi() }
    this.title = 'Select A Network';
  }

  showConnectDialog = (wifiNetwork) => {
    this.props.showConnectDialog(wifiNetwork)
  }

  connectToWifi = () => {
    // this.setState({
    //   connectingText: 'Connecting...',
    //   connecting: true,
    // })

    this.props.connectToWifi(
      {
        ssid: this.props.BLE.wifi.selectedWifiNetwork.ssid, 
        password: this.state.wifiPassword,
      }
    )
  }

  render() {

    const networks = this.props.BLE.wifiNetworks.map((wifiNetwork, i) => { 

      return(<Item key={shortid.generate()} itemCaption={wifiNetwork.quality + '%'} onPress={ () => { this.showConnectDialog(wifiNetwork) } }>{wifiNetwork.ssid}</Item>)
    })
    console.log(this.props.BLE.wifi)
    return (
      <SafeAreaView style={{height: '100%'}}>
        <ScrollView>
          <Headline style={{textAlign: 'center'}}>{this.title}</Headline>
          {networks}
          <Button onPress={() => {this.props.scanWifi()}}>Scan Again</Button>
        </ScrollView>

        <Portal>
            <Dialog
              visible={this.props.BLE.wifi.connectDialogVisible}
              onDismiss={() => { this.hideConnectDialog }}
            >
              <Dialog.Title>Connect to {this.props.BLE.wifi.selectedWifiNetwork.ssid}</Dialog.Title>
              <Dialog.Content>
                <TextInput label='Password' mode='outlined' onChangeText={ text => this.setState({ wifiPassword: text }) }/>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={this.props.hideConnectDialog}>Cancel</Button>
                <Button onPress={this.connectToWifi}>Connect</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
      </SafeAreaView>
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
  scanWifi: () => dispatch(scanWifi()),
  connectToWifi: (details) => dispatch(connectToWifi(details)),
  showConnectDialog: (selectedWifiNetwork) => dispatch(showConnectDialog(selectedWifiNetwork)),
  hideConnectDialog: () => dispatch(hideConnectDialog())
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureWifiScreen);
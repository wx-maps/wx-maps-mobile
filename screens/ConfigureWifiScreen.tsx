import React, { Component } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Headline, Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { scanWifi, connectToWifi, showConnectDialog, hideConnectDialog } from '../actions/BLEActions';
import {Item} from '../components/Item'
const shortid = require('shortid');

type ConfigureWifiScreenProps = {
  scanWifi: Function,
  showConnectDialog: Function,
  connectToWifi: Function,
}

type ConfigureWifiScreenState = {
  wifiPassword: String,
}

class ConfigureWifiScreen extends Component<ConfigureWifiScreenProps, ConfigureWifiScreenState> {
  title: string;
  
  constructor(props) {
    super(props);
    this.state = {
      wifiPassword: ''
    }

    if(this.props.BLE.wifiNetworks.length == 0) { this.props.scanWifi() }
    this.title = 'Select A Network';
  }

  showConnectDialog = (wifiNetwork) => {
    this.props.showConnectDialog(wifiNetwork)
  }

  connectToWifi = () => {
    this.props.connectToWifi(
      {
        operation: 'connect',
        ssid: this.props.BLE.wifi.selectedWifiNetwork.ssid, 
        password: this.state.wifiPassword,
      }
    )
  }

  render() {
    return (
      <SafeAreaView style={{height: '100%'}}>
        <ScrollView>
          <Headline style={{textAlign: 'center'}}>{this.title}</Headline>
          {
            this.props.BLE.wifiNetworks.map((wifiNetwork, i) => { 
              return(<Item key={shortid.generate()} itemCaption={wifiNetwork.quality + '%'} onPress={ () => { this.showConnectDialog(wifiNetwork) } }>{wifiNetwork.ssid}</Item>)
            })
          }
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
                { /* Deal with unhandled promise */ }
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
import React, { Component } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Headline, Button, Dialog, Portal, Text, TextInput } from 'react-native-paper';
import { scanWifi, connectToWifi } from '../actions/BLEActions';
import {Item} from '../components/Item'
const shortid = require('shortid');

import { Base } from '../styles'

class ConfigureWifiScreen extends Component {
  
  constructor(props) {
    super(props);
    if(this.props.BLE.wifiNetworks.length == 0) { this.props.scanWifi() }

    this.state = {
        connectDialogVisible: false,
        selectedNetwork: '',
        connecting: false
    }
  }

  hideConnectDialog = () => {
    console.log('HIDE')
    this.setState({connectDialogVisible: false})
  }

  showConnectDialog = (wifiNetwork) => {
    this.setState({
      connectDialogVisible: true,
      selectedNetwork: wifiNetwork,
      wifiPassword: ''
    })
  }

  connectToWifi = () => {
    this.setState({
      connectingText: 'Connecting...',
      connecting: true,
    })

    this.props.connectToWifi(
      {
        ssid: this.state.selectedNetwork.ssid, 
        password: this.state.wifiPassword,
      }
    )

    console.log('Password: ')
    console.log(this.state.wifiPassword)

    console.log(this.state.selectedNetwork.ssid)
  }

  
  render() {
    const networks = this.props.BLE.wifiNetworks.map((wifiNetwork, i) => { 

      return(<Item key={shortid.generate()} itemCaption={wifiNetwork.quality + '%'} onPress={ () => { this.showConnectDialog(wifiNetwork) } }>{wifiNetwork.ssid}</Item>)
  })

    return (
      <SafeAreaView style={{height: '100%'}}>
        <ScrollView>
          <Headline style={{textAlign: 'center'}}>Wifi Networks</Headline>
          {networks}
          <Button onPress={() => {this.props.scanWifi()}}>Rescan</Button>

          <Portal>
            <Dialog
              visible={this.state.connectDialogVisible}
              onDismiss={() => { this.hideConnectDialog }}

            >
              <Dialog.Title>Connect to {this.state.selectedNetwork.ssid}</Dialog.Title>
              <Dialog.Content>
                <TextInput label='Password' mode='outlined' onChangeText={ text => this.setState({ wifiPassword: text }) }/>
                <Text>{this.state.connectingText}</Text> 
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={this.hideConnectDialog}>Cancel</Button>
                <Button onPress={this.connectToWifi}>Connect</Button>
            </Dialog.Actions>
            </Dialog>
          </Portal>
        </ScrollView>
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
  connectToWifi: (details) => dispatch(connectToWifi(details))
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureWifiScreen);
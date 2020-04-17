import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Buffer } from 'buffer';
import { connect } from 'react-redux';
import { Text, Button } from 'react-native-paper';

import { Base } from '../styles'

class DetailsScreen extends Component {
  
  params: any;
  device: any;
  manager: any;
  wifiService: string;
  scanCharacteristic: string;
  dataBuffer: never[];

  constructor(props) {
    super(props);
    this.params = this.props.route.params;
    this.device = this.params.device;
    this.manager = this.params.manager;
    this.dataBuffer = [];
    this.wifiService = 'ed6695dd-be8a-44d6-a11d-cb3348faa85a';
    this.scanCharacteristic = 'fe600987-e2ea-4c16-b938-f5d04e904af2';
  
    this.state = {
      connecting: false,
      characteristics: [],
      status: 'empty',
      services: [],
      wifiNetworks: []
    };
  }

  componentDidMount() {
    this.connect();
  }

  componentWillUnmount() {
    console.log("Disconnecting");
    // this.device.cancelConnection();
  }

  connect() {
    // this.stopScan();
    // this.device.connect()
    //   .then((device) => {
    //     this.setState({ status: "Connected...discovering" });
    //     return this.discover();
    //   })
    //   .then((device) => {
    //     return this.subscribe();
    //   }, (error) => {
    //     this.setState({ status: error.message });
    //   })
    //   .catch((error) => {
    //     this.device.cancelConnection();
    //     console.log(error);
    //   });
  }


  // Bluetooth helpers
  encode(data: string) {
    return new Buffer(data).toString('base64');
  }

  decode(data: string) {
    return new Buffer(data, 'base64').toString('utf8');
  }

  // reconstructData() {
  //   let joined = this.dataBuffer.join('');
  //   console.log(joined);
  //   return JSON.parse(this.dataBuffer.join(''));
  // }

  // End bluetooth helpers


  async scanWifi() {
    this.setState({ status: "Discovered...services" });
    this.setState({ status: "writing..." });
    const characteristic = await this.device.writeCharacteristicWithResponseForService(this.wifiService, this.scanCharacteristic, this.encode("1"));
  }

  // subscribe() {
  //   this.device.monitorCharacteristicForService(this.wifiService, this.scanCharacteristic, (error, characteristic) => {
  //     if (characteristic && !error) {
  //       const data = this.decode(characteristic.value);
  //       if (data.slice(-1) == "\0") {
  //         this.dataBuffer.push(data.slice(0, -1));
  //         this.setState({ wifiNetworks: this.reconstructData() });
  //         console.log(this.data);
  //       }
  //       else {
  //         this.dataBuffer.push(data);
  //       }
  //     }
  //   });
  // }
  
  render() {
    const networks = this.props.BLE.wifiNetworks.map((wifiNetwork, i) => { return <Text key={i}>{wifiNetwork.ssid}</Text>; })
    return (<View style={styles.container}>
      <Text>Details for {this.device.name}!</Text>
      <Text>{this.device.rssi}</Text>
      <Text>{this.device.id}</Text>

      {networks}

      <Button onPress={() => this.scanWifi()}>Start Scan</Button>

      <Button onPress={() => this.props.navigation.navigate('Home')}>Go Home</Button>
    </View>);
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailsScreen);
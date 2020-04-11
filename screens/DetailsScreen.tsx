import React, { Component } from 'react';
import { View } from 'react-native';
import { Buffer } from 'buffer';
import { Text, Button } from 'react-native-paper';
import { styles } from '../App';

export class DetailsScreen extends Component {
  
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
    this.device.cancelConnection();
  }
  connect() {
    this.stopScan();
    this.device.connect()
      .then((device) => {
        this.setState({ status: "Connected...discovering" });
        return this.discover();
      })
      .then((device) => {
        return this.subscribe();
      }, (error) => {
        this.setState({ status: error.message });
      })
      .catch((error) => {
        this.device.cancelConnection();
        console.log(error);
      });
  }
  stopScan() {
    this.manager.stopDeviceScan();
  }
  discover() {
    return this.device.discoverAllServicesAndCharacteristics();
  }
  // Bluetooth helpers
  encode(data: string) {
    return new Buffer(data).toString('base64');
  }
  decode(data: string) {
    return new Buffer(data, 'base64').toString('utf8');
  }
  reconstructData() {
    let joined = this.dataBuffer.join('');
    console.log(joined);
    return JSON.parse(this.dataBuffer.join(''));
  }
  // End bluetooth helpers
  async scanWifi() {
    this.setState({ status: "Discovered...services" });
    this.setState({ status: "writing..." });
    const characteristic = await this.device.writeCharacteristicWithResponseForService(this.wifiService, this.scanCharacteristic, this.encode("1"));
  }
  subscribe() {
    this.device.monitorCharacteristicForService(this.wifiService, this.scanCharacteristic, (error, characteristic) => {
      if (characteristic && !error) {
        const data = this.decode(characteristic.value);
        if (data.slice(-1) == "\0") {
          this.dataBuffer.push(data.slice(0, -1));
          this.setState({ wifiNetworks: this.reconstructData() });
          console.log(this.data);
        }
        else {
          this.dataBuffer.push(data);
        }
      }
    });
  }
  render() {
    return (<View style={styles.container}>
      <Text>Details for {this.device.name}!</Text>
      <Text>{this.device.rssi}</Text>
      <Text>{this.device.id}</Text>
      <Text>{this.state.status}</Text>
      {this.state.wifiNetworks.map((wifiNetwork, i) => { return <Text key={i}>{wifiNetwork.ssid}</Text>; })}

      <Button onPress={() => this.scanWifi()}>Start Scan</Button>

      <Button onPress={() => this.props.navigation.navigate('Home')}>Go Home</Button>
    </View>);
  }
}

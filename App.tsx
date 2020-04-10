import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Buffer } from 'buffer'
import { Provider as PaperProvider, Text, Button, List, Snackbar } from 'react-native-paper';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { BleManager } from "react-native-ble-plx";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';


// Screens
import { MapStatusScreen } from './screens/MapStatusScreen'

import { Base } from './styles'


class HomeScreen extends Component {
  manager: BleManager;
  wifiService: string;
  mapService: string;


  constructor(props) {
    super(props);
    this.manager = new BleManager();
    this.wifiService = 'ed6695dd-be8a-44d6-a11d-cb3348faa85a';
    this.mapService = 'a5023bbe-29f9-4385-ab43-a9b3600ab7c4';

    this.state = { 
      devices: [],
      info: ''
    }

  }
  componentWillUnmount(){
    const connectedDevices = this.manager.connectedDevices().then((UUIDS) => { UUIDS.map((UUID) => { this.manager.cancelDeviceConnection(UUID)}) })
  }

  componentDidMount() {
    this.manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
          this.scan();
      }
    }, true);
  }
  
  scan(){
    this.manager.startDeviceScan([this.mapService], null, (error, device) => {
      console.log("Scanning...")
      
      if (error) {
        console.log(error.message)
        return
      }

      this.setState({ devices: this.state.devices.concat(device)}) ;
    })
  }
  
  render(){
    return(
      <View style={styles.container}>
        <Text>Device count: {this.state.devices.length}</Text>
        {this.state.devices.map((device, i) => { return <BleDevice device={device} key={i} navigation={this.props.navigation} manager={this.manager}/> })}

        <Button
          onPress={() => this.props.navigation.navigate('Details')}
      >Go To Details</Button>
      </View>
    )
  }
}

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

class DetailsScreen extends Component {
  params: any;
  device: any;
  manager: any;
  wifiService: string;
  scanCharacteristic: string;
  dataBuffer: never[];

  constructor(props){
    super(props);

    this.params = this.props.route.params;
    this.device = this.params.device;
    this.manager = this.params.manager;
    this.dataBuffer = [];

    this.wifiService = 'ed6695dd-be8a-44d6-a11d-cb3348faa85a';
    this.scanCharacteristic = 'fe600987-e2ea-4c16-b938-f5d04e904af2'


    this.state = { 
      connecting: false,
      characteristics: [],
      status: 'empty',
      services: [],
      wifiNetworks: []
    }    
  }
  
  componentDidMount(){
    this.connect();
  }

  componentWillUnmount(){
    console.log("Disconnecting")
    this.device.cancelConnection()
  }
  
connect(){
    this.stopScan();

    this.device.connect()
    .then((device) => {
      this.setState({status: "Connected...discovering"})
      return this.discover();
    })
    .then((device) => {
      return this.subscribe();
    }, (error) => {
      this.setState({status: error.message})
    })
    .catch((error) => {
      this.device.cancelConnection();
      console.log(error)
    })
  }

  stopScan(){
    this.manager.stopDeviceScan();
  }

  discover(){
    return this.device.discoverAllServicesAndCharacteristics()
  }

  // Bluetooth helpers
  encode(data: string){
    return new Buffer(data).toString('base64');
  }

  decode(data: string){
    return new Buffer(data, 'base64').toString('utf8');
  }
  
  reconstructData(){
    let joined = this.dataBuffer.join('')
    console.log(joined)
    return JSON.parse(this.dataBuffer.join(''))
  }

  // End bluetooth helpers

  async scanWifi(){
    this.setState({status: "Discovered...services"})
    this.setState({status: "writing..."})

    const characteristic = await this.device.writeCharacteristicWithResponseForService(this.wifiService, this.scanCharacteristic, this.encode("1"))
  }

  subscribe(){
    this.device.monitorCharacteristicForService(this.wifiService, this.scanCharacteristic, (error, characteristic) => { 
      if(characteristic && !error) { 
        const data = this.decode(characteristic.value);

        if(data.slice(-1) == "\0"){
          this.dataBuffer.push(data.slice(0, -1));
          this.setState({ wifiNetworks: this.reconstructData()});
          console.log(this.data)
        }else{
          this.dataBuffer.push(data);
        }
      }
   })
  }
  
  render(){
    return(
      <View style={styles.container}>
        <Text>Details for {this.device.name}!</Text>
        <Text>{this.device.rssi}</Text>
        <Text>{this.device.id}</Text>
        <Text>{this.state.status}</Text>
        {this.state.wifiNetworks.map((wifiNetwork, i) => { return <Text key={i}>{wifiNetwork.ssid}</Text> })}

        <Button onPress={() => this.scanWifi() } >Start Scan</Button>

        <Button onPress={() => this.props.navigation.navigate('Home')} >Go Home</Button>
      </View>
    )
  }
}

const Tab = createMaterialBottomTabNavigator();

export default class App extends Component {
  constructor(props){
    super(props)
    console.log("Welcome!")
    this.manager = new BleManager();

  }
  render() {
    return(
      <PaperProvider>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Details" component={DetailsScreen} />
            <Tab.Screen name="Map Status" component={MapStatusScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    )
  }
}

const styles = StyleSheet.create({
  container: { ...Base.container }
});

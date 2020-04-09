import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider, Text, Button, List, Snackbar } from 'react-native-paper';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BleManager } from "react-native-ble-plx";


class HomeScreen extends Component {
  constructor() {
    super();
    this.manager = new BleManager();
    this.state = { 
      devices: [],
      info: ''
    }

    
    this.scanServiceUUID = 'ed6695ddbe8a44d6a11dcb3348faa85a';
  }
  componentDidMount() {
    this.manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
          this.scanAndConnect();
      }
    }, true);
  }
  
  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
        console.log("Scanning...")
        console.log(device)

        if (error) {
          console.log(error.message)
          return
        }

        if (device.name === 'WX Maps' || device.name === 'WXMaps' || device.localName === 'WXMaps' || device.localName === 'WXMap') {
          console.log("Connecting to map")
          this.manager.stopDeviceScan()
          device.connect()
          .then((device) => {
            console.log("Discovering services and characteristics")
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
            console.log("Setting notifications")
            return this.subscribe(device)
          })
          .then(() => {
            console.log("Listening...")
          }, (error) => {
            console.log(error.message)
          })
        }
      });
  };
  
  async subscribe(device){
    const service = 'ed6695dd-be8a-44d6-a11d-cb3348faa85a';
    const scanCharacteristic = 'fe600987-e2ea-4c16-b938-f5d04e904af2'
    this.setState({status: "writing..."})

    const characteristic = await device.writeCharacteristicWithResponseForService(service, scanCharacteristic, "SGkgU3RlcGhhbmllIQ==");
    device.cancelConnection();
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
  constructor(props){
    super(props);

    this.params = this.props.route.params;
    this.device = this.params.device;
    this.manager = this.params.manager;


    this.state = { 
      connecting: false,
      characteristics: [],
      status: 'empty',
      services: [],
      device: this.params.device
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
    this.manager.stopDeviceScan();

    this.device.connect()
    .then((device) => {
      this.setState({status: "Connected...discovering"})
      
      return device.discoverAllServicesAndCharacteristics()
    })
    .then((device) => {
      this.setState({
        status: "Discovered...services",
        device: device
      })
      console.log(this.state.device.serviceUUIDs);
      console.log(this.state.device.serviceUUIDs);

      this.subscribe();
      
    }, (error) => {
      this.setState({status: error.message})
    })
    .catch((error) => {
      console.log(error)
    })
  }

  async subscribe(device){
    const service = 'ed6695dd-be8a-44d6-a11d-cb3348faa85a';
    const scanCharacteristic = 'fe600987-e2ea-4c16-b938-f5d04e904af2'
    this.setState({status: "writing..."})

    const characteristic = await this.state.device.writeCharacteristicWithResponseForService(service, scanCharacteristic, "0x01")
    this.state.device.cancelConnection();
  }
  
  render(){
    return(
      <View style={styles.container}>
        <Text>Details for {this.device.name}!</Text>
        <Text>{this.device.rssi}</Text>
        <Text>{this.device.id}</Text>
        <Text>{this.state.status}</Text>
        <Text>{JSON.stringify(this.state.services)}</Text>
        <Button onPress={() => this.props.navigation.navigate('Home')} >Go Home</Button>
      </View>
    )
  }
}


const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return(
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

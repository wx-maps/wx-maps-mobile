import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider, Text, Button} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BleManager } from "react-native-ble-plx";


class HomeScreen extends Component {
  constructor() {
    super();
    this.manager = new BleManager();
    this.state = { 
      devices: []
    }
  }
  componentDidMount() {
    const subscription = this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
            this.scanAndConnect();
            subscription.remove();
        }
    }, true);
  }
  
  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Handle error (scanning will be stopped automatically)
            return
        }

        console.log(device.name);
        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        if (device.name === 'TI BLE Sensor Tag' || 
            device.name === 'SensorTag') {
            
            // Stop scanning as it's not necessary if you are scanning for one device.
            this.manager.stopDeviceScan();

            // Proceed with connection.
        }
    });
  }
  
  render(){
    return(
      <View style={styles.container}>
        <Text>I'm back!</Text>
        <Button
          onPress={() => this.props.navigation.navigate('Details')}
      >Go To Details</Button>
      </View>
    )
  }
}

class DetailsScreen extends Component {
  render(){
    return(
      <View style={styles.container}>
        <Text>Details!</Text>
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

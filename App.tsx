import React, { Component } from 'react';
import { Provider as PaperProvider, Snackbar, IconButton } from 'react-native-paper';
import { NavigationContainer, CommonActions} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// import { BleManager } from "react-native-ble-plx";


import { startScan, disconnectDevices } from './actions/BLEActions';
import { hideSnackbar } from './actions/AppActions';


// Redux
import { Provider as StoreProvider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/';
import thunk from 'redux-thunk';

// Screens
import MapStatusScreen from './screens/MapStatusScreen';
import HomeScreen from './screens/HomeScreen';
import ConfigureWifiScreen from './screens/ConfigureWifiScreen';
import ControlScreen from './screens/ControlScreen';

//
import * as Styles from './styles'
import {BLECommunicator} from './lib/BLECommunicator'


// const BLEManager = new BleManager();
const BleCommunicator = new BLECommunicator();
const store = createStore(rootReducer, applyMiddleware(thunk.withExtraArgument({BleCommunicator})));

const StatusStack = createStackNavigator();
const ControlStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

class StatusStackScreen extends Component {
  render(){
    return(
      <StatusStack.Navigator headerMode='none' >
        <StatusStack.Screen name="MapStatus" component={MapStatusScreen} />
        <StatusStack.Screen name="ConfigureWifi" component={ConfigureWifiScreen} />
     </StatusStack.Navigator>
    )
  }
}

class ControlStackScreen extends Component {
  render(){
    return(
      <ControlStack.Navigator headerMode='none' >
        <ControlStack.Screen name="Control" component={ControlScreen} />
     </ControlStack.Navigator>
    )
  }
}


class App extends Component {
  constructor(props){
    super(props)
    console.log("Welcome!");
    this.props.startScan();
    BleCommunicator.setDispatch(store.dispatch)
  }

  componentWillUnmount() {
    console.log("Disconnecting")
    this.props.disconnectDevices();
}
  
  render() {
    return(
        <PaperProvider>
          <NavigationContainer>        
            <Tab.Navigator barStyle={Styles.Colors.barColor}>
              <Tab.Screen name="Weather" component={HomeScreen} />
              <Tab.Screen name="Map Control" component={ControlStackScreen} />
              <Tab.Screen name="Map Status" component={StatusStackScreen} />
            </Tab.Navigator>
            <Snackbar style={{marginBottom: 60}} duration={3000} visible={this.props.App.snackbarVisible} onDismiss={() => {this.props.hideSnackbar()}}>
              {this.props.App.snackbarText}
            </Snackbar>
          </NavigationContainer>
        </PaperProvider>
    )
  }
}

function mapStateToProps(state){
  const { BLE, App } = state
  return { BLE, App }
};

const mapDispatchToProps = dispatch => ({
  hideSnackbar: () => dispatch(hideSnackbar()),
  startScan: () => dispatch(startScan()),
  disconnectDevices: () => dispatch(disconnectDevices()),
});


const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default () => {
  return <StoreProvider store={store}><ConnectedApp /></StoreProvider>
}
import React, { Component } from 'react';
import { Provider as PaperProvider, Snackbar } from 'react-native-paper';
import { NavigationContainer, CommonActions} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { BleManager } from "react-native-ble-plx";



// Redux
import { Provider as StoreProvider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/';
import thunk from 'redux-thunk';

// Screens
import MapStatusScreen from './screens/MapStatusScreen';
import HomeScreen from './screens/HomeScreen';
import ConfigureWifiScreen from './screens/ConfigureWifiScreen';

//
import * as Styles from './styles'


const BLEManager = new BleManager();


const StatusStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const store = createStore(rootReducer, applyMiddleware(thunk.withExtraArgument(BLEManager)));


function StatusStackScreen(){
  return(
    <StatusStack.Navigator headerMode='none' >
      <StatusStack.Screen name="MapStatus" component={MapStatusScreen} />
      <StatusStack.Screen name="ConfigureWifi" component={ConfigureWifiScreen} />

    </StatusStack.Navigator>
  )
}


export default class App extends Component {
  constructor(props){
    super(props)
    console.log("Welcome!")
  }
  
  render() {
    return(
      <StoreProvider store={store}>
        <PaperProvider>
          <NavigationContainer>        
            <Tab.Navigator
              barStyle={
                Styles.Colors.barColor
              }
            >
              <Tab.Screen name="Map Status" component={HomeScreen} />
              <Tab.Screen name="Connection Status" component={StatusStackScreen} />
            </Tab.Navigator>
            {/* <Snackbar style={{marginBottom: 60}} visible={true}>Hello!</Snackbar> */}

          </NavigationContainer>
        </PaperProvider>
      </StoreProvider>
    )
  }
}


import React, { Component } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { BleManager } from "react-native-ble-plx";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';


// Redux
import { Provider as StoreProvider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/';
import thunk from 'redux-thunk';

// Screens
import MapStatusScreen from './screens/MapStatusScreen';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';

//
import * as Styles from './styles'


const BLEManager = new BleManager();

const store = createStore(rootReducer, applyMiddleware(thunk.withExtraArgument(BLEManager)));
const Tab = createMaterialBottomTabNavigator();


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
              <Tab.Screen name="Connection Status" component={MapStatusScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </StoreProvider>
    )
  }
}


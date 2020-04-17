import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { BleManager } from "react-native-ble-plx";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';


// Redux
import { Provider as StoreProvider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import BLEReducer from './reducers/BLEReducer';
import thunk from 'redux-thunk';

// Screens
import MapStatusScreen from './screens/MapStatusScreen';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';

// CSS
import { Base } from './styles'

const BLEManager = new BleManager();

const store = createStore(BLEReducer, applyMiddleware(thunk.withExtraArgument(BLEManager)));
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
            <Tab.Navigator>
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Details" component={DetailsScreen} />
              <Tab.Screen name="Map Status" component={MapStatusScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </StoreProvider>
    )
  }
}

export const styles = StyleSheet.create({
  container: { ...Base.container }
});

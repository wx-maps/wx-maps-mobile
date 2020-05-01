import React, { Component } from 'react';

import { SafeAreaView, ScrollView, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { scanWifi } from '../actions/BLEActions';

import {Item} from '../components/Item';

import * as Styles from '../styles'
import LoadingIndicator from '../components/LoadingIndicator';

const shortid = require('shortid');

require("json-circular-stringify");

class HomeScreen extends Component {
    constructor(props){
        super(props)
    }

    isLoading(){ return this.props.BLE.airports.length <= 0 }

    render() {
      if(this.isLoading()){
        return(<LoadingIndicator />)
      }else{
        return (
          <SafeAreaView style={{flex: 1}}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
            

              <View style={[Styles.Base.airportBoxContainer, {alignItems: 'center', justifyContent: 'center'}]}>   
      
                {
                  this.props.BLE.airports.map((airport) => { 
                    return(
                      <Item key={shortid.generate()} style={[Styles.Base.airportBox, Styles.Colors[airport.flightCategory]]}>
                        <Text style={Styles.Base.airportBoxText}>{airport.name}</Text>
                      </Item>)
                  })
                }
              </View>
            </ScrollView>
          </SafeAreaView>
        );
      }
    }
}

function mapStateToProps(state){
    const { BLE, App } = state
    return { BLE, App }
};

const mapDispatchToProps = dispatch => ({
    scanWifi: () => dispatch(scanWifi()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
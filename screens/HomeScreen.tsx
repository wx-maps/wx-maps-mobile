import React, { Component } from 'react';

import { SafeAreaView, ScrollView, View, Text } from 'react-native';
import { Headline, List } from 'react-native-paper';
import { connect } from 'react-redux';
import { scanWifi } from '../actions/BLEActions';

import {Item} from '../components/Item';

import * as Styles from '../styles'

import {Base} from '../styles'
import { RefreshControlBase } from 'react-native';

const shortid = require('shortid');

require("json-circular-stringify");

class HomeScreen extends Component {
    constructor(props){
        super(props)
    }

    render() {
      if(!this.props.BLE.airports) { return null }

        return (
          <SafeAreaView style={{height: '100%'}}>
            <ScrollView>
              <View style={Styles.Base.airportBoxContainer}>                     
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

function mapStateToProps(state){
    const { BLE, App } = state
    return { BLE, App }
};

const mapDispatchToProps = dispatch => ({
    scanWifi: () => dispatch(scanWifi()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
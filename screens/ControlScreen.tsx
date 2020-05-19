import React, { Component } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Button } from 'react-native-paper'
import { connect } from 'react-redux';
import { toggleLights, setRainbowMode, setMetarMode } from '../actions/ControlActions';


class ControlScreen extends Component {
  toggleLightString(){
    return this.props.lightsEnabled ? 'Off' : 'On'
  }

  render() {
      return (
        <SafeAreaView style={{flex: 1}}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} >
            <Button mode='contained' style={{padding: 20, margin: 10}} onPress={ () => this.props.toggleLights() }>Turn Lights {this.toggleLightString()}</Button> 
            <Button mode='contained' style={{padding: 20, margin: 10}} onPress={ () => { this.props.setRainbowMode() } }>Rainbow Mode</Button>
            <Button mode='contained' style={{padding: 20, margin: 10}} onPress={ () => { this.props.setMetarMode() } }>METAR Mode</Button>

          </View>
          </ScrollView>
        </SafeAreaView>
      );
  }


}

function mapStateToProps(state){
    const { BLE, App, Control } = state
    return { BLE, App, Control }
};

const mapDispatchToProps = dispatch => ({
  toggleLights: () => dispatch(toggleLights()),
  setRainbowMode: () => dispatch(setRainbowMode()),
  setMetarMode: () => dispatch(setMetarMode()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlScreen);
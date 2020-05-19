import React, { Component } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Button } from 'react-native-paper'
import { connect } from 'react-redux';
import { toggleLights } from '../actions/ControlActions';


class ControlScreen extends Component {
  toggleLightString(){
    return this.props.lightsEnabled ? 'Off' : 'On'
  }
  render() {
      return (
        <SafeAreaView style={{flex: 1}}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} >
            <Button mode='contained' style={{padding: 20}} onClick={ () => this.props.toggleLights() }>Turn Lights {this.toggleLightString()}</Button>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlScreen);
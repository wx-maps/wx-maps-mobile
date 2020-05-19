import React, { Component } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { connect } from 'react-redux';

class LoadingIndicator extends Component {
  // Should show some extra context eg searching, connecting, loading etc
  render() {
    console.log('props', this.props);
    return (<SafeAreaView style={{ flex: 1 }}>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size='large' animating={true} />
        <Text style={{textAlign: 'center'}}>{this.props.BLE.statusString}</Text>
      </View>
    </SafeAreaView>);
  }
}


function mapStateToProps(state){
    const { BLE } = state
    return { BLE }
};

export default connect(mapStateToProps)(LoadingIndicator);
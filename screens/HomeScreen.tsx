import React, { Component } from 'react';

import { View, StyleSheet } from 'react-native';
import { Text, Button, List } from 'react-native-paper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addDevice, startScan } from '../actions/BLEActions';

import { Base } from '../styles'

class HomeScreen extends Component {
    constructor(props){
        super(props)
        this.props.startScan();
    }
  componentWillUnmount() {
    // const connectedDevices = this.manager.connectedDevices().then((UUIDS) => { UUIDS.map((UUID) => { this.manager.cancelDeviceConnection(UUID); }); });
  }

  componentDidMount() {
    // this.manager.onStateChange((state) => {
    //   if (state === 'PoweredOn') {
    //     this.scan();
    //   }
    // }, true);
  }



  render() {
    return (<View style={styles.container}>
      <Text>Device count: {this.props.BLE.devices.length}</Text>
      {this.props.BLE.devices.map((device, i) => { return <BleDevice device={device} key={i} navigation={this.props.navigation} manager={this.manager} />; })}

      <Button onPress={() => this.props.navigation.navigate('Details')}>Go To Details</Button>
    </View>);
  }


}

const styles = StyleSheet.create({
    container: { ...Base.container }
});

class BleDevice extends Component {
    render(){
      return(
          <List.Item 
            title={this.props.device.name} 
            key={this.props.i} 
            description={this.props.device.id} 
            style={{width: '80%'}} 
            onPress={() => { this.props.navigation.navigate('Details', { device: this.props.device, manager: this.props.manager })}}
          />
      )
    }
  }

function mapStateToProps(state){
    const { BLE } = state
    console.log("State is : " + state)
    return { BLE }
};

// const mapDispatchToProps = dispatch => (
//     bindActionCreators({
//         addDevice,
//         // startScan: () => dispatch(startScan())
//     }, dispatch)
// );
const mapDispatchToProps = dispatch => ({
    addDevice,
    startScan: () => dispatch(startScan())
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
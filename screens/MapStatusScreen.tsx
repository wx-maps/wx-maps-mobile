import React, { Component } from 'react';
import {StyleSheet, View } from 'react-native';

import { Text, Button, List, Snackbar } from 'react-native-paper';

import { Base } from '../styles'


export class MapStatusScreen extends Component{
    render(){
        return(
            <View style={styles.container}>
                <Text>Map Status Screen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { ...Base.container }
  });

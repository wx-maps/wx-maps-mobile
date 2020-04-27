import React, { Component } from 'react';
import { StatusBox } from "./StatusBox";
import * as Styles from '../styles'


export class Status extends Component {
    static CONNECTED = 'Connected';
    static DISCONNECTED = 'Disconnected';
    static defaultProps = {
        renderIfDisconnected: false,
        itemName: 'Generic Status',
        connectedString: 'Connected',
    };
    
    constructor(props) {
        super(props);
        // this.state = {
        //     connectionString: Status.DISCONNECTED,
        //     style: Styles.Colors.Failure,
        //     itemName: this.props.itemName,
        // }

        // this.isConnected = false;
        // this.connectionString = Status.DISCONNECTED;
        // this.style = Styles.Colors.Failure;
        // this.itemName = 'Generic Status';
        // this.renderIfDisconnected = this.props.renderIfDisconnected;
    }

    connectionString(){
        return (this.props.isConnected) ? this.props.connectedString : Status.DISCONNECTED
    }

    style(){
        return (this.props.isConnected) ? Styles.Colors.Success : Styles.Colors.Failure
    }

    render() {
        if (this.props.isConnected || this.props.renderIfDisconnected) {
            return (<StatusBox itemName={this.props.itemName} style={this.style()} onPress={this.props.onPress}>
                {this.connectionString()}
            </StatusBox>);
        }
        else {
            return (null);
        }
    }
}

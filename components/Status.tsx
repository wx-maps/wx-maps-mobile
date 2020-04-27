import React, { Component } from 'react';
import { StatusBox } from "./StatusBox";
import * as Styles from '../styles'


type StatusProps = {
    isConnected: boolean,
    connectedString: string,
    itemName: string,
    renderIfDisconnected: boolean
}

export class Status extends Component<StatusProps> {
    static CONNECTED = 'Connected';
    static DISCONNECTED = 'Disconnected';
    static defaultProps = {
        renderIfDisconnected: false,
        itemName: 'Generic Status',
        connectedString: 'Connected',
    };

    connectionString(){
        return (this.props.isConnected) ? this.props.connectedString : Status.DISCONNECTED
    }

    style(){
        return (this.props.isConnected) ? Styles.Colors.Success : Styles.Colors.Failure
    }

    render() {
        if (this.props.isConnected || this.props.renderIfDisconnected) {
            return (<StatusBox itemName={this.props.itemName} style={this.style()}>
                {this.connectionString()}
            </StatusBox>);
        }
        else {
            return (null);
        }
    }
}

import React, { Component } from 'react';
import { StatusBox } from "./StatusBox";
import * as Styles from '../styles'


export class Status extends Component {
    static CONNECTED = 'Connected';
    static DISCONNECTED = 'Disconnected';
    static defaultProps = {
        renderIfDisconnected: false
    };
    
    constructor(props) {
        super(props);
        this.isConnected = false;
        this.connectionString = Status.DISCONNECTED;
        this.style = Styles.Colors.Failure;
        this.itemName = 'Generic Status';
        this.renderIfDisconnected = this.props.renderIfDisconnected;
    }

    setIsConnected(value) {
        this.isConnected = value;
        this.setConnectionString();
        this.setStyle();
    }

    setConnectionString() {
        this.connectionString = (this.isConnected) ? Status.CONNECTED : Status.DISCONNECTED;
    }

    setStyle() {
        this.style = (this.isConnected) ? Styles.Colors.Success : Styles.Colors.Failure;
    }

    render() {
        if (this.isConnected || this.renderIfDisconnected) {
            return (<StatusBox itemName={this.itemName} itemValue={this.connectionString} style={this.style}>
                {this.connectionString}
            </StatusBox>);
        }
        else {
            return (null);
        }
    }
}

import React, { Component } from 'react';
import {StyleSheet} from 'react-native';
import { Card, Title, Caption } from 'react-native-paper';

type ItemProps = {
    itemCaption: string,
    style: Object,
}
export class Item extends Component<ItemProps> {
    caption(){
        if(this.props.itemCaption){
            return(<Caption style={[styles.centered]}>{this.props.itemCaption}</Caption>)
        }else{
            return null;
        }
    }
    render() {
        return (
            <Card style={this.props.style}>
                <Card.Content>
                    <Title style={[styles.centered]}>{this.props.children}</Title>
                    {this.caption()}
                </Card.Content>
            </Card>
        );
    }
}

export const styles = StyleSheet.create({
    centered: {textAlign: 'center', alignItems: 'center'},
})
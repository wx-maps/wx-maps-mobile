import React, { Component } from 'react';
import {StyleSheet} from 'react-native';
import { Card, Title, Caption } from 'react-native-paper';

type StatusBoxProps = {
    style: Object,
    itemName: string,
}

export class StatusBox extends Component<StatusBoxProps> {
    render() {
        return (
            <Card style={[styles.statusBox, this.props.style]}>
                <Card.Content style={styles.cardContent}>
                    <Title style={[styles.centered, this.props.style]}>{this.props.children}</Title>
                    <Caption style={[styles.centered, this.props.style]}>{this.props.itemName}</Caption>
                </Card.Content>
            </Card>
        );
    }
}

export const styles = StyleSheet.create({
    statusBox: {flex: 0, padding: 20, margin: 5, borderColor: 'black', textAlign: 'center', borderWidth: 0, },
    cardContent: {paddingHorizontal: 5, paddingVertical: 5, textAlign: 'center'},
    centered: {textAlign: 'center'},
})
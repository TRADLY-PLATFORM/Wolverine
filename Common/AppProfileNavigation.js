import React, { Component } from 'react';
import {
    Text, View, TouchableOpacity,SafeAreaView ,Image,
} from 'react-native';
import 'react-native-gesture-handler';
import PropTypes from 'prop-types';


var commonStyle = require('./CommonStyleSheet');


export default class AppProfileNavigation extends Component {
    static propTypes = {
        title: PropTypes.string,
        subTitle: PropTypes.string,
        backBtn: PropTypes.func,
    }
    render() {
        return <SafeAreaView style={commonStyle.headerContainer}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ marginLeft: 10, marginTop: 10 }} onPress={this.props.backBtn}>
                    <Image style={commonStyle.backBtnStyle} resizeMode="center" source={require('../assets/back.png')}>
                    </Image>
                </TouchableOpacity>
                <View style={{ width: '75%', alignItems: 'center', marginTop: 5 }}>
                    <Text style={commonStyle.headerTitle}>{this.props.title}</Text>
                </View>
            </View>
            <Text style={commonStyle.headerSubTitle}>{this.props.subTitle}</Text>
        </SafeAreaView>
    }
}
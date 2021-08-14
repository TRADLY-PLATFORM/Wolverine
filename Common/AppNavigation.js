import React, { Component } from 'react';
import {
     Text, View, TouchableOpacity,  Image, 
} from 'react-native';
import 'react-native-gesture-handler';
import PropTypes from 'prop-types';


var commonStyle = require('./CommonStyleSheet');


export default class AppNavigation extends Component {
    static propTypes = {
        title: PropTypes.string,
        backBtn: PropTypes.func,
    }
    render() {
        return <View style={commonStyle.navigationBarContainer}>
            <View style={commonStyle.navigationBarheaderItemViewStyle}>
                <TouchableOpacity style={{ width: '60%', alignItems: 'flex-end', }}>
                    <Image style={commonStyle.iconsStyle} resizeMode="contain" source={require('../assets/notifications.png')}>
                    </Image>
                </TouchableOpacity>
            </View>
            <View style={commonStyle.navigationBarheaderItemViewStyle}>
                <Text style={commonStyle.headerTitle}>{this.props.title}</Text>
            </View>
            <View style={commonStyle.navigationBarheaderItemViewStyle}>
                <TouchableOpacity style={{ width: '80%', alignItems: 'flex-start', }} onPress={this.props.backBtn}>
                    <Image style={commonStyle.iconsStyle} resizeMode="contain" source={require('../assets/back.png')}>
                    </Image>
                </TouchableOpacity>
            </View>
        </View>
    }
}


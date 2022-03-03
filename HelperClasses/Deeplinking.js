import React, { Component } from 'react';
import {Linking,View} from 'react-native';
import AppConstants from '../Constants/AppConstants';

export default class Deeplinking extends Component {

  componentDidMount() {
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.navigate(url);
      });
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }
  handleOpenURL = (event) => {
    // console.log('event==>', event)
    this.navigate(event.url);
  }
  navigate = (url) => {
    // console.log('url ==>', url);
    if (url != null) {
      const opt2 = url.split('=').slice(1).join("")     // prints: 20202-03
      console.log('opt2 ==>', opt2);
      AppConstants.mangoPayStatus = opt2 == 'success' ? true : false
    }
    // const route = url.replace(/.*?:\/\//g, '');
    // const id = route.match(/\/([^\/]+)\/?$/)[1];
    // const routeName = route.split('/')[0];
    // console.log('id ==>', id);
    // console.log('routeName', routeName);
  }
  render(){
    return <View />
  }
}
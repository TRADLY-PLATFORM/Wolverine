import React, { Component } from 'react';
import {Linking,View} from 'react-native';

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
    this.navigate(event.url);
  }
  navigate = (url) => {
    console.log('url ==>', url);
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
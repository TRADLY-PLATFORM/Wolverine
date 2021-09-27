
import React, { Component } from 'react';
import GetLocation from 'react-native-get-location';
import appConstant from '../Constants/AppConstants';
import {Alert} from 'react-native';

export default class CurrentLocation extends Component {

  _requestLocation = () => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 150000,
      }) .then(location => {
        console.log('appConstant =location> ',location);
        appConstant.lat = location['latitude'];
        appConstant.long = location['longitude'];
      })
      .catch(ex => {
        const { code, message } = ex;
        // console.warn(code, message);
        // if (code === 'CANCELLED') {
        //   // Alert.alert('Location cancelled by user or by another request');
        // }
        if (code === 'UNAVAILABLE') {
          Alert.alert('Location service is disabled or unavailable');
        }
        if (code === 'TIMEOUT') {
          Alert.alert('Location request timed out');
        }
        if (code === 'UNAUTHORIZED') {
          // Alert.alert(
          //   'Authorization denied Location', "",
          //   [
          //     {
          //       text: "OK", onPress: () => {
          //         GetLocation.openAppSettings();  
          //       }
          //     }
          //   ],
          // );
        }
        // this.setState({
        //   location: null,
        //   loading: false,
        // });
      });
  }
}

// Unsubscribe

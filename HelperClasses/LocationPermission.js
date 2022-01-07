
import React, { Component } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';

import GetLocation from 'react-native-get-location';
import appConstant from '../Constants/AppConstants';
import {Alert} from 'react-native';
import { AppAlert } from './SingleTon';

export default class CurrentLocation extends Component {

  _requestLocation = async => {
    // if (Platform.OS === 'android') {
    //   PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //   );
    // }
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 150000,
    }).then(location => {
      // console.log('appConstant =location> ',location);
      appConstant.lat = location['latitude'];
      appConstant.long = location['longitude'];
    })
      .catch(ex => {
        const { code, message } = ex;
        console.warn(code, message);
        // if (code === 'CANCELLED') {
        //   // Alert.alert('Location cancelled by user or by another request');
        // }
        if (code === 'UNAVAILABLE') {
          // AppAlert.alert('Location service is disabled or unavailable');
          AppAlert(appConstant.locationPermissionError, appConstant.okTitle);
        }
        if (code === 'TIMEOUT') {
          Alert.alert('Location request timed out');
        }
        if (code === 'UNAUTHORIZED') {
          Alert.alert(
            appConstant.locationPermissionError, "",
            [
              {
                text: appConstant.okTitle, onPress: () => {
                  GetLocation.openAppSettings();
                }
              }
            ],
          );
        }
        // this.setState({
        //   location: null,
        //   loading: false,
        // });
      });
  }
}

// Unsubscribe

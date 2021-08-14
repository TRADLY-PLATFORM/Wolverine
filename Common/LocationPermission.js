import RNLocation, { requestPermission } from 'react-native-location'
import OpenAppSettings from 'react-native-app-settings'
import React, { Component } from 'react';


export default class LocationPermission extends Component {

  allowLocationPermission = () => {
    RNLocation.requestPermission({
      ios: "whenInUse",
      android: {
        detail: "fine",
        rationale: {
          title: "Location permission",
          message: "We use your location to demo the library",
          buttonPositive: "OK",
          buttonNegative: "Cancel"
        }
      }
    }).then(granted => {
      console.log('permission granted', granted)
      if (granted) {
        // this._startUpdatingLocation();
      } else {
        OpenAppSettings.open()
      }
    });
    RNLocation.configure({
      distanceFilter: 100, // Meters
      desiredAccuracy: {
        ios: "best",
        android: "balancedPowerAccuracy"
      },
      // Android only
      androidProvider: "auto",
      interval: 5000, // Milliseconds
      fastestInterval: 10000, // Milliseconds
      maxWaitTime: 5000, // Milliseconds
      // iOS Only
      activityType: "other",
      allowsBackgroundLocationUpdates: true,
      headingFilter: 1, // Degrees
      headingOrientation: "portrait",
      pausesLocationUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: true,
    })

    // RNLocation.getLatestLocation({ timeout: 100 })
    //   .then(latestLocation => {
    //     console.log('latestLocation',latestLocation)
    //   })

    //  RNLocation.subscribeToLocationUpdates(locations => {
    //     console.log('subscribeToLocationUpdates',locations)
    //   })
    //   RNLocation.subscribeToPermissionUpdates(currentPermission => {
    //     console.log('subscribeToPermissionUpdates',currentPermission)

    //     if (currentPermission == 'denied')
    //     {
    //       OpenAppSettings.open()
    //     }
    //     else if (currentPermission == 'notDetermined')
    //     {
    //     }

    //   })
  }

  _getCurrentLocation =  async() => {
   await RNLocation.getLatestLocation({ timeout: 60000 }) .then(latestLocation => {
        console.log('current loc ', latestLocation['latitude'], ' longitude', latestLocation['longitude'])
        return latestLocation
      })
  }
  _startUpdatingLocation = () => {
    this.locationSubscription = RNLocation.subscribeToLocationUpdates(
      locations => {
        console.log('_startUpdatingLocation', locations)
      });
  };

  _stopUpdatingLocation = () => {
    this.locationSubscription && this.locationSubscription();
    console.log('_stopUpdatingLocation')
  };

}

// Unsubscribe

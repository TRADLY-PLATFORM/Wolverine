/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, LogBox, View, Image} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import colors from './CommonClasses/AppColor';
import DefaultPreference from 'react-native-default-preference';
import networkService from './NetworkManager/NetworkManager';
import APPURL from './Constants/URLConstants';
import appConstant from './Constants/AppConstants';
import logoIcon from './assets/classbubslogo.png';
import * as Sentry from "@sentry/react-native";
import {StripeProvider} from '@stripe/stripe-react-native';
import Route from './Component/Route';
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: 'false',
      reload: false,
      isVisible: false,
    }
  }
  componentDidMount() {
    LogBox.ignoreAllLogs(true)
    DefaultPreference.get('installed').then(function (val) {
      if (val == undefined) {
        DefaultPreference.set('installed', 'true').then(function () { console.log('installed') });
        appConstant.appInstalled = false
      } else {
        appConstant.appInstalled = true
      }
    }.bind(this))
    Sentry.init({environment: __DEV__ ?  'development' : 'production' ,dsn: appConstant.dsnSentry, enableNative: false});
    this.fcmNotification()
    this.configApi();
  }
  fcmNotification() {
    messaging().onMessage(async remoteMessage => {
      console.log('M', remoteMessage);
    });
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log( 'N',  remoteMessage);
    });
  }

  configApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(APPURL.URLPaths.config, 'get')
    if (responseJson['status'] == true) {     
      let keyd = responseJson['data']['key']['app_key'];
      let into = responseJson['data']['configs']
      console.log('configs  == >', into);
      appConstant.intoScreen = into['intro_screens'];
      appConstant.bToken = keyd;
      DefaultPreference.set('token', keyd).then(function () { console.log('done') });
      this.configListApi()
      // this.setState({ reload: true, isVisible: false })
    }
  }
  configListApi = async()  => {
    const responseJson = await networkService.networkCall(APPURL.URLPaths.configList + 'general,onboarding', 'get','',appConstant.bToken,'')
    if (responseJson['status'] == true) {
      let into = responseJson['data']['configs']
      appConstant.termCondition = into['terms_url'] || 'https://community.tradly.app';
      appConstant.privacyURL = into['privacy_policy_url'] || 'https://community.tradly.app'
      appConstant.appHomeTitle = into['app_title_home'] || 'ClassBubs';
      // colors.AppTheme = into['app_color_primary'] || colors.AppTheme;
      // colors.GradientBottom = into['app_color_primary'] || colors.AppTheme;
      // colors.GradientTop = into['app_color_secondary'] || colors.GradientTop;
      this.getCurrencyApi()
      this.setState({ reload: true, isVisible: false })
    }
  }
  getCurrencyApi = async () => {
    const responseJson = await networkService.networkCall(APPURL.URLPaths.currencies, 'get','',appConstant.bToken,'')
    if (responseJson['status'] == true) {
      let ccData = responseJson['data']['currencies']
      for (let obj of ccData) {
        if (obj['default'] == true) {
          appConstant.defaultCurrency = obj['format'];
        }
      }

    }
  }
  render() {
    if (this.state.reload == false) {
      return <SafeAreaView style={styles.container}>
        <View>
          <Image style={{ width: 200, height: 200, borderRadius: 0 }} source={logoIcon} />
          <StripeProvider publishableKey={appConstant.stripePublishKey} />
        </View>
      </SafeAreaView>
    } else {
      return (<View style={styles.navigationContainer}>
        <Route/>
      </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.AppTheme,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationContainer: {
    flex: 1,
    backgroundColor:  colors.AppTheme,
  },
});
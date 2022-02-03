/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {StyleSheet, SafeAreaView, LogBox, View, Image, Platform,StatusBar} from 'react-native';
import colors from './CommonClasses/AppColor';
import DefaultPreference from 'react-native-default-preference';
import networkService from './NetworkManager/NetworkManager';
import APPURL from './Constants/URLConstants';
import appConstant from './Constants/AppConstants';
// import logoIcon from './assets/classbubslogo.png';
// import androidLogoIcon from './assets/classbubslogo.jpg';
import logoIcon from './assets/appIcon.png'
import * as Sentry from "@sentry/react-native";
import {StripeProvider} from '@stripe/stripe-react-native';
import Route from './Component/Route';
import tradlyDb from './TradlyDB/TradlyDB';
import LangifyKeys from './Constants/LangifyKeys';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: 'false',
      reload: false,
      isVisible: false,
      stripePublishKey: '',
    }
  }
  componentDidMount() {
    LogBox.ignoreAllLogs(true)
    DefaultPreference.get('installed').then(function (val) {
        appConstant.appInstalled = val == undefined ? false : true
    }.bind(this))
    Sentry.init({environment: __DEV__ ?  'development' : 'production' ,dsn: appConstant.dsnSentry, enableNative: false});
    this.configListApi()
    this.getSavedValues();
  }
  
  getSavedValues() {
    DefaultPreference.get('appLanguage').then(function (la) {
      if (la != undefined) {
        appConstant.appLanguage = la
      }
    }.bind(this))
  }
  
  // configApi = async () => {
  //   this.setState({ isVisible: true })
  //   const responseJson = await networkService.networkCall(APPURL.URLPaths.config, 'get')
  //   if (responseJson['status'] == true) {     
  //     let keyd = responseJson['data']['key']['app_key'];
  //     let into = responseJson['data']['configs']
  //     console.log('configs  == >', into);
  //     appConstant.intoScreen = into['intro_screens'];
  //     // appConstant.bToken = keyd;
  //     DefaultPreference.set('token', keyd).then(function () { console.log('done') });
  //     this.configListApi()
  //   }
  // }
  configListApi = async()  => {
    const responseJson = await networkService.networkCall(APPURL.URLPaths.configList + 'general,onboarding,payments', 'get','',appConstant.bToken,'')
    if (responseJson['status'] == true) {
      let into = responseJson['data']['configs']
      console.log('into -- = >', into)
      appConstant.intoScreen = into['intro_screens'];
      appConstant.termCondition = into['terms_url'] || 'www.google.com';
      appConstant.privacyURL = into['privacy_policy_url'] || 'www.google.com';
      appConstant.appHomeTitle = into['app_title_home'] || 'App';
      appConstant.appVersion = Platform.OS === 'ios' ? into['app_ios_version'] : into['app_android_version'];
      appConstant.sellIcon = into['sell_icon'] ?? '';
      appConstant.branchDescription = into['branch_link_description'] ?? '';
      // colors.AppTheme = into['app_color_primary'] ?? '#83f0c8'
      // colors.GradientTop = into['app_color_secondary'] ?? '#83f0c8'
      // colors.GradientBottom = into['app_color_primary'] ?? '#17d275'

      this.state.stripePublishKey = into['stripe_api_publishable_key'] || '';
      if (appConstant.appLanguage.length != 0) {
        this.langifyAPI()
      }
      this.getLanguageApi();
      this.getCurrencyApi()
    }
  }
  langifyAPI = async () => {
    let homeData = await tradlyDb.getDataFromDB(LangifyKeys.home);
    if (homeData != undefined) {
      this.bottomTarTranslationData(homeData);
    } 
    let group = `&group=${LangifyKeys.home}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${appConstant.appLanguage}${group}`, 'get', '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      // console.log('home => ', objc)
      tradlyDb.saveDataInDB(LangifyKeys.home, objc)
      this.bottomTarTranslationData(objc);
      this.setState({isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  getCurrencyApi = async () => {
    const responseJson = await networkService.networkCall(APPURL.URLPaths.currencies, 'get','',appConstant.bToken,'')
    if (responseJson['status'] == true) {
      let ccData = responseJson['data']['currencies']
      for (let obj of ccData) {
        if (obj['default'] == true) {
          appConstant.defaultCurrencyCode = obj['code'];
          appConstant.defaultCurrency = obj['format'];
        }
      }
      this.setState({ isVisible: false })
    }
  }
  getLanguageApi = async () => {
    const responseJson = await networkService.networkCall(APPURL.URLPaths.language, 'get','',appConstant.bToken,'')
    if (responseJson['status'] == true) {
      let ccData = responseJson['data']['languages']
      for (let obj of ccData) {
        if (obj['default'] == true) {
          appConstant.appLanguage = obj['code'];
        }
      }
      this.setState({ reload: true, isVisible: false })
    }
  }
  bottomTarTranslationData(object) {
    for (let obj of object) {
      if ('home.Home' == obj['key']) {
        appConstant.bottomTabBarDic['home'] = obj['value'];
      }
      if ('home.chats' == obj['key']) {
        appConstant.bottomTabBarDic['chats'] = obj['value'];
      }
      if ('home.more' == obj['key']) {
        appConstant.bottomTabBarDic['more'] = obj['value'];
      }
      if ('home.sell' == obj['key']) {
        appConstant.bottomTabBarDic['sell'] = obj['value'];
      }
      if ('home.social_feed' == obj['key']) {
        appConstant.bottomTabBarDic['socialFeed'] = obj['value'];
      }
      if ('home.search' == obj['key']) {
        appConstant.bottomTabBarDic['search'] = obj['value'];
      }
      if ('home.view_all' == obj['key']) {
        appConstant.bottomTabBarDic['viewAll'] = obj['value'];
      }
    }
  }

  //MARK:-- ------***** *******  UI ******* ******* *****
  render() {
    if (this.state.reload == false) {
      return <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.AppTheme} barStyle="light-content"/>
        <View>
          {/* <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} /> */}
          <Image style={{ width: 180, height: 180, borderRadius: 0 }} source={Platform.OS === 'ios' ? logoIcon : logoIcon} />
        </View>
      </SafeAreaView>
    } else {
      return (<View style={styles.navigationContainer}>
          <StripeProvider publishableKey={this.state.stripePublishKey} />
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

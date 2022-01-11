
import React, { Component } from 'react';
import {Alert, TextInput, Text, Image, View, StyleSheet,
  Platform,  SafeAreaView, TouchableOpacity,ScrollView} from 'react-native';
import 'react-native-gesture-handler';
import colors from '../../CommonClasses/AppColor';
import commonStyle from '../../StyleSheet/UserStyleSheet';
import NavigationRoots from '../../Constants/NavigationRoots';
import DefaultPreference from 'react-native-default-preference';
import networkService from './../../NetworkManager/NetworkManager';
import APPURL from './../../Constants/URLConstants';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo,{getUniqueId} from 'react-native-device-info';
import Spinner from 'react-native-loading-spinner-overlay';
import closeIcon from './../../assets/close.png';
import appConstant from './../../Constants/AppConstants';
import userModel  from '../../Model/UserModel'
import messaging from '@react-native-firebase/messaging';
import LangifyKeys from '../../Constants/LangifyKeys';
import { validateEmail,AppAlert } from '../../HelperClasses/SingleTon';
import AppConstants from './../../Constants/AppConstants';
import tradlyDb from '../../TradlyDB/TradlyDB';

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      email: '',
      password: '',
      authType: 2,
      bToken: '',
      authType: '',
      deviceName: '',
      manufacturer:'',
      updateUI:false,
      translationDic:{},
    }
  }
  componentDidMount() {
    this.checkPermission()
    this.getSystemDetail();
    this.langifyAPI()
  }
  async getSystemDetail () {
    DeviceInfo.getDeviceName().then((deviceName) => {
      this.state.deviceName = deviceName;
    })
    DeviceInfo.getDeviceName().then((manufacturer) => {
      this.state.manufacturer = manufacturer;
    })
  }
  langifyAPI = async () => {
    let loginData = await tradlyDb.getDataFromDB(LangifyKeys.login);
    if (loginData != undefined) {
      this.loginTranslationData(loginData);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.login}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${appConstant.appLanguage}${group}`, 'get', '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(LangifyKeys.login, objc)
      this.loginTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  loginTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('login.welcome_to_app' == obj['key']) {
        let text = obj['value'];
        let result = text.replace('{value}', '');
        this.state.translationDic['title'] = result;
      }
      if ('login.login_to_your_account' == obj['key']) {
        this.state.translationDic['subTitle'] = obj['value'];
      }
      if ('login.email' == obj['key']) {
        this.state.translationDic['email'] =  obj['value'];
      }
      if ('login.password' == obj['key']) {
        this.state.translationDic['password'] = obj['value'];
      }
      if ('login.login' == obj['key']) {
        this.state.translationDic['loginBtn'] =  obj['value'];
      }
      if ('login.forgot_your_password' == obj['key']) {
        this.state.translationDic ['forgotPasswordBtn'] =  obj['value'];
      }
      if ('login.dont_have_an_account' == obj['key']) {
        this.state.translationDic['signUpbtn'] = obj['value'];
      }
      if ('login.invalid_emailid' == obj['key']) {
        this.state.translationDic['invalidEmail'] =  obj['value'];
      }
      if ('login.fill_allfields' == obj['key']) {
        this.state.translationDic['allFields']  = obj['value'];
      }
      if ('login.alert_ok' == obj['key']) {
        this.state.translationDic['alertOk'] =  obj['value'];
        appConstant.okTitle =  obj['value'];
      }
    }
  }
  loginApi = async () => {
    this.setState({ isVisible: true })
    var dict = {
      'uuid': getUniqueId(),
      'type': 'customer',
    }
    dict['email'] = this.state.email
    dict['password'] = this.state.password
    const responseJson = await networkService.networkCall(APPURL.URLPaths.login, 'POST', JSON.stringify({ user: dict }), appConstant.bToken)
    // console.log(" responseJson =  ", responseJson) 
    if (responseJson) {
      this.setState({ isVisible: false })
      if (responseJson['status'] == true) {
        const udata = responseJson['data']['user'];
        appConstant.userId = udata['id'];
        userModel.userData(responseJson);
        this.updateDeviceInfoAPI();
        this.getMyStoreApi();
      } else {
        console.log(" error ", responseJson)
        AppAlert(responseJson,this.state.translationDic['alertOk'])
      }
    }
  }
  getMyStoreApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.accounts}?user_id=${appConstant.userId}&page=1&type=accounts`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let acctData = responseJson['data']['accounts'];
      if (acctData.length != 0) {
        appConstant.accountID = acctData[0]['id'];
      }else{
        appConstant.accountID = '';
      }
      this.setState({ isVisible: false })
      this.props.navigation.goBack();
    }else {
      this.setState({ isVisible: false })
    }
  }
  updateDeviceInfoAPI = async () => {
    let dict = {
      'device_name':this.state.deviceName ,
      'device_manufacturer': this.state.manufacturer ,
      'device_model': DeviceInfo.getModel(),
      'app_version': DeviceInfo.getVersion(),
      'os_version': DeviceInfo.getSystemVersion(),
      'push_token': appConstant.fcmToken,
      'language': 'en',
      'client_type':  Platform.OS === 'ios' ? 1 : 2,
    }
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.devices}`, 'put',JSON.stringify({ device_info: dict }),appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
    }else {
      this.setState({ isVisible: false })
    }
  }
    //1
  async checkPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =  authStatus === messaging.AuthorizationStatus.AUTHORIZED ||  authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
      this.getToken();
    } else {
      // this.requestPermission();
      const granted =  messaging().requestPermission();
      if (granted) {
        console.log('Authorization status:', authStatus);
        this.getToken();
      }
    }
  }

  //2
  getToken = async() => {
    await DefaultPreference.get('fcmToken').then(function (fcmToken) {
      console.log(Platform.OS,'fcmToken', fcmToken)
      if (fcmToken == undefined) {
          const t =  messaging().getToken().then((tk) => {
            // console.log(' messaging token ==>', tk);
            appConstant.fcmToken = tk;
            DefaultPreference.set('fcmToken', tk).then();
          });
      }else {
        appConstant.fcmToken = fcmToken;
      }
    }.bind(this))
    
  }
  //3
  async  requestUserPermission() {
    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
      this.getToken();
    }else {
      console.log('Permission error');
    }
  }

  /*  Buttons   */
  signUpBtnAction() {
    this.props.navigation.navigate(NavigationRoots.SignUp);
  }

  sendBtnAction() {
    if (this.state.email.length == 0) {
      AppAlert(this.state.translationDic['allFields'],this.state.translationDic['alertOk'])
    } else if (!validateEmail(this.state.email)) {      
      AppAlert(this.state.translationDic['invalidEmail'],this.state.translationDic['alertOk'])
    } else if (this.state.password.length == 0) {
      AppAlert(this.state.translationDic['allFields'],this.state.translationDic['alertOk'])
    } else {
      this.loginApi()
    }
  }
  /*  UI   */

  renderMainView = () => {
    if (this.state.updateUI) {
      return (<View>
        <View style={{ height: 60 }} />
        <Text style={commonStyle.titleStyle}>{this.state.translationDic['title'] ?? 'Tradly'} {AppConstants.appHomeTitle}</Text>
        <Text style={commonStyle.subTitleStyle}>{this.state.translationDic['subTitle']  ?? 'Tradly'}</Text>
        <View style={commonStyle.roundView}>
          <TextInput
            style={commonStyle.txtFieldStyle}
            placeholder={this.state.translationDic['email'] ?? 'Email'}
            keyboardType='email-address'
            placeholderTextColor={colors.AppWhite}
            onChangeText={email => this.setState({ email: email })}
          />
        </View>
        <View style={commonStyle.roundView}>
          <TextInput
            style={commonStyle.txtFieldStyle}
            placeholder={this.state.translationDic['password'] ?? 'Password'}
            secureTextEntry={true}
            placeholderTextColor={colors.AppWhite}
            onChangeText={txt => this.setState({ password: txt })}
          />
        </View>
        <View style={{ height: 50 }} />
        <TouchableOpacity
          style={commonStyle.loginBtnStyle}
          onPress={() => this.sendBtnAction()}>
          <Text style={commonStyle.btnTitleStyle}>{this.state.translationDic['loginBtn'] ?? 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate(NavigationRoots.ForgotPassword)}>
          <Text style={commonStyle.forgotBtntitleStyle}>{this.state.translationDic['forgotPasswordBtn']  ?? 'Forgot Password'}</Text>
        </TouchableOpacity>
        <View style={{ height: 50 }} />
        <TouchableOpacity onPress={() => this.signUpBtnAction()}>
          <Text style={commonStyle.forgotBtntitleStyle}>{this.state.translationDic['signUpbtn'] ?? 'Sign Up'}</Text>
        </TouchableOpacity>
      </View>)
    } else {
      return <View />
    }
  }

  render() {
    return (
      <LinearGradient style={styles.Container} colors={[colors.GradientTop, colors.GradientBottom]} >
      <SafeAreaView style={styles.Container}>
        <TouchableOpacity style={commonStyle.closeBtnStyle} onPress={() => this.props.navigation.goBack()}>
          <Image source={closeIcon} />
        </TouchableOpacity>
        <ScrollView>
          <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyle.spinnerTextStyle} />
          <this.renderMainView />
        </ScrollView>
      </SafeAreaView>
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.lightTransparent
  },
});
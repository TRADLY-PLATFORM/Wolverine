import React, { Component } from 'react';
import { Alert, Keyboard, Text, Image, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import colors from '../../CommonClasses/AppColor';
import commonStyle from '../../StyleSheet/UserStyleSheet';
import NavigationRoots from '../../Constants/NavigationRoots';
import networkService from '../../NetworkManager/NetworkManager';
import APPURL from '../../Constants/URLConstants';
import LinearGradient from 'react-native-linear-gradient';
// import OTPInputView from '@twotalltotems/react-native-otp-input'
import userModel  from '../../Model/UserModel'
import DeviceInfo from 'react-native-device-info';
import appConstant from './../../Constants/AppConstants';
import LangifyKeys from '../../Constants/LangifyKeys';
import tradlyDb from '../../TradlyDB/TradlyDB';
import {AppAlert } from '../../HelperClasses/SingleTon';

import OTPTextView from 'react-native-otp-textinput';

export default class Verification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OTPvalue: '',
      deviceName: '',
      manufacturer:'',
      translationDic:{},
    }
  }
  componentDidMount() {
    this.getSystemDetail();
    this.langifyAPI();
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
    let forgotD = await tradlyDb.getDataFromDB(LangifyKeys.otp);
    if (forgotD != undefined) {
      this.verificationTranslationData(forgotD);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.otp}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${appConstant.appLanguage}${group}`, 'get',
      '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(LangifyKeys.otp, objc)
      this.verificationTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  verificationTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('otp.email_verification' == obj['key']) {
        let text = obj['value'];
        this.state.translationDic['title'] = text;
      }
      if ('otp.verify' == obj['key']) {
        this.state.translationDic['verifyBtn'] = obj['value'];
      }
      if ('otp.otp_send_info' == obj['key']) {
        let text = obj['value'];
        let result = text.replace('{value}', '');
        this.state.translationDic['subTitle'] = result;
      }
      if ('otp.enter_verification_code_here' == obj['key']) {
        this.state.translationDic['enterCode'] = obj['value'];
      }
      if ('otp.resend_message' == obj['key']) {
        this.state.translationDic['resendMessage'] = obj['value'];
      }
      if ('otp.please_enter_otp' == obj['key']) {
        this.state.translationDic['emptyOTP'] = obj['value'];
      }
      if ('login.alert_ok' == obj['key']) {
        this.state.translationDic['alertOk'] =  obj['value'];
      }
    }
  }
  verificationOTPApi = async () => {
    const { verifyId, bToken } = this.props.route.params;
    const dict = JSON.stringify({
      'verify_id': verifyId,
      "code": this.state.OTPvalue,
    })
    const responseJson = await networkService.networkCall(APPURL.URLPaths.verify, 'POST', dict, bToken)
    // console.log("responseJson = ", responseJson)
    if (responseJson) {
      if (responseJson['status'] == true) {
        userModel.userData(responseJson);
        this.updateDeviceInfoAPI()
        this.props.navigation.reset({index: 0, routes: [{name: NavigationRoots.BottomTabbar }]});
      } else {
        // let error = errorHandler.errorHandle(responseJson)
        AppAlert(responseJson,appConstant.okTitle)
      }
    }
  }
  resendCodeAPI = async () => {
    const { parameter, bToken} = this.props.route.params;
    const responseJson = await networkService.networkCall(APPURL.URLPaths.register, 'POST', JSON.stringify({ user: parameter }),bToken)
    // console.log("responseJson = ", responseJson)
    if (responseJson) {
      if (responseJson['status'] == true) {
        AppAlert(this.state.translationDic['resendMessage'],appConstant.okTitle)
      } else {
          AppAlert(responseJson,appConstant.okTitle)
      }
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
  /*  Buttons   */
  verifyBtnAction(code){
    console.log(code);
    if (code) {
        this.state.OTPvalue = code;
        if (this.state.OTPvalue.length == 6) {
          this.verificationOTPApi()
        }
    }
  };

  /*  UI   */
  render() {
    const { emailID } = this.props.route.params;
    return (
      <LinearGradient style={styles.Container} colors={[colors.GradientTop, colors.GradientBottom]} >
        <SafeAreaView style={styles.Container}>
          <ScrollView>
            <TouchableOpacity style={{ left: 20 }} onPress={() => this.props.navigation.goBack()}>
              <Image style={commonStyle.backBtnStyle} resizeMode="contain" source={require('../../assets/back.png')}>
              </Image>
            </TouchableOpacity>
            <View style={{ height: 60 }} />
            <View  style={{width: '90%', alignSelf: 'center'}}>
            <Text style={commonStyle.titleStyle}>{this.state.translationDic['title'] ?? 'Verification'}</Text>
            <Text style={commonStyle.subTitleStyle}>{this.state.translationDic['subTitle']} {emailID}</Text>
            <Text style={commonStyle.subTitleStyle}>{this.state.translationDic['enterCode'] ?? 'Enter Code here'}</Text>
            </View>
            <View style={{ height: 50 }} />
            <View style={styles.otpView}>
              <OTPTextView
                ref={(e) => (this.input1 = e)}
                containerStyle={{width: '60%', height: 40,}}
                // pinCount={6}
                // codeInputFieldStyle={styles.underlineStyleBase}
                // codeInputHighlightStyle={styles.underlineStyleHighLighted}
                // onCodeFilled = {code => this.verifyBtnAction(code)}
                inputCount={6}
                keyboardType="numeric"
                handleTextChange={text => this.verifyBtnAction(text)}
              />
            </View>
            <View style={{ height: 50 }} />
            <TouchableOpacity style={commonStyle.loginBtnStyle} onPress={() => this.verifyBtnAction()} >
              <Text style={commonStyle.btnTitleStyle}>{this.state.translationDic['verifyBtn']}</Text>
            </TouchableOpacity>
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
  otpView: {
    marginTop: 50,
    height: 80,
    alignSelf: 'center'
  },
  textInputContainer: {
    margin: 5,
  },
  roundedTextInput: {
    height: 45,
    width: 45,
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: colors.lightGray,
    color: colors.AppWhite
  },
  borderStyleBase: {
    width: 30,
    height: 45
  },
  borderStyleHighLighted: {
    borderColor: colors.AppWhite,
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    fontSize: 20,
    fontWeight: '600',
    color: colors.AppWhite,
  },
  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
});


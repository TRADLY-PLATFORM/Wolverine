import React, { Component } from 'react';
import { Alert, Keyboard, Text, Image, View, 
  StyleSheet, SafeAreaView, TouchableOpacity,
   ScrollView,TextInput} from 'react-native';
import 'react-native-gesture-handler';
import colors from '../../CommonClasses/AppColor';
import commonStyle from '../../StyleSheet/UserStyleSheet';
import networkService from '../../NetworkManager/NetworkManager';
import APPURL from '../../Constants/URLConstants';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import LangifyKeys from '../../Constants/LangifyKeys';
import tradlyDb from '../../TradlyDB/TradlyDB';
import AppConstants from '../../Constants/AppConstants';

export default class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OTPvalue: '',
      password: '',
      rePassword:'',
      isVisible: false,
      translationDic:{},
    }
  }
  componentDidMount() {
    this.langifyAPI()
  }
  langifyAPI = async () => {
    let forgotD = await tradlyDb.getDataFromDB(LangifyKeys.forgotpassword);
    if (forgotD != undefined) {
      this.resetPasswordTranslationData(forgotD);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.forgotpassword}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${AppConstants.appLanguage}${group}`, 'get',
      '', AppConstants.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(LangifyKeys.forgotpassword, objc)
      this.resetPasswordTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  verificationOTPApi = async () => {
    this.setState({ isVisible: true })
    const { verifyId } = this.props.route.params;
    const dict = JSON.stringify({
      'verify_id': verifyId,
      "code": this.state.OTPvalue,
      'password':this.state.password,
    })
    const responseJson = await networkService.networkCall(APPURL.URLPaths.resetPassword, 'POST', dict, '')
    console.log("responseJson = ", responseJson)
    this.setState({ isVisible: false })
    if (responseJson) {
      if (responseJson['status'] == true) {
        Alert.alert(
          this.state.translationDic['password_changed_successfully'] ?? 'Password has been changed', "",
          [
            {
              text:AppConstants.okTitle, onPress: () => {
                this.props.navigation.pop(2);
              }
            }
          ],
        );
      } else {
        Alert.alert(responseJson)
      }
    }
  }
  resetPasswordTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('forgotpassword.new_password' == obj['key']) {
        this.state.translationDic['newPassword'] = obj['value'];
      }
      if ('forgotpassword.otp_send_info' == obj['key']) {
        this.state.translationDic['otp'] = obj['value'];
      }
      if ('forgotpassword.confirm_new_password' == obj['key']) {
        this.state.translationDic['confirmPassword'] = obj['value'];
      }
      if ('forgotpassword.verify' == obj['key']) {
        this.state.translationDic['verify'] = obj['value'];
      }
      if ('forgotpassword.invalid_otp_code' == obj['key']) {
        this.state.translationDic['InvalidOtp'] =  obj['value'];
      }
      if ('forgotpassword.password_mismatch' == obj['key']) {
        this.state.translationDic['passwordMismatch'] =  obj['value'];
      }
      if ('forgotpassword.password_changed_successfully' == obj['key']) {
        this.state.translationDic['password_changed_successfully'] =  obj['value'];
      }
    }
  }
  /*  Buttons   */
  verifyBtnAction() {
    if (this.state.OTPvalue.length == 0) {
      Alert.alert(this.state.translationDic['InvalidOtp'] ?? 'Invalid OTP')
    } else if (this.state.password.length == 0) {
      Alert.alert( this.state.translationDic['passwordMismatch'] ?? 'Password does not match')
    } else if (this.state.password != this.state.rePassword) {
      Alert.alert( this.state.translationDic['passwordMismatch'] ?? 'Password does not match')
    } else {
      this.verificationOTPApi()
    }
  };
  otpOnChange(code){
    console.log(code);
    if (code) {
        this.state.OTPvalue = code;
        if (this.state.OTPvalue.length == 6) {
        }
    }
  }

  /*  UI   */
  render() {
    return (
      <LinearGradient style={styles.Container} colors={[colors.GradientTop, colors.GradientBottom]} >
        <SafeAreaView style={styles.Container}>
          <ScrollView>
            <TouchableOpacity style={{ left: 20 }} onPress={() => this.props.navigation.pop()}>
              <Image style={commonStyle.backBtnStyle} resizeMode="contain" source={require('../../assets/back.png')}>
              </Image>
            </TouchableOpacity>
            <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyle.spinnerTextStyle} />
            <View style={{ height: 60 }} />
            <View style={{ width: '90%', alignSelf: 'center' }}>
              <Text style={commonStyle.titleStyle}>{this.state.translationDic['newPassword'] ?? 'Enter new password'}</Text>
            </View>
            <View style={{ height: 50 }} />
            <View style={commonStyle.roundView}>
              <TextInput
                  style={commonStyle.txtFieldStyle}
                  placeholder={this.state.translationDic['otp'] ?? 'OTP'}
                  keyboardType={'number-pad'}
                  placeholderTextColor={colors.AppWhite}
                  onChangeText={txt => this.setState({ OTPvalue: txt })}
                />
            </View>
            <View style={commonStyle.roundView}>
              <TextInput
                style={commonStyle.txtFieldStyle}
                placeholder={this.state.translationDic['newPassword'] ?? 'Password'}
                secureTextEntry={true}
                placeholderTextColor={colors.AppWhite}
                onChangeText={txt => this.setState({ password: txt })}
              />
            </View>
            <View style={commonStyle.roundView}>
              <TextInput
                style={commonStyle.txtFieldStyle}
                placeholder={this.state.translationDic['confirmPassword'] ?? 'Re-enter Password'}
                secureTextEntry={true}
                placeholderTextColor={colors.AppWhite}
                onChangeText={txt => this.setState({ rePassword: txt })}
              />
            </View>
            <View style={{ height: 50 }} />
            <TouchableOpacity style={commonStyle.loginBtnStyle} onPress={() => this.verifyBtnAction()} >
              <Text style={commonStyle.btnTitleStyle}>{this.state.translationDic['verify'] ?? 'Update'}</Text>
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


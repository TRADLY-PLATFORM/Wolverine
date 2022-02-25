
import React, { Component } from 'react';
import {Alert,KeyboardAvoidingView, 
  TextInput, Text, Image, View, 
  StyleSheet, SafeAreaView, TouchableOpacity,ScrollView} from 'react-native';
import 'react-native-gesture-handler';
import colors from '../../CommonClasses/AppColor';
import commonStyle from '../../StyleSheet/UserStyleSheet';
import NavigationRoots from '../../Constants/NavigationRoots';
import DefaultPreference from 'react-native-default-preference';
import networkService from './../../NetworkManager/NetworkManager';
import APPURL from './../../Constants/URLConstants';
import LinearGradient from 'react-native-linear-gradient';
import { getUniqueId } from 'react-native-device-info';
import Spinner from 'react-native-loading-spinner-overlay';
import errorHandler from '../../NetworkManager/ErrorHandle'
import closeIcon from './../../assets/close.png';
import LangifyKeys from '../../Constants/LangifyKeys';
import AppConstants from '../../Constants/AppConstants';
import { AppAlert, validateEmail } from '../../HelperClasses/SingleTon';
import tradlyDb from '../../TradlyDB/TradlyDB';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      bToken: '', 
      updateUI: false,
      translationDic:{},
    }
  }
  componentDidMount() {
    DefaultPreference.get('token').then(function (value) {
      this.setState({ bToken: value })
    }.bind(this))
    this.langifyAPI();
  }
  langifyAPI = async () => {
    let signUpData = await tradlyDb.getDataFromDB(LangifyKeys.signup);
    if (signUpData != undefined) {
      this.signUpTranslationData(signUpData);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.signup}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${AppConstants.appLanguage}${group}`, 'get',
    '',AppConstants.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      console.log('objc', objc);
      tradlyDb.saveDataInDB(LangifyKeys.signup, objc)
      this.signUpTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  signUpTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('signup.welcome_to_appname' == obj['key']) {
        let text = obj['value'];
        let result = text.replace('{value}', '');
        this.state.translationDic['title'] = result;
      }
      if ('signup.create_your_account' == obj['key']) {
        this.state.translationDic['subTitle'] = obj['value'];
      }
      if ('signup.first_name' == obj['key']) {
        this.state.translationDic['firstname'] = obj['value'];
      }
      if ('signup.last_name' == obj['key']) {
        this.state.translationDic['lastname'] = obj['value'];
      }
      if ('signup.email' == obj['key']) {
        this.state.translationDic['email'] = obj['value'];
      }
      if ('signup.password' == obj['key']) {
        this.state.translationDic['password'] = obj['value'];
      }
      if ('signup.re_enter_password' == obj['key']) {
        this.state.translationDic['reEnterPassword'] = obj['value'];
      }
      if ('signup.min_password_validation' == obj['key']) {
        this.state.translationDic['minPasswordValidation'] = obj['value'];
      }
      if ('signup.password_mismatch' == obj['key']) {
        this.state.translationDic['mismatchPassword'] = obj['value'];
      }
      if ('signup.already_have_an_account' == obj['key']) {
        this.state.translationDic['loginBtn'] = obj['value'];
      }
      if ('signup.invalid_emailid' == obj['key']) {
        this.state.translationDic['invalidEmail'] = obj['value'];
      }
      if ('signup.create' == obj['key']) {
        this.state.translationDic['createBtn'] = obj['value'];
      }
      if ('signup.fill_allfields' == obj['key']) {
        this.state.translationDic['allFields'] = obj['value'];
      }
      if ('signup.alert_ok' == obj['key']) {
        this.state.translationDic['alertOk'] = obj['value'];
      }
    }
  }
  registerApi = async () => {
    this.setState({isVisible: true })
    var dict = {
      'type': 'customer',
      'uuid': getUniqueId(),
      "first_name": this.state.firstName,
      "last_name": this.state.lastName,
    }
    dict['email'] = this.state.email
    dict['password'] = this.state.password
    console.log("this.state.bToken =", this.state.bToken)
    const responseJson = await networkService.networkCall(APPURL.URLPaths.register, 'POST', JSON.stringify({ user: dict }), this.state.bToken)
    console.log("responseJson = ", responseJson)
    if (responseJson) {
        this.setState({ isVisible: false })
        if (responseJson['status'] == true) {
            this.props.navigation.navigate(NavigationRoots.Verification, {
              emailID: this.state.email,
              verifyId: responseJson['data']['verify_id'],
              parameter: dict,
              bToken: this.state.bToken,
            });
        } else {
          // let error = errorHandler.errorHandle(responseJson)
          AppAlert(responseJson,this.state.translationDic['alertOk'])
        }
    }
}
  /*  Buttons   */
  sendBtnAction() {
    if (this.state.firstName.length == 0) {
      AppAlert(this.state.translationDic['allFields'], this.state.translationDic['alertOk'])
    } else if (this.state.lastName.length == 0) {
      AppAlert(this.state.translationDic['allFields'],this.state.translationDic['alertOk'])
    } else if (this.state.email.length == 0) {
        AppAlert(this.state.translationDic['allFields'], this.state.translationDic['alertOk'])
    } else if (!validateEmail(this.state.email)) {      
      AppAlert(this.state.translationDic['invalidEmail'], this.state.translationDic['alertOk'])
    } else if (this.state.password.length == 0) {
       AppAlert(this.state.translationDic['allFields'], this.state.translationDic['alertOk'])
    } else if (this.state.password.length <= 5) {
      AppAlert(this.state.translationDic['minPasswordValidation'], this.state.translationDic['alertOk'])
    } else if (this.state.confirmPassword.length == 0) {
      AppAlert(this.state.translationDic['allFields'], this.state.translationDic['alertOk'])
    } else if (this.state.confirmPassword.length != this.state.password.length ) {
      AppAlert(this.state.translationDic['mismatchPassword'], this.state.translationDic['alertOk'])
    } 
    else {
      this.registerApi()
    }
  }
  /*  UI   */
  renderMainView = () => {
    if (this.state.updateUI) {
      return (<View>
        <Text style={commonStyle.titleStyle}>{this.state.translationDic['title']} {AppConstants.appHomeTitle}</Text>
        <Text style={commonStyle.subTitleStyle}>{this.state.translationDic['subTitle']}</Text>
        <View style={commonStyle.roundView}>
          <TextInput
            style={commonStyle.txtFieldStyle}
            placeholder={this.state.translationDic['firstname'] ?? 'First Name'}
            placeholderTextColor={colors.AppWhite}
            onChangeText={name => this.setState({ firstName: name })}
          />
        </View>
        <View style={commonStyle.roundView}>
          <TextInput
            style={commonStyle.txtFieldStyle}
            placeholder={this.state.translationDic['lastname'] ?? 'Last Name'}
            placeholderTextColor={colors.AppWhite}
            onChangeText={name => this.setState({ lastName: name })}
          />
        </View>
        <View style={commonStyle.roundView}>
          <TextInput
            style={commonStyle.txtFieldStyle}
            placeholder={this.state.translationDic['email'] ?? 'Email'}
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
        <View style={commonStyle.roundView}>
          <TextInput 
            style={commonStyle.txtFieldStyle}
            placeholder={this.state.translationDic['reEnterPassword'] ?? 'Re-enter Password'}
            secureTextEntry={true}
            placeholderTextColor={colors.AppWhite}
            onChangeText={txt => this.setState({ confirmPassword: txt })}
          />
        </View>
        <View style={{ height: 50 }} />
        <TouchableOpacity style={commonStyle.loginBtnStyle} onPress={() => this.sendBtnAction()}>
          <Text style={commonStyle.btnTitleStyle}>{this.state.translationDic['createBtn'] ?? 'Create'}</Text>
        </TouchableOpacity>
        <View style={{ height: 20 }} />
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Text style={commonStyle.forgotBtntitleStyle}>{this.state.translationDic['loginBtn'] ?? 'Login'}</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
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
            <Image source={closeIcon}/>
          </TouchableOpacity>
          <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyle.spinnerTextStyle} />
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>
            <ScrollView>
              <this.renderMainView />
            </ScrollView>
          </KeyboardAvoidingView>
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
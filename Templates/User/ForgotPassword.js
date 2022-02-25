
import React, { Component } from 'react';
import {Alert, TextInput, Text, Image, View, StyleSheet, SafeAreaView, TouchableOpacity,ScrollView} from 'react-native';
import 'react-native-gesture-handler';
import colors from '../../CommonClasses/AppColor';
import commonStyle from '../../StyleSheet/UserStyleSheet';
import DefaultPreference from 'react-native-default-preference';
import networkService from './../../NetworkManager/NetworkManager';
import APPURL from './../../Constants/URLConstants';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import LangifyKeys from '../../Constants/LangifyKeys';
import tradlyDb from '../../TradlyDB/TradlyDB';
import AppConstants from '../../Constants/AppConstants';
import { validateEmail,AppAlert } from '../../HelperClasses/SingleTon';
import NavigationRoots from '../../Constants/NavigationRoots';

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      email: '',
      bToken: '',
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
    let forgotD = await tradlyDb.getDataFromDB(LangifyKeys.passwordreset);
    if (forgotD != undefined) {
      this.forgotPasswordTranslationData(forgotD);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.passwordreset}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${AppConstants.appLanguage}${group}`, 'get',
      '', AppConstants.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(LangifyKeys.passwordreset, objc)
      this.forgotPasswordTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  forgotPasswordTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('passwordreset.enter_reset_mailid' == obj['key']) {
        let text = obj['value'];
        this.state.translationDic['title'] = text;
      }
      if ('passwordreset.reset' == obj['key']) {
        this.state.translationDic['resetBtn'] = obj['value'];
      }
      if ('passwordreset.enter_valid_emailid' == obj['key']) {
        this.state.translationDic['email'] = obj['value'];
      }
      if ('passwordreset.invalid_emailid' == obj['key']) {
        this.state.translationDic['emailValid'] = obj['value'];
      }
      if ('passwordreset.alert_ok' == obj['key']) {
        this.state.translationDic['alertOk'] =  obj['value'];
      }
      if ('passwordreset.password_updated' == obj['key']) {
        this.state.translationDic['updated'] =  obj['value'];
      }
    }
  }
  forgotPasswordApi = async () => {
    this.setState({ isVisible: true })
    var dict = { "email": this.state.email }
    const responseJson = await networkService.networkCall(APPURL.URLPaths.forgotpassword, 'POST', JSON.stringify({ user: dict }), this.state.bToken)
    console.log("responseJson = ", responseJson)
    if (responseJson) {
      this.setState({ isVisible: false })
      if (responseJson['status'] == true) {
        this.props.navigation.navigate(NavigationRoots.ResetPassword, {
          verifyId: responseJson['data']['verify_id'],
        });
        // AppAlert(this.state.translationDic['updated'],this.state.translationDic['alertOk'])
      } else {
        AppAlert(responseJson,this.state.translationDic['alertOk'])
      }
    }
  }
  /*  Buttons   */
  sendBtnAction() {
    if (this.state.email.length == 0) {
      AppAlert(this.state.translationDic['emailValid'],this.state.translationDic['alertOk'])
    } else if (!validateEmail(this.state.email)) {      
      AppAlert(this.state.translationDic['emailValid'],this.state.translationDic['alertOk'])
    }else {
      this.forgotPasswordApi()
    }
    // this.props.navigation.navigate(NavigationRoots.ResetPassword);
  }
  /*  UI   */
  render() {
    return (
      <LinearGradient style={styles.Container} colors={[colors.GradientTop, colors.GradientBottom]} >
        <SafeAreaView style={styles.Container}>
          <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyle.spinnerTextStyle} />
          <ScrollView>
            <TouchableOpacity style={{ left: 20 }} onPress={() => this.props.navigation.goBack()}>
              <Image style={commonStyle.backBtnStyle} resizeMode="contain" source={require('../../assets/back.png')}>
              </Image>
            </TouchableOpacity>
            <View style={{ height: 100 }} />
            <Text style={styles.titleStyle}>{this.state.translationDic['title'] ?? 'Forgot Password'}</Text>
            <View style={commonStyle.roundView}>
              <TextInput
                style={commonStyle.txtFieldStyle}
                placeholder={this.state.translationDic['email'] ?? 'Email'}
                placeholderTextColor={colors.AppWhite}
                onChangeText={email => this.setState({email: email })}
              />
            </View>
            <View style={{ height: 60 }} />
            <TouchableOpacity style={commonStyle.loginBtnStyle} onPress={() => this.sendBtnAction()}>
              <Text style={commonStyle.btnTitleStyle}>{this.state.translationDic['resetBtn'] ?? 'Reset'}</Text>
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
  titleStyle: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: '500',
    alignSelf: 'center',
    color: colors.AppWhite,
    textAlign: 'center',
    padding: 10,
    margin: 30,
  },
});

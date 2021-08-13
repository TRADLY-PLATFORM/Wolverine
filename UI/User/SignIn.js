
import React, { Component } from 'react';
import {Alert, TextInput, Text, Image, View, StyleSheet, SafeAreaView, TouchableOpacity,ScrollView} from 'react-native';
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
import appConstant from './../../Constants/AppConstants';
import userModel  from '../../Model/UserModel'
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
      countriesArray: [],
    }
  }
  componentDidMount() {
    // email: 'event@test.com',
    // password: '123456',
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
    console.log(" responseJson =  ", responseJson) 
    if (responseJson) {
      this.setState({ isVisible: false })
      if (responseJson['status'] == true) {
        // console.log('refresh_key => ', responseJson['data']['user']['key']);
        userModel.userData(responseJson);
        // this.props.navigation.navigate(NavigationRoots.BottomTabbar)
        this.getMyStoreApi();
      } else {
        console.log(" error ", responseJson)
        // let error = errorHandler.errorHandle(responseJson)
        // console.log('error',responseJson)
        Alert.alert(responseJson)
      }
    }
  }
  getMyStoreApi = async () => {
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.accounts}?user_id=${appConstant.userId}&page=1&type=accounts`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let acctData = responseJson['data']['accounts'];
      if (acctData.length != 0) {
        appConstant.accountID = acctData[0]['id'];
      }else{
        appConstant.accountID = '';
      }
      this.props.navigation.goBack();
    }else {
      this.setState({ isVisible: false })
    }
  }
  /*  Buttons   */
  signUpBtnAction() {
    this.props.navigation.navigate(NavigationRoots.SignUp);
  }
  sendBtnAction() {
    if (this.state.email.length == 0) {      
      Alert.alert('enter mobile ')
    } else if (this.state.password.length == 0) {
      Alert.alert('enter password ')
    } else {
      this.loginApi()
    }
  }
  /*  UI   */
  render() {
    return (
      <LinearGradient style={styles.Container} colors={[colors.GradientTop, colors.GradientBottom]} >
      <SafeAreaView style={styles.Container}>
        <TouchableOpacity style={commonStyle.closeBtnStyle} onPress={() => this.props.navigation.goBack()}>
          <Image source={closeIcon} />
        </TouchableOpacity>
        <ScrollView>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyle.spinnerTextStyle} />
          <View style={{height: 60}}/>
          <Text style={commonStyle.titleStyle}>Welcome to ClassBubs</Text>
          <Text style={commonStyle.subTitleStyle}>Login to your account</Text>
          <View style={commonStyle.roundView}>
            <TextInput
              style={commonStyle.txtFieldStyle}
              placeholder="Email"
              keyboardType='email-address'
              placeholderTextColor={colors.AppWhite}
              onChangeText={email => this.setState({ email: email })}
            />
          </View>
          <View style={commonStyle.roundView}>
            <TextInput
              style={commonStyle.txtFieldStyle}
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor={colors.AppWhite}
              onChangeText={txt => this.setState({ password: txt })}
            />
          </View>
          <View style={{ height: 50 }} />
          <TouchableOpacity 
            style={commonStyle.loginBtnStyle}
            onPress={()=>  this.sendBtnAction()}>
            <Text style={commonStyle.btnTitleStyle}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>  this.props.navigation.navigate(NavigationRoots.ForgotPassword)}>
            <Text style={commonStyle.forgotBtntitleStyle}>Forgot your password?</Text>
          </TouchableOpacity>
          <View style={{ height: 50 }} />
          <TouchableOpacity onPress={() => this.signUpBtnAction()}>
            <Text style={commonStyle.forgotBtntitleStyle}>Don’t have an account? Sign up</Text>
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
});
import React, { Component } from 'react';
import { Alert, Keyboard, Text, Image, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import colors from '../../CommonClasses/AppColor';
import commonStyle from '../../StyleSheet/UserStyleSheet';
import NavigationRoots from '../../Constants/NavigationRoots';
import DefaultPreference from 'react-native-default-preference';
import networkService from '../../NetworkManager/NetworkManager';
import APPURL from '../../Constants/URLConstants';
import LinearGradient from 'react-native-linear-gradient';
import OTPTextView from 'react-native-otp-textinput';
import errorHandler from '../../NetworkManager/ErrorHandle'


export default class Verification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OTPvalue: '',
    }
  }
  componentDidMount() {
  }
  verificationOTPApi = async () => {
    console.log('this.state.OTPvalue', this.state.OTPvalue);
    const { verifyId, bToken } = this.props.route.params;
    const dict = JSON.stringify({
      'verify_id': verifyId,
      "code": this.state.OTPvalue,
    })
    const responseJson = await networkService.networkCall(APPURL.URLPaths.verify, 'POST', dict, bToken)
    console.log("responseJson = ", responseJson)
    if (responseJson) {
      if (responseJson['status'] == true) {
        this.props.navigation.navigate(NavigationRoots.BottomTabbar)
      } else {
        let error = errorHandler.errorHandle(responseJson['error']['code'])
        setTimeout(() => {
          Alert.alert(error)
        }, 50)
      }
    }
  }
  resendCodeAPI = async () => {
    const { parameter, bToken} = this.props.route.params;
    const responseJson = await networkService.networkCall(APPURL.URLPaths.register, 'POST', JSON.stringify({ user: parameter }),bToken)
    // console.log("responseJson = ", responseJson)
    if (responseJson) {
      if (responseJson['status'] == true) {
        Alert.alert('OTP Sent!!!')
      } else {
        let error = errorHandler.errorHandle(responseJson['error']['code'])
        setTimeout(() => {
          Alert.alert(error)
        }, 50)
      }
    }
  }
  /*  Buttons   */
  verifyBtnAction = () => {
    Keyboard.dismiss()
    const { otpInput = '' } = this.state;
    if (otpInput) {
        console.log("otpInput",otpInput)
        this.setState({ OTPvalue: otpInput })
        if (this.state.OTPvalue.length != 6) {
            // Alert.alert('Invalid OTP')
        } else {
        //     console.log("verif",this.state.OTPvalue)
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
            <Text style={commonStyle.titleStyle}>Phone Verification</Text>
            <Text style={commonStyle.subTitleStyle}>Verification code has been sent to below {emailID}</Text>
            <Text style={commonStyle.subTitleStyle}>Enter your OTP code here</Text>
            <View style={{ height: 50 }} />
            <View style={styles.otpView}>
              <OTPTextView
                ref={(e) => (this.input1 = e)}
                handleTextChange={(text) => this.setState({ otpInput: text })}
                inputCount={6}
                keyboardType="numeric"
                tintColor={colors.AppWhite}
                offTintColor={colors.AppWhite}
                containerStyle={styles.textInputContainer}
                textInputStyle={styles.roundedTextInput}
              />
            </View>
            <View style={{ height: 50 }} />
            <TouchableOpacity style={commonStyle.loginBtnStyle} onPress={() => this.verifyBtnAction()} >
              <Text style={commonStyle.btnTitleStyle}>Verification</Text>
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
    width: '100%',
    flexDirection: "row",
    justifyContent: "center"
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
});
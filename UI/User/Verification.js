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
// import OtpInputs from 'react-native-otp-inputs';
import OTPInputView from '@twotalltotems/react-native-otp-input'


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
        // let error = errorHandler.errorHandle(responseJson)
        Alert.alert(responseJson)
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
        // let error = errorHandler.errorHandle(responseJson)
          Alert.alert(responseJson)
      }
    }
  }
  /*  Buttons   */
  verifyBtnAction(code){
    Keyboard.dismiss()
    console.log(code);
    if (code) {
        this.state.OTPvalue = code;
        if (this.state.OTPvalue.length != 6) {
            Alert.alert('Invalid OTP')
        } else {
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
            <Text style={commonStyle.titleStyle}>Phone Verification</Text>
            <Text style={commonStyle.subTitleStyle}>Verification code has been sent to below {emailID}</Text>
            <Text style={commonStyle.subTitleStyle}>Enter your OTP code here</Text>
            </View>
            <View style={{ height: 50 }} />
            <View style={styles.otpView}>
              <OTPInputView
                style={{width: '80%', height: 40}}
                pinCount={6}
                // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                // onCodeChanged = {code => { this.setState({code})}}
                autoFocusOnLoad
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled = {code => this.verifyBtnAction(code)}
              />
              {/* <OtpInputs
                handleChange={(code) => console.log(code)}
                numberOfInputs={6}
              /> */}
              {/* <OTPTextView
                ref={(e) => (this.input1 = e)}
                handleTextChange={(text) => this.setState({ otpInput: text })}
                inputCount={6}
                keyboardType="numeric"
                tintColor={colors.AppWhite}
                offTintColor={colors.AppWhite}
                containerStyle={styles.textInputContainer}
                textInputStyle={styles.roundedTextInput}
              /> */}
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



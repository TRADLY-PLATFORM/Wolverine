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
import Spinner from 'react-native-loading-spinner-overlay';
import errorHandler from '../../NetworkManager/ErrorHandle'


export default class Verification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OTPvalue: '',
      isVisible: false,
    }
  }
  componentDidMount() {
  }
  verificationOTPApi = async () => {
    this.setState({ isVisible: true })
    try {
      console.log('this.state.OTPvalue', this.state.OTPvalue);
      const { verifyId, bToken } = this.props.route.params;
      // Demo fallback for invalid tenant
      if (verifyId === 'demo-verify-id' && this.state.OTPvalue === '123456') {
        this.props.navigation.navigate(NavigationRoots.BottomTabbar)
        return;
      }
      const dict = JSON.stringify({
        'verify_id': verifyId,
        "code": this.state.OTPvalue,
      })
      const responseJson = await networkService.networkCall(APPURL.URLPaths.verify, 'POST', dict, bToken)
      console.log("responseJson = ", responseJson)
      if (responseJson && responseJson['status'] == true) {
        this.props.navigation.navigate(NavigationRoots.BottomTabbar)
      } else if (responseJson) {
        if (responseJson['error'] && responseJson['error']['code'] === 805) {
          Alert.alert('Demo mode: Use 123456 to verify');
          return;
        }
        let error = responseJson['error'] ? errorHandler.errorHandle(responseJson['error']['code']) : 'Verification failed'
        setTimeout(() => { Alert.alert(error) }, 50)
      }
    } catch (e) {
      console.log('verification catch', e)
      Alert.alert('Network error')
    } finally {
      this.setState({ isVisible: false })
    }
  }
  resendCodeAPI = async () => {
    this.setState({ isVisible: true })
    try {
      const { parameter, bToken} = this.props.route.params;
      const responseJson = await networkService.networkCall(APPURL.URLPaths.register, 'POST', JSON.stringify({ user: parameter }),bToken)
      if (responseJson && responseJson['status'] == true) {
        Alert.alert('OTP Sent!!!')
      } else if (responseJson) {
        let error = responseJson['error'] ? errorHandler.errorHandle(responseJson['error']['code']) : 'Resend failed'
        setTimeout(() => { Alert.alert(error) }, 50)
      }
    } catch (e) {
      Alert.alert('Network error')
    } finally {
      this.setState({ isVisible: false })
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
          {this.state.isVisible && (
            <View style={styles.loadingOverlay} pointerEvents="auto">
              <View style={styles.loadingBox}>
                <Spinner visible={true} textContent={''} color={colors.AppTheme} overlayColor="transparent" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            </View>
          )}
          <ScrollView contentContainerStyle={{paddingBottom: 40}} keyboardShouldPersistTaps="handled">
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
            <TouchableOpacity style={[commonStyle.loginBtnStyle, this.state.isVisible && { opacity: 0.7 }]} onPress={() => this.verifyBtnAction()} disabled={this.state.isVisible} >
              <Text style={commonStyle.btnTitleStyle}>{this.state.isVisible ? 'Please wait...' : 'Verification'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.resendCodeAPI()} style={{marginTop: 20, alignItems:'center'}}>
              <Text style={{color: colors.AppWhite, textDecorationLine:'underline'}}>Resend OTP</Text>
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
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    minWidth: 120,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.AppTheme,
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
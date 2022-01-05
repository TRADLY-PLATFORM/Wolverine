import React, { Component } from 'react';
import { Alert, Keyboard, Text, Image, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import colors from '../../CommonClasses/AppColor';
import commonStyle from '../../StyleSheet/UserStyleSheet';
import NavigationRoots from '../../Constants/NavigationRoots';
import networkService from '../../NetworkManager/NetworkManager';
import APPURL from '../../Constants/URLConstants';
import LinearGradient from 'react-native-linear-gradient';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import userModel  from '../../Model/UserModel'
import DeviceInfo from 'react-native-device-info';
import appConstant from './../../Constants/AppConstants';
import OTPTextView from 'react-native-otp-textinput';


export default class Verification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OTPvalue: '',
      deviceName: '',
      manufacturer:'',
    }
  }
  componentDidMount() {
    this.getSystemDetail();
  }
  async getSystemDetail () {
    DeviceInfo.getDeviceName().then((deviceName) => {
      this.state.deviceName = deviceName;
    })
    DeviceInfo.getDeviceName().then((manufacturer) => {
      this.state.manufacturer = manufacturer;
    })
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
        userModel.userData(responseJson);
        this.updateDeviceInfoAPI()
        this.props.navigation.reset({index: 0, routes: [{name: NavigationRoots.BottomTabbar }]});
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
            <Text style={commonStyle.titleStyle}>Email Verification</Text>
            <Text style={commonStyle.subTitleStyle}>Verification code has been sent to below {emailID}</Text>
            <Text style={commonStyle.subTitleStyle}>Enter your OTP code here</Text>
            </View>
            <View style={{ height: 50 }} />
            <View style={styles.otpView}>
              <OTPTextView
                ref={(e) => (this.input1 = e)}
                containerStyle={{ width: '60%', height: 40, }}
                inputCount={6}
                keyboardType="numeric"
                handleTextChange={text => this.verifyBtnAction(text)}
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



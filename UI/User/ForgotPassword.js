
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

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      email: '',
      bToken: '',
    }
  }
  componentDidMount() {
    DefaultPreference.get('token').then(function (value) {
      this.setState({ bToken: value })
    }.bind(this))
  }
  forgotPasswordApi = async () => {
    this.setState({isVisible: true })
    try {
      var dict = {"email": this.state.email}
      const responseJson = await networkService.networkCall(APPURL.URLPaths.forgotpassword, 'POST', JSON.stringify({ user: dict }), this.state.bToken)
      console.log("responseJson = ", responseJson)
      if (responseJson && responseJson['status'] == true) {
        setTimeout(() => {Alert.alert('Sent! Check your email.')}, 50)
      } else if (responseJson) {
        let msg = responseJson['error'] ? errorHandler.errorHandle(responseJson['error']['code']) : 'Request failed'
        if (responseJson['error'] && responseJson['error']['code'] === 805) {
          Alert.alert('Demo mode: Invalid tenant. Password recovery mocked as sent.');
          return;
        }
        setTimeout(() => {Alert.alert(msg)}, 50)
      }
    } catch (e) {
      console.log('forgotPasswordApi catch', e)
      Alert.alert('Network error')
    } finally {
      this.setState({ isVisible: false })
    }
}
  /*  Buttons   */
  sendBtnAction() {
    if (this.state.email.length == 0) {
        Alert.alert('enter email id');
    } else {
      this.forgotPasswordApi()
    }
  }
  /*  UI   */
  render() {
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
            <View style={{ height: 50 }} />
            <Text style={commonStyle.titleStyle}>Forgot Password</Text>
            <Text style={commonStyle.subTitleStyle}>Enter your registered mail id to{'\n'}receive OTP and reset{'\n'} password</Text>
            <View style={commonStyle.roundView}>
              <TextInput
                style={commonStyle.txtFieldStyle}
                placeholder="Email Id"
                placeholderTextColor={colors.AppWhite}
                onChangeText={email => this.setState({email: email })}
              />
            </View>
            <View style={{ height: 60 }} />
            <TouchableOpacity style={[commonStyle.loginBtnStyle, this.state.isVisible && { opacity: 0.7 }]} onPress={() => this.sendBtnAction()} disabled={this.state.isVisible}>
              <Text style={commonStyle.btnTitleStyle}>{this.state.isVisible ? 'Please wait...' : 'Send'}</Text>
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
});
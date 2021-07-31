
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
    var dict = {"email": this.state.email}
    const responseJson = await networkService.networkCall(APPURL.URLPaths.forgotpassword, 'POST', JSON.stringify({ user: dict }), this.state.bToken)
    console.log("responseJson = ", responseJson)
    if (responseJson) {
        this.setState({ isVisible: false })
        if (responseJson['status'] == true) {
          Alert.alert('Sent!')
        } else {
          Alert.alert(responseJson)
          }
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
          <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyle.spinnerTextStyle} />
          <ScrollView>
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
            <TouchableOpacity style={commonStyle.loginBtnStyle} onPress={() => this.sendBtnAction()}>
              <Text style={commonStyle.btnTitleStyle}>Send</Text>
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
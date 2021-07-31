
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

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      bToken: '', 
    }
  }
  componentDidMount() {
    DefaultPreference.get('token').then(function (value) {
      this.setState({ bToken: value })
    }.bind(this))
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
          Alert.alert(responseJson)
        }
    }
}
  /*  Buttons   */
  sendBtnAction() {
    if (this.state.email.length == 0) {
        Alert.alert('enter email id');
    } else if (this.state.password.length == 0) {
      Alert.alert('enter password')
    } else if (this.state.confirmPassword.length != this.state.password.length ) {
      Alert.alert('password does not match')
    }
    else {
      this.registerApi()
    }
  }
  /*  UI   */
  render() {
    return (
      <LinearGradient style={styles.Container} colors={[colors.GradientTop, colors.GradientBottom]} >
        <SafeAreaView style={styles.Container}>
          <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyle.spinnerTextStyle} />
          <ScrollView>
            <Text style={commonStyle.titleStyle}>Welcome to ClassBubs</Text>
            <Text style={commonStyle.subTitleStyle}>Sign Up your account</Text>
            <View style={commonStyle.roundView}>
              <TextInput
                style={commonStyle.txtFieldStyle}
                placeholder="First Name"
                placeholderTextColor={colors.AppWhite}
                onChangeText={name => this.setState({firstName: name })}
              />
            </View>
            <View style={commonStyle.roundView}>
              <TextInput
                style={commonStyle.txtFieldStyle}
                placeholder="last Name"
                placeholderTextColor={colors.AppWhite}
                onChangeText={name => this.setState({lastName: name })}
              />
            </View>
            <View style={commonStyle.roundView}>
              <TextInput
                style={commonStyle.txtFieldStyle}
                placeholder="Email Id"
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
            <View style={commonStyle.roundView}>
              <TextInput
                style={commonStyle.txtFieldStyle}
                placeholder="Re-enter Password"
                secureTextEntry={true}
                placeholderTextColor={colors.AppWhite}
                onChangeText={txt => this.setState({ confirmPassword: txt })}
              />
            </View>
            <View style={{ height: 50 }} />
            <TouchableOpacity style={commonStyle.loginBtnStyle} onPress={() => this.sendBtnAction()}>
              <Text style={commonStyle.btnTitleStyle}>Create account</Text>
            </TouchableOpacity>
            <View style={{ height: 20 }} />
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Text style={commonStyle.forgotBtntitleStyle}>have an account? Sign in</Text>
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
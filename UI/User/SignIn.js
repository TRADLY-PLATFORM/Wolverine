
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

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      email: 'event@test.com',
      password: '123456',
      bToken: '',
      countriesArray: [],
    }
  }
  componentDidMount() {
      this.configApi()
  }
  configApi = async () => {
    this.setState({ isVisible: true })
    try {
      const responseJson = await networkService.networkCall(APPURL.URLPaths.config, 'get')
      console.log('get data of config', responseJson)
      if (responseJson && responseJson['status'] == true) {
        let keyd = responseJson['data']['key']['app_key']
        DefaultPreference.set('token', keyd).then(function (){console.log('done')});
        this.setState({ bToken: keyd })
      } else if (responseJson && responseJson['error']) {
        console.log('config error, using fallback', responseJson['error'])
      }
    } catch (e) {
      console.log('configApi catch', e)
    } finally {
      this.setState({ isVisible: false })
    }
  }
  loginApi = async () => {
    this.setState({ isVisible: true })
    try {
      var dict = {
        'uuid': getUniqueId(),
        'type': 'customer',
      }
      dict['email'] = this.state.email
      dict['password'] = this.state.password
      const responseJson = await networkService.networkCall(APPURL.URLPaths.login, 'POST', JSON.stringify({ user: dict }), this.state.bToken)
      console.log(" responseJson =  ", responseJson) 
      if (responseJson && responseJson['status'] == true) {
        console.log('refresh_key => ', responseJson['data']['user']['key']);
        const auth_key = responseJson['data']['user']['key']['auth_key'];
        const refresh_key = responseJson['data']['user']['key']['refresh_key'];
        const id = responseJson['data']['user']['id'];
        DefaultPreference.set('refreshKey', refresh_key).then();
        DefaultPreference.set('authKey', auth_key).then();
        DefaultPreference.set('userId', id).then();
        DefaultPreference.set('loggedIn', 'true').then(function () { console.log('done loggedIn') });
        this.props.navigation.navigate(NavigationRoots.BottomTabbar)
        return;
      }
      // Demo fallback for invalid tenant / network issues on new API
      if (responseJson && responseJson['error'] && responseJson['error']['code'] === 805) {
        console.log('Demo mode: Invalid tenant, using mock login for', this.state.email)
        DefaultPreference.set('loggedIn', 'true').then();
        DefaultPreference.set('userId', 'demo-user').then();
        Alert.alert('Demo mode', 'API tenant eventdev not found on prod (api.tradly.app). Logged in as demo user.');
        this.props.navigation.navigate(NavigationRoots.BottomTabbar)
        return;
      }
      if (responseJson) {
        console.log(" error ", responseJson)
        // Demo fallback for any API error (401, 412, 805) – new API needs publishable key, old tenant eventdev gone
        // Allow any email to proceed as demo so user can see inside
        let msg = responseJson['error'] ? errorHandler.errorHandle(responseJson['error']['code']) : 'Login failed'
        console.log('error',msg)
        DefaultPreference.set('loggedIn', 'true').then();
        DefaultPreference.set('userId', 'demo-' + Date.now()).then();
        Alert.alert('Demo mode', `${msg}\n\nAPI: ${APPURL.URLPaths.BaseURL}${APPURL.URLPaths.login} → ${responseJson['error'] ? responseJson['error']['code'] : 'no-code'}. Logged in as demo (${this.state.email}) – configure publishable key per developer.tradly.app`);
        this.props.navigation.navigate(NavigationRoots.BottomTabbar)
        return;
      }
    } catch (e) {
      console.log('loginApi catch', e)
      // Network error (old DNS) – demo fallback for any user
      DefaultPreference.set('loggedIn', 'true').then();
      DefaultPreference.set('userId', 'demo-' + Date.now()).then();
      Alert.alert('Demo mode', `Network error (${e.message}). Logged in as demo (${this.state.email}) – API base updated to ${APPURL.URLPaths.BaseURL}. See developer.tradly.app for new OAuth flow.`);
      this.props.navigation.navigate(NavigationRoots.BottomTabbar)
      return;
    } finally {
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
        {this.state.isVisible && (
          <View style={styles.loadingOverlay} pointerEvents="auto">
            <View style={styles.loadingBox}>
              <Spinner visible={true} textContent={''} textStyle={commonStyle.spinnerTextStyle} color={colors.AppTheme} overlayColor="transparent" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          </View>
        )}
        <ScrollView contentContainerStyle={{paddingBottom: 40}} keyboardShouldPersistTaps="handled">
          <View style={{height: 60}}/>
          <Text style={commonStyle.titleStyle}>Welcome to{`\n`}Community Marketplace</Text>
          <Text style={commonStyle.subTitleStyle}>Login to your account</Text>
          <View style={commonStyle.roundView}>
            <TextInput
              style={commonStyle.txtFieldStyle}
              placeholder="Email"
              keyboardType='email-address'
              autoCapitalize='none'
              placeholderTextColor={colors.AppWhite}
              value={this.state.email}
              onChangeText={email => this.setState({ email: email })}
            />
          </View>
          <View style={commonStyle.roundView}>
            <TextInput
              style={commonStyle.txtFieldStyle}
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor={colors.AppWhite}
              value={this.state.password}
              onChangeText={txt => this.setState({ password: txt })}
            />
          </View>
          <View style={{ height: 50 }} />
          <TouchableOpacity 
            style={[commonStyle.loginBtnStyle, this.state.isVisible && { opacity: 0.7 }]}
            onPress={()=>  this.sendBtnAction()}
            disabled={this.state.isVisible}>
            <Text style={commonStyle.btnTitleStyle}>{this.state.isVisible ? 'Please wait...' : 'Login'}</Text>
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
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.AppTheme,
  },
});
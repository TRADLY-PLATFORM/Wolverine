import React, { Component } from 'react';
import {
  FlatList,
  Linking,
  Text,
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import appConstant from '../../../../Constants/AppConstants';
import APPURL from '../../../../Constants/URLConstants';
import networkService from '../../../../NetworkManager/NetworkManager';
import NavigationRoots from '../../../../Constants/NavigationRoots';
import HeaderView from '../../../../Component/Header'
import colors from '../../../../CommonClasses/AppColor';
import commonStyles from '../../../../StyleSheet/UserStyleSheet';
import eventStyles from '../../../../StyleSheet/EventStyleSheet';
import paymentIcon from '../../../../assets/paymentIcon.png';
import waitingIcon from '../../../../assets/waiting.png';
import connectedIcon from '../../../../assets/connected.png';
import errorIcon from '../../../../assets/error.png';


import Spinner from 'react-native-loading-spinner-overlay';
import StripConnectAccount from './StripConnectAccount';
export default class ConfirmBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
      updateUI: false,
      stripConnected: false,
      stripConnectedOnboarding: false,
      payoutsEnabled: false,
      errorArray: [],
      loadData: false,
    }
  }

  componentDidMount() {
    this.getUserDetailApi()
    this.getStripConnectAccountApi()
  }
  getUserDetailApi = async () => {
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.users}/${appConstant.userId}`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let acctData = responseJson['data']['user'];
      this.state.stripConnected = acctData['metadata']['stripe_connected'];
      this.state.stripConnectedOnboarding = acctData['metadata']['stripe_connect_onboarding'];
      console.log('acctData',acctData);
      this.setState({updateUI: !this.state.updateUI, isVisible: false})
    }else {
      this.setState({ isVisible: false })
    }
  }
  getStripConnectAccountApi = async () => {
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.stripeConnectAccount}${appConstant.accountID}`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let acctData = responseJson['data'];
      this.state.errorArray = [];
      if (acctData['errors']) {
        let sError = acctData['errors'];
        for (let obj of sError) {
          this.state.errorArray.push(obj['reason']);
        }
      }
      this.state.payoutsEnabled = acctData['payouts_enabled'];
      this.setState({updateUI: !this.state.updateUI, isVisible: false,loadData: true })
    }else {
      this.setState({ isVisible: false })
    }
  }
  createAccountLinkApi = async () => {
    this.setState({ isVisible: true })
    var dict = {'account_id': appConstant.accountID}
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.createAccountLink}`, 'post',
      JSON.stringify(dict),appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let acData = responseJson['data'];
      Linking.openURL(acData['account_link']);
      this.setState({updateUI: !this.state.updateUI, isVisible: false})
    }else {
      this.setState({ isVisible: false })
    }
  }
  /*  Buttons   */
 
  connectStripBtnAction(){
    if (!this.state.stripConnectedOnboarding){
      this.createAccountLinkApi();
    }
  }

  /*  UI   */

  renderStripStatusView = () => {
    var imageIcon = paymentIcon
    var buttonTitle = 'View Dashboard';
    var title = 'Waiting for Stripe verification';
    var subTitle = '';
    if (this.state.stripConnectedOnboarding == false) {
      imageIcon = paymentIcon
      title = `Countinue to stripe payout \n to receive payments`
      subTitle = 'We suggest you to open new stripe connect through this link () and come back to this page to authenticate.'
      buttonTitle = 'Connect with Stripe';
    } if (this.state.payoutsEnabled == false && this.state.stripConnectedOnboarding == true) {
      imageIcon = waitingIcon
      title = 'Waiting for Stripe verification';
      subTitle = 'Your Stripe connect profile is under verification from Stripe.  If you want to change the information, view the dashboard to change.'
    }  
    if (this.state.payoutsEnabled == true  && this.state.stripConnectedOnboarding == true) {
      imageIcon = connectedIcon
      title = 'Stripe verification success';
      subTitle = 'Congratulations, your Stripe account has been connected successfully. Now you can receive payments to the bank account of your choice!'
    }
    if (this.state.errorArray.length != 0) {
      title = 'Stripe verification failed'
      subTitle = this.state.errorArray.toString();
      imageIcon = errorIcon
      buttonTitle = 'View Dashboard';
    }

    if (this.state.loadData) {
    return (<View style= {{alignItems: 'center'}}>
      <View style={{ height: '10%' }} />
      <Image style={{ aspectRatio: 1 / 1 }} source={imageIcon}></Image>
      <View style={{ height: 20 }} />
      <Text style={{ color: colors.AppGray, fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
        {title}
      </Text>
      <Text style={styles.subTitleTxtStyle}>{subTitle}</Text>
      <View style={{ height: 30 }} />
      <TouchableOpacity style={styles.bottomBtnViewStyle} onPress={() => this.connectStripBtnAction()}>
        <View style={eventStyles.applyBtnViewStyle} >
          <Text style={{ color: colors.AppWhite, fontWeight: '600' }}>{buttonTitle}</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.subTitleTxtStyle}>
        You’ll be redirected to Stripe
      </Text>
    </View>)
    }else {
      return (<View />);
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Payments'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '97%', backgroundColor: colors.LightBlueColor, alignItems: 'center'}}>
          <this.renderStripStatusView />
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.AppTheme
  },
  subTitleTxtStyle:{
    padding: 16,
    marginTop:20,
    color: colors.AppGray, fontSize: 14, fontWeight: '400', textAlign: 'center',
  },
  bottomBtnViewStyle: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 2,
    borderRadius: 20,
  },
});


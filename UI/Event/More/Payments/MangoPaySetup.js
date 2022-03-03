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
  AppState,
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

import LangifyKeys from '../../../../Constants/LangifyKeys';
import tradlyDb from '../../../../TradlyDB/TradlyDB';


export default class MangoPaySetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
      updateUI: false,
      stripConnected: false,
      mangoPayConnectedOnboarding: false,
      payoutsEnabled: false,
      translationDic:{},
      mangopayKYCSubmission: false,
      mangopayKYCPayouts: false,
      mangoPayKYCStatus:'',
      mangoPayCheckFailed:false,
      appState: AppState.currentState,

    }
  }

  componentDidMount() {
    // this.langifyAPI();
    this.getUserDetailApi();
    this.loadApi();
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  langifyAPI = async () => {
    let searchD = await tradlyDb.getDataFromDB(LangifyKeys.payments);
    if (searchD != undefined) {
      this.paymentsTranslationData(searchD);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.payments}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${appConstant.appLanguage}${group}`, 'get', '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(LangifyKeys.payments, objc)
      this.paymentsTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  paymentsTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('payments.header_title' == obj['key']) {
        this.state.translationDic['title'] = obj['value'];
      }
      if ('payments.view_dashboard' == obj['key']) {
        this.state.translationDic['viewDashboard'] = obj['value'];
      }  
      if ('payments.stripe_status_waiting_message' == obj['key']) {
        this.state.translationDic['stripe_status_waiting_message'] = obj['value'];
      }
      if ('payments.connect_with_stripe' == obj['key']) {
        this.state.translationDic['connect_with_stripe'] = obj['value'];
      }
      if ('payments.stripe_express_connect_waiting' == obj['key']) {
        this.state.translationDic['stripe_express_connect_waiting'] = obj['value'];
      }
      if ('payments.stripe_status_connection_success' == obj['key']) {
        this.state.translationDic['stripe_status_connection_success'] = obj['value'];
      }
      if ('payments.stripe_express_connect_success' == obj['key']) {
        this.state.translationDic['stripe_express_connect_success'] = obj['value'];
      }
      if ('payments.stripe_status_verification_failed' == obj['key']) {
        this.state.translationDic['stripe_status_verification_failed'] = obj['value'];
      }
      if ('payments.redirected_to_stripe' == obj['key']) {
        this.state.translationDic['redirected_to_stripe'] = obj['value'];
      }
      if ('payments.connect_stripe_express_message' == obj['key']) {
        this.state.translationDic['connect_stripe_express_message'] = obj['value'];
      }
      if ('payments.setup_payout' == obj['key']) {
        this.state.translationDic['setup_payout'] = obj['value'];
      }
    }
  }
  loadApi() {
    this.getUserDetailApi();
    this.getMangoConnectAccountApi();
  }
  getUserDetailApi = async () => {
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.users}/${appConstant.userId}`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let acctData = responseJson['data']['user'];
      this.state.mangopayKYCSubmission = acctData['metadata']['mangopay_kyc_submission'] || false;
      this.setState({updateUI: !this.state.updateUI, isVisible: false,loadData: true})
    }else {
      this.setState({ isVisible: false })
    }
  }
   getMangoConnectAccountApi = async () => {
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.mangoPayConnectAccount}${appConstant.accountID}`, 'get','',appConstant.bToken,appConstant.authKey)
    console.log('responseJson kyc detail api', responseJson);
    if (responseJson['status'] == true) {
      let acctData = responseJson['data'];
      this.state.mangopayKYCPayouts = acctData['mangopay_payouts_enabled'];
      this.state.mangoPayKYCStatus = acctData['mangopay_kyc_status'];
      this.state.mangoPayCheckFailed = acctData['mangopay_kyc_check_failed'];
      this.setState({updateUI: !this.state.updateUI, isVisible: false,loadData: true })
    }else {
      this.setState({ isVisible: false })
    }
  }

  /*   App State  */
  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.loadApi();
    }
    this.setState({ appState: nextAppState });
  };

  /*  Buttons   */
  submitBtnAction(){
    if (appConstant.mangoPayKYCURL.length != 0) {
      webLink = `${appConstant.mangoPayKYCURL}/set_auth?auth_key=${appConstant.authKey}&user_id=${appConstant.userId}&to=/mangopay/bank_details?mobile=true&account_id=${appConstant.accountID}`
      console.log('webLink',webLink);
      Linking.openURL(webLink);
    }
  }

  /*  UI   */

  renderSubmitBtn = () => {
    return <View style={{justifyContent: 'center', alignItems:'center'}}>
      <TouchableOpacity style={styles.bottomBtnViewStyle} onPress={() => this.submitBtnAction()}>
        <View style={eventStyles.applyBtnViewStyle} >
          <Text style={{ color: colors.AppWhite, fontWeight: '600' }}>{'Submit'}</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.subTitleTxtStyle}> {this.state.translationDic['redirected_to_mango'] ?? 'You’ll be redirected to MangoPay '}</Text>
    </View>
  }

  renderStripStatusView = () => {
    var imageIcon = paymentIcon
    var buttonTitle =  this.state.translationDic['viewDashboard'] ?? 'View Dashboard';
    var title = this.state.translationDic['stripe_status_waiting_message']?? 'Waiting for Stripe verification';
    var subTitle = '';

    var views = [];
    if (this.state.mangopayKYCSubmission == false) {
      imageIcon = paymentIcon
      title = `Countinue to Mango Pay \n to receive payments`
      subTitle =  'You have not submitted your Bank account and KYC details yet.'
      buttonTitle = 'Submit';
      views.push(<View>
        {this.renderSubmitBtn()}
       </View>)
    } else {
      title = this.state.mangoPayKYCStatus
      subTitle =  ''
      if (this.state.mangopayKYCPayouts) {
        imageIcon = connectedIcon
      } else {
        if (!this.state.mangoPayCheckFailed) {
          imageIcon = waitingIcon
        } else {
          imageIcon = errorIcon
          views.push(<View>
            {this.renderSubmitBtn()}
           </View>)
        }
      }
    } 
    if (this.state.loadData) {
    return (<View style= {{alignItems: 'center'}}>
      <View style={{ height: '10%' }} />
      <Image style={{ aspectRatio: 1 / 1 }} resizeMode={'contain'} source={imageIcon}></Image>
      <View style={{ height: 20 }} />
      <Text style={styles.titleStyle}>
        {title}
      </Text>
      <Text style={styles.subTitleTxtStyle}>{subTitle}</Text>
      <View style={{ height: 30 }} />
        {views}
    </View>)
    }else {
      return (<View />);
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={this.state.translationDic['title'] ?? 'MangoPay KYC'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} />
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
  titleStyle: {
    color: colors.AppGray,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    paddingLeft:20,
    paddingRight:20,
  },
  subTitleTxtStyle:{
    padding: 16,
    marginTop:10,
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
    elevation: 10,
    shadowRadius: 2,
    borderRadius: 20,
  },
});


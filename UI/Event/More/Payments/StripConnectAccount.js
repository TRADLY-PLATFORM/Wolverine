import React, { Component } from 'react';
import {
  FlatList,
  TextInput,
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
import Spinner from 'react-native-loading-spinner-overlay';

export default class StripConnectAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
    this.getUserDetailApi()
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
  /*  UI   */
  render() {
    return (<View style={{alignItems: 'center'}}>
          <View style={{height: '20%'}}/>
          <Image style={{height: 60, width: 60}} source={paymentIcon}></Image>
          <View style={{height: 20}}/>
          <Text style={{color: colors.AppGray, fontSize: 18, fontWeight: '600', textAlign: 'center'}}>
            Countinue to stripe payout {'\n'} to receive payments
          </Text>
          <Text style={styles.subTitleTxtStyle}>
            We suggest you to open new stripe connect 
            through this link () and come back to this page to authenticate.
          </Text>
          <View style={{height: 30}}/>
          <TouchableOpacity style={styles.bottomBtnViewStyle}>
            <View style={eventStyles.applyBtnViewStyle } >
              <Text style={{ color: colors.AppWhite,fontWeight: '600' }}>Connect with Stripe</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.subTitleTxtStyle}>
            You’ll be redirected to Stripe
          </Text>
        </View>
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
    marginTop:30,
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


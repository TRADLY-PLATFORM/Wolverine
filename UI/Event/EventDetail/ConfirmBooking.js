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

import appConstant from '../../../Constants/AppConstants';
import APPURL from '../../../Constants/URLConstants';
import networkService from '../../../NetworkManager/NetworkManager';
import NavigationRoots from '../../../Constants/NavigationRoots';
import HeaderView from '../../../Component/Header'
import colors from '../../../CommonClasses/AppColor';
import commonStyles from '../../../StyleSheet/UserStyleSheet';
import eventStyles from '../../../StyleSheet/EventStyleSheet';
import calendarIcon from '../../../assets/calendar.png';
import locationPin from '../../../assets/locationPin.png';
import {getTimeFormat,changeDateFormat,dateConversionFromTimeStamp} from '../../../HelperClasses/SingleTon'
import radio from '../../../assets/radio.svg';
import selectedradio from '../../../assets/radioChecked.svg';
import Spinner from 'react-native-loading-spinner-overlay';
import SuccessView from '../../../Component/SuccessView';
import { presentPaymentSheet,initPaymentSheet } from '@stripe/stripe-react-native';
import SvgUri from 'react-native-svg-uri';

let pType = 'stripe';

export default class ConfirmBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
      updateUI: false,
      eventDetailData:{},
      listPrice:0,
      countPrice: 1,
      paymentArray: [],
      selectedPaymentId: 0,
      selectedPaymentType: '',
      ephemeralKey: '',
      customerId: '',
      clientSecretkey: '',
      showCAlert: false,
      startTime:'',
      endTime:'',
      selectedDate:''
    }
  }
  componentDidMount() {
    // let {eventData,startTime,endTime,date} = this.props.route.params;
    // this.state.startTime = startTime;
    // this.state.endTime = endTime;
    // this.state.selectedDate = date;

    // this.state.eventDetailData = eventData
    // this.state.listPrice = this.state.eventDetailData['offer_price']['amount'];
    // this.setState({updateUI: !this.state.updateUI})
    this.getPaymentMethodsApi();
    this.getphemeralKeyApi();
  }
  getPaymentMethodsApi = async () => {
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.paymentMethod}`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let pData = responseJson['data']['payment_methods'];
      // console.log('pData', pData)
      this.state.paymentArray = pData
      this.setState({updateUI: !this.state.updateUI, isVisible: false})
    }else {
      this.setState({ isVisible: false })
    }
  }
  getphemeralKeyApi = async () => {
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.ephemeralKey}`, 'post',JSON.stringify({api_version:appConstant.apiVersion}),appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let kData = responseJson['data'];
      console.log('kData',kData);
      this.state.customerId = kData['customer_id'];
      this.state.ephemeralKey = kData['ephemeral_key']['secret'];
      this.setState({updateUI: !this.state.updateUI, isVisible: false})
    }else {
      this.setState({ isVisible: false })
    }
  }
  checkoutApiMethod = async () => {
    this.setState({ isVisible: true })
    let {shipmentId} = this.props.route.params;
    var dict = {
      'payment_method_id': this.state.selectedPaymentId,
      'shipping_method_id': shipmentId,
    }
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.cart}/${APPURL.URLPaths.checkOut}`,
    'POST',JSON.stringify({ order:dict}),appConstant.bToken,appConstant.authKey,appConstant.defaultCurrencyCode);
    if (responseJson['status'] == true) {
      let cData = responseJson['data'];
      console.log('cData', cData);
      if (this.state.selectedPaymentType == pType) {
        this.getpaymentIntentApi(cData['order_reference']);
      } else {
        this.setState({isVisible: false })
        this.setState({showCAlert: true})
      }
      // this.successAlert();
      // this.setState({updateUI: !this.state.updateUI,isVisible: false })
    } else {
      Alert.alert(responseJson)
      this.setState({ isVisible: false })
    }
  }
  getpaymentIntentApi = async (orderId) => {
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.paymentIntent}`, 'post',JSON.stringify({order_reference:orderId}),appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let pData = responseJson['data'];
      this.state.clientSecretkey = pData['client_secret'];
      this.setState({isVisible: false,showCAlert: false})
      this.initializePaymentSheet();
    }else {
      this.setState({ isVisible: false })
    }
  }
  successAlert() {
    this.setState({isVisible: false })
    this.setState({ showCAlert: false})
    this.setState({isVisible: false })
    this.navigateToOrder()
  }
  navigateToOrder() {
    setTimeout(() => {
      this.props.navigation.navigate(NavigationRoots.MyOrders);
    }, 1000);
  }
  /*  Stripe Payment Gateway */
  initializePaymentSheet = async () => {
    initPaymentSheet({
      customerId: this.state.customerId,
      customerEphemeralKeySecret: this.state.ephemeralKey,
      paymentIntentClientSecret: this.state.clientSecretkey,
    });
    this.openPaymentSheet();
  };
  openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet({clientSecret: this.state.clientSecretkey});
    if (error) {
      this.setState({ isVisible: false })
      Alert.alert( `${error.message}`, "",
        [
          {
            text: 'OK', onPress: () => {
              this.props.navigation.goBack()
            }
          }
        ],
      );
    } else {
      this.setState({ showCAlert: true})
    }
  };


  /*  Buttons   */
  confirmBookingBtnAction() {
    this.checkoutApiMethod();
  }
  incrementDecrementBtnAction(id) {
    if (id == 1) {
      this.state.countPrice = 1 + this.state.countPrice;
    }else {
     if (this.state.countPrice > 1) {
      this.state.countPrice = this.state.countPrice - 1 ;
     }
    }
    let amount = this.state.eventDetailData['list_price']['amount'];
    this.state.listPrice =  (amount * this.state.countPrice) ;
    this.setState({updateUI: !this.state.updateUI})
  }
  didSelectPaymentType(item) {
    this.setState({selectedPaymentId: item['id'],selectedPaymentType: item['type']})
  }
  /*  UI   */
  renderTimeAddressDetail = () => {
    if (this.state.eventDetailData['title']) {
      let item = this.state.eventDetailData;
      let price = this.state.eventDetailData['list_price']['formatted'];
      // let dateFr = changeDateFormat(item['start_at']  * 1000, 'ddd, MMM D');
      // time = getTimeFormat(item['start_at']) + ` to ` +  getTimeFormat(item['end_at']) 
      let dateFr = changeDateFormat(this.state.selectedDate, 'ddd, MMM D');
      time = this.state.startTime + ` to ` +  this.state.endTime
      let location = item['location'];
      var lView = [];
      if (location['formatted_address']) {
        lView.push(<View>
          <View style={{ height: 20 }} />
          <View style={{ flexDirection: 'row' }}>
            <Image style={commonStyles.backBtnStyle} resizeMode={'contain'} source={locationPin} />
            <View style={{ width: 10 }} />
            <Text style={eventStyles.commonTxtStyle}>{location['formatted_address']}</Text>
          </View>
        </View>)
      }
      return (<View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center'}}>
          <Text style={eventStyles.titleStyle}>{this.state.eventDetailData['title']}</Text>
          <Text style={eventStyles.commonTxtStyle}>{price}</Text>
        </View>
        <View style={{ height: 20 }} />
        <View style={{width: '75%'}}>
          <View style={{ flexDirection: 'row'}}>
            <Image style={commonStyles.backBtnStyle} resizeMode={'contain'} source={calendarIcon} />
            <View style={{ width: 10 }} />
            <View>
              <Text style={eventStyles.commonTxtStyle}>{dateFr}</Text>
              <View style={{ height: 5 }} />
              <Text style={eventStyles.subTitleStyle}>{time}</Text>
            </View>
          </View>
          {lView}
        </View>
      </View>)
    } else {
      return <View />
    }
  }
  renderVariantView = () => {
    let {variantData} = this.props.route.params;
    if (variantData['id']) {
    return (<View>
      <View>
        <View style={{ width: '90%' }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: colors.AppTheme }}>
            {`${variantData['stock']} tickets left`}
          </Text>
          <View style={{ height: 10 }} />
          <Text style={eventStyles.titleStyle}>{variantData['title']}</Text>
          <View style={{ height: 10 }} />
          <Text style={eventStyles.commonTxtStyle}>{variantData['list_price']['formatted']}</Text>
          <View style={{ height: 10 }} />
          <Text style={eventStyles.subTitleStyle}>{variantData['description']}</Text>
        </View>
      </View>
    </View>)
    } else {
      return <View />
    }
  }
  renderPaymentMethodsView = () => {
    return (<View>
      <FlatList
        data={this.state.paymentArray}
        renderItem={this.renderPaymentCellItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index + 2121}
        key={'P'}
      />
    </View>)
  }
  renderPaymentCellItem = ({ item, index }) => {
    let check = item['id'] == this.state.selectedPaymentId;
    return (<View>
      <TouchableOpacity style={styles.commonViewStyle} onPress={() => this.didSelectPaymentType(item)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={eventStyles.commonTxtStyle}>{item['name']}</Text>
          <View style={commonStyles.nextIconStyle}>
            <SvgUri width={20} height={20} source={check ? selectedradio : radio} fill={check ? colors.AppTheme : colors.Lightgray} />
          </View>
        </View>
      </TouchableOpacity>
      <View style={{ height: 10 }} />
    </View>)
  }
  renderTotalView = () => {
    const { grandTotal } = this.props.route.params;
    return (<View>
      {/* <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{width: '60%',justifyContent: 'center', height: 40}}>
        <Text style={eventStyles.commonTxtStyle}>Number of Members</Text>
        </View>
        <View style={{width: 120 , backgroundColor :colors.AppTheme, height: 35, flexDirection: 'row', borderRadius: 2}}>
          <TouchableOpacity style={styles.incrementBtnStye} onPress={() => this.incrementDecrementBtnAction(2)}>
            <Text style={{color: colors.AppWhite, fontSize: 25}}>-</Text>
          </TouchableOpacity>
          <View style={{flex:1, backgroundColor: 'white', margin: 1,justifyContent: 'center', alignItems: 'center'}}>
            <Text>{this.state.countPrice}</Text>
          </View>
          <TouchableOpacity style={styles.incrementBtnStye} onPress={() => this.incrementDecrementBtnAction(1)}>
            <Text style={{color: colors.AppWhite, fontSize: 25}}>+</Text>
          </TouchableOpacity>      
        </View>
      </View> */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center'}}>
        <Text style={eventStyles.commonTxtStyle}>Total</Text>
        <Text style={eventStyles.commonTxtStyle}>{`${grandTotal}`}</Text>
      </View>
    </View>) 

  }
  renderBottomBtnView = () => {
    return (<View>
      <TouchableOpacity style={styles.bottomBtnViewStyle} onPress={() => this.confirmBookingBtnAction()}
       disabled={this.state.selectedPaymentId == 0}>
        <View style={this.state.selectedPaymentId == 0 ? eventStyles.disableApplyBtnViewStyle : eventStyles.applyBtnViewStyle } >
          <Text style={{ color: colors.AppWhite,fontWeight: '600' }}>Confirm Booking</Text>
        </View>
      </TouchableOpacity>
    </View>)
  }
 
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Booking Confirmation'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor,justifyContent: 'space-between' }}>
          <ScrollView nestedScrollEnable={true} scrollEnabled={true}>
            <View style={{ height: '100%', backgroundColor: colors.LightBlueColor }}>
            {/* <View style={styles.commonViewStyle}>
              {this.renderTimeAddressDetail()}
            </View> */}
            {/* <View style={{height: 10}}/>
            <View style={styles.commonViewStyle}>
              {this.renderVariantView()}
            </View> */}
            {/* <View style={{height: 10}}/> */}
            <View style={{padding:16}}>
              <Text style={eventStyles.commonTxtStyle}>Payment Method</Text>
            </View>
            {this.renderPaymentMethodsView()}
            <View style={styles.commonViewStyle}>
              {this.renderTotalView()}
            </View>
            </View>
            <SuccessView  title={'Your order is successfull. You will get confirmation from the business.'} show={this.state.showCAlert} onPress={() => this.successAlert() }/>
          </ScrollView>
          <View style={{padding: 16}}>
            <View style={{ height: 10 }} />
            {this.renderBottomBtnView()}
            <View style={{ height: 40 }} />
          </View>
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
  commonViewStyle: {
    padding: 16,
    backgroundColor: colors.AppWhite,
    borderWidth: 1, 
    borderColor: colors.LightUltraGray,
  },
  incrementBtnStye: {
    flex:1, justifyContent: 'center',
     alignItems: 'center',
  },
  bottomBtnViewStyle: {
    width: '100%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 2,
    elevation: 10,
    borderRadius: 20,
  },
});


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
import {getNextDate,changeDateFormat,getDatesArray} from '../../../HelperClasses/SingleTon'
import radio from '../../../assets/radio.svg';
import selectedradio from '../../../assets/radioChecked.svg';
import Spinner from 'react-native-loading-spinner-overlay';
import SvgUri from 'react-native-svg-uri';
import timeIcon from '../../../assets/timeIcon.png';


export default class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      updateUI: false,
      selectedPaymentId: 0,
      selectedDateIndex: 0,
      datesArray: [],
      selectedDate:'',
      selectedTimeIndex: -1,
    }
  }

  componentDidMount() {
    this.state.datesArray = getDatesArray();
    this.setState({updateUI: !this.state.updateUI})
  }
  getPaymentMethodsApi = async () => {
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.paymentMethod}`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let pData = responseJson['data']['payment_methods'];
      console.log('pData', pData)
      this.state.paymentArray = pData
      this.setState({updateUI: !this.state.updateUI, isVisible: false})
    }else {
      this.setState({ isVisible: false })
    }
  }
  
  /*  Stripe Payment Gateway */
  

  /*  Buttons   */
  continueBookingBtnAction() {
    let {eventData,variantData} = this.props.route.params;
    this.props.navigation.navigate(NavigationRoots.ConfirmBooking,{
      eventData:eventData,
      variantData: variantData
    });
  }
  didSelectDate(index) {
    this.state.selectedDateIndex = index
    console.log('');
    this.state.selectedDate = changeDateFormat(this.state.datesArray[index - 1], 'YYYY-MM-DD');
    let nxtDate = getNextDate(this.state.datesArray[index])
    let nxt = changeDateFormat(nxtDate, 'YYYY-MM-DD')
    this.setState({ updateUI: !this.state.updateUI })
    let strtD = `${this.state.selectedDate}T00:00:00Z`;
    let endD = `${nxt}T00:00:00Z`;
  }
  didSelectTime(index) {
    this.state.selectedTimeIndex = index;
    this.setState({updateUI: !this.state.updateUI})
  }
  didSelectVariant(index) {

  }
  /*  UI   */
  renderDateListView = () => {
    return (<View style={{ margin: 5 }}>
      <View style={{ margin: 10 }}>
        <Text style={eventStyles.titleStyle}>{`Select Date & Time`}</Text>
      </View>
      <View style={{ height: 5 }} />
      <FlatList
        data={this.state.datesArray}
        numColumns={1}
        renderItem={this.renderDateListViewCellItem}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index}
        horizontal={true}
      />
      <View style={{ height: 10 }} />
      <View style={{ height: 1, backgroundColor: colors.LightUltraGray }} />
    </View>)
  }
  renderDateListViewCellItem = ({ item, index }) => {
    var dt = index == 0 ? 'Today' : changeDateFormat(this.state.datesArray[index], 'ddd D')
    if (this.state.selectedDateIndex == index) {
      return (<View style={{ margin: 5, marginLeft: 10, borderRadius: 15 }}>
        <TouchableOpacity style={eventStyles.selectedBntViewStyle} onPress={() => this.didSelectDate(index)}>
          <Text style={eventStyles.selectedBtnTxtStyle}>{dt}</Text>
        </TouchableOpacity>
      </View>
      )
    } else {
      return (<View style={{ margin: 5, marginLeft: 10, borderRadius: 15 }}>
        <TouchableOpacity style={eventStyles.addBntViewStyle} onPress={() => this.didSelectDate(index)}>
          <Text style={eventStyles.btnTxtStyle}>{dt}</Text>
        </TouchableOpacity>
      </View>
      )
    }
  }
  renderTimeListView = () => {
    return (<View style={{backgroundColor: colors.LightBlueColor }}>
      <View>
        <FlatList
          data={[1,1]}
          renderItem={this.renderTimeListViewCellItem}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index + 999}
          key={'Q'}
        />
      </View>
      <View style={{ height: 10 }} />
    </View>)
  }
  renderTimeListViewCellItem = ({item,index}) => {
    let check = index == this.state.selectedTimeIndex ? true : false;
    return (<View style={styles.timeListViewStyle}>
      <TouchableOpacity style={{flexDirection: 'row',justifyContent: 'space-between'}} onPress={() => this.didSelectTime(index)}>
        <View style={{ width: '90%',justifyContent: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            <Image style={{width: 18, height: 18}}  source={timeIcon} />
            <View style={{ width: 10 }} />
            <View>
              <Text style={{color: colors.Lightgray, fontWeight: '600'}}>{`10:00 AM to 07:00 PM`}</Text>
              <View style={{ height: 5 }} />
              <Text style={eventStyles.subTitleStyle}>{`60 mins`}</Text>
            </View>
          </View>
        </View>
        <View style={{ alignItems: 'center',justifyContent: 'center', marginTop: -7}}>
          <View style={commonStyles.nextIconStyle}>
            <SvgUri width={22} height={22} source={check ? selectedradio : radio} fill={check ? colors.AppTheme : colors.Lightgray} />
          </View>
        </View>
      </TouchableOpacity>
    </View>)
  }
  renderVariantListView = () => {
    return (<View style={{ backgroundColor: colors.LightBlueColor }}>
      <View>
        <FlatList
          data={[1, 1]}
          renderItem={this.renderVariantListViewCellItem}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index + 999}
          key={'W'}
        />
      </View>
      <View style={{ height: 10 }} />
    </View>)
  }
  renderVariantListViewCellItem = ({item,index}) => {
    let check = false;
    return (<View style={eventStyles.variantListViewStyle}>
      <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => this.didSelectVariant(item)}>
        <View style={{ width: '90%' }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: colors.AppTheme }}>
            {`5 tickets left`}
          </Text>
          <View style={{ height: 16 }} />
          <View style={{flexDirection: 'row'}}>
            <Image style={{width: 16, height: 16}}  source={timeIcon} />
            <View style={{ width: 10 }} />
            <View>
              <Text style={eventStyles.titleStyle}>{`10:00 AM`}</Text>
              <View style={{ height: 5 }} />
              <Text style={eventStyles.subTitleStyle}>{`60 mins`}</Text>
            </View>
          </View>
        </View>
        <View style={{ alignItems: 'center',justifyContent: 'center', marginTop: -7}}>
          <View style={commonStyles.nextIconStyle}>
            <SvgUri width={22} height={22} source={check ? selectedradio : radio} fill={check ? colors.AppTheme : colors.Lightgray} />
          </View>
        </View>
      </TouchableOpacity>
    </View>)
  }
  renderBottomBtnView = () => {
    return (<View>
      <TouchableOpacity style={styles.bottomBtnViewStyle} onPress={() => this.continueBookingBtnAction()}
       disabled={this.state.selectedPaymentId != 0}>
        <View style={this.state.selectedPaymentId != 0 ? eventStyles.disableApplyBtnViewStyle : eventStyles.applyBtnViewStyle } >
          <Text style={{ color: colors.AppWhite,fontWeight: '600' }}>Continue Booking</Text>
        </View>
      </TouchableOpacity>
    </View>)
  }
  render() {
    let {eventData} = this.props.route.params;
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={eventData['title'] || ''} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor,justifyContent: 'space-between' }}>
          {this.renderDateListView()}
          <ScrollView nestedScrollEnable={true} scrollEnabled={true}>
            <View style={{ height: '100%', backgroundColor: colors.LightBlueColor }}>
              <View>
                {this.renderTimeListView()}
              </View>
              <View>
                {this.renderVariantListView()}
              </View>
            </View>
          </ScrollView>
          <View style={{padding: 16}}>
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
  timeListViewStyle: {
    backgroundColor: '#fbfdfe',
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.BorderColor,
  },
});


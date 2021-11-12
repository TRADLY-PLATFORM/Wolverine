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
  Dimensions,
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
import {changeUTCFormat,changeDateFormat,getDatesArray, getTimeDifference} from '../../../HelperClasses/SingleTon'
import radio from '../../../assets/radio.svg';
import selectedradio from '../../../assets/radioChecked.svg';
import Spinner from 'react-native-loading-spinner-overlay';
import SvgUri from 'react-native-svg-uri';
import timeIcon from '../../../assets/timeIcon.png';

const windowHeight = Dimensions.get('window').height;

export default class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
      updateUI: false,
      selectedPaymentId: 0,
      selectedDateIndex: 0,
      datesArray: [],
      selectedDate:'',
      selectedTimeIndex: -1,
      scheduleArray: [],
    }
  }

  componentDidMount() {
    let cdate = getDatesArray();
    this.state.selectedDate = changeDateFormat(cdate[0], 'YYYY-MM-DD');
    this.setState({updateUI: !this.state.updateUI})
    this.getScheduleApi();
  }
  getScheduleApi = async () => {
    const {id} = this.props.route.params;
    let path = `${APPURL.URLPaths.listings}/${id}/`
    const responseJson = await networkService.networkCall(path + `${APPURL.URLPaths.schedulesPerDay}days=31&start_at=${this.state.selectedDate}`, 'get',
      '',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let pData = responseJson['data']['schedules_per_day']
      console.log('sasasas', JSON.stringify(pData));
      for (let obj of pData) {
        this.state.datesArray.push(obj['day'])
      }
      this.state.scheduleArray = pData
      this.setState({updateUI: !this.state.updateUI, isVisible: false})
    }else {
      this.setState({ isVisible: false })
    }
  }
  
  /*  Buttons   */
  continueBookingBtnAction() {
    var scheduleData = [];
    let ssData = this.state.scheduleArray[this.state.selectedDateIndex]
    scheduleData = ssData['schedules'];
    let sttimes = scheduleData[this.state.selectedTimeIndex]['start_time'];
    let edtimes = scheduleData[this.state.selectedTimeIndex]['end_time'];
    let {eventData,variantData} = this.props.route.params;
    this.props.navigation.navigate(NavigationRoots.ConfirmBooking,{
      eventData:eventData,
      variantData: variantData,
      startTime:sttimes,
      endTime:edtimes,
      date:ssData['day'],
    });
  }
  didSelectDate(index) {
    this.state.selectedTimeIndex = -1;
    this.state.selectedDateIndex = index
    this.state.selectedDate = changeDateFormat(this.state.datesArray[index], 'YYYY-MM-DD');
    this.setState({ updateUI: !this.state.updateUI })
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
    var scheduleData = [];
    if (this.state.scheduleArray[this.state.selectedDateIndex] !== undefined) {
        scheduleData = this.state.scheduleArray[this.state.selectedDateIndex]['schedules']
    }
    if (scheduleData.length != 0) {
      return (<View style={{ backgroundColor: colors.LightBlueColor }}>
        <View>
          <FlatList
            data={scheduleData}
            renderItem={this.renderTimeListViewCellItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index + 999}
            key={'Q'}
          />
        </View>
        <View style={{ height: 10 }} />
      </View>)
    } else {
      return (<View style={{ height: windowHeight/2, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={eventStyles.commonTxtStyle}> {!this.state.isVisible ? 'No schedule avialable' : ''}</Text>
    </View>)
    }
  }
  renderTimeListViewCellItem = ({item,index}) => {
    let check = index == this.state.selectedTimeIndex ? true : false;
    let duration = getTimeDifference(item['start_time'],item['end_time'])
    return (<View style={styles.timeListViewStyle}>
      <TouchableOpacity style={{flexDirection: 'row',justifyContent: 'space-between'}} onPress={() => this.didSelectTime(index)}>
        <View style={{ width: '90%',justifyContent: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            <Image style={{width: 18, height: 18}}  source={timeIcon} />
            <View style={{ width: 10 }} />
            <View>
              <Text style={eventStyles.titleStyle}>
                {`${item['start_time']} to ${item['end_time']}`}
              </Text>
              <View style={{ height: 5 }} />
              <Text style={eventStyles.subTitleStyle}>{`${duration} mins`}</Text>
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
       disabled={this.state.selectedTimeIndex == -1}>
        <View style={this.state.selectedTimeIndex == -1 ? eventStyles.disableApplyBtnViewStyle : eventStyles.applyBtnViewStyle } >
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


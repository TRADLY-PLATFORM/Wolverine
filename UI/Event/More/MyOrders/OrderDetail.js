import React, { Component } from 'react';
import {
  Text,
  Image,
  FlatList,
  ScrollView,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import NavigationRoots from '../../../../Constants/NavigationRoots';
import HeaderView from '../../../../Component/Header'
import colors from '../../../../CommonClasses/AppColor';
import commonStyles from '../../../../StyleSheet/UserStyleSheet';
import calendarIcon from '../../../../assets/calendar.png';
import locationPin from '../../../../assets/locationPin.png';
import appConstant from '../../../../Constants/AppConstants';
import APPURL from '../../../../Constants/URLConstants';
import networkService from '../../../../NetworkManager/NetworkManager';
import eventStyles from '../../../../StyleSheet/EventStyleSheet';
import sample from '../../../../assets/dummy.png';
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
import {getTimeFormat,changeDateFormat,dateConversionFromTimeStamp} from '../../../../HelperClasses/SingleTon'

export default class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myOrderArray: [],
      orderDetailData: {},
      updateUI: false,
      isVisible:true,
    }
  }
  componentDidMount() {
    this.getOrderDetailApi();
  }
  getOrderDetailApi = async () => {
    let {orderId} = this.props.route.params;
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.orderDetail}${orderId}`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let pData = responseJson['data']['order'];
      this.state.orderDetailData = pData;
      this.setState({updateUI: !this.state.updateUI, isVisible: false})
    }else {
      this.setState({ isVisible: false })
    }
  }

  /*  Buttons   */

  /*  UI   */
  renderListDetailView = () => {
    if (this.state.orderDetailData['order_details']) {
      let listD = this.state.orderDetailData['order_details'][0]['listing'];
      var photo = listD['images'] ? listD['images'] : [];
      return (<View style={{ flexDirection: 'row'}}>
        <FastImage style={{ width: 80, height: 80, borderRadius: 5 }} source={photo.length == 0 ? sample : { uri: photo[0] }} />
          <View style={{ marginLeft: 15}}>
            <Text style={eventStyles.titleStyle}>{listD['title']}</Text>
            <View style={{ height: 5 }} />
            <Text style={eventStyles.subTitleStyle}>{listD['description']}</Text>
          </View>
      </View>)
    } else {
      return <View />
    }
  }
  renderTimeAddressDetail = () => {
    if (this.state.orderDetailData['created_at']) {
      let item = this.state.orderDetailData;
      let dt = dateConversionFromTimeStamp(item['created_at']);
      let dateFr = changeDateFormat(item['start_at']  * 1000, 'ddd, MMM D');
      time = getTimeFormat(item['start_at']) + ` to ` +  getTimeFormat(item['end_at']) 
      let location = item['account']['location'];
      return (<View style={{flexDirection: 'row'}}>
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
          <View style={{ height: 20 }} />
          <View style={{ flexDirection: 'row'}}>
            <Image style={commonStyles.backBtnStyle} resizeMode={'contain'} source={locationPin} />
            <View style={{ width: 10 }} />
            <View>
              {/* <Text style={eventStyles.commonTxtStyle}>{location['locality']}</Text> */}
              {/* <View style={{ height: 5 }} /> */}
              <Text style={eventStyles.commonTxtStyle}>{'location'}</Text>
            </View>
          </View>
        </View>
        <View>
          {/* <Text style={{fontSize: 12, fontWeight: '500', color: colors.AppTheme, marginTop:10}}>
            {'View Schedules'}
          </Text> */}
        </View>
      </View>)
    } else {
      return <View />
    }
  }
  renderUserDetail = () => {
    if (this.state.orderDetailData['account']) {
      let item = this.state.orderDetailData['account'];
      var photo = item['images'] ? item['images'] : [];
      return (<View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{ height: 32, width: 32, borderRadius: 16 }} source={photo.length == 0 ? sample : { uri: photo[0] }} />
          <View style={{ width: 10 }} />
          <Text style={eventStyles.commonTxtStyle}>{item['name']}</Text>
        </View>
      </View>)
    } else {
      return <View />
    }
  }
  renderBottomBtnView = () => {
    return (<View>
      <TouchableOpacity style={eventStyles.bottomBtnViewStyle}>
        <View style={eventStyles.clearBtnViewStyle } >
          <Text style={{ color: colors.AppTheme,fontWeight: '600' }}>Cancel Booking</Text>
        </View>
      </TouchableOpacity>
    </View>)
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Orders Detail'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}/>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor, justifyContent: 'space-between' }}>
          <ScrollView nestedScrollEnable={true} scrollEnabled={true}>
            <View style={styles.commonViewStyle}>
              {this.renderListDetailView()}
            </View>
            <View style={{ height: 10 }} />
            <View style={styles.commonViewStyle}>
              {this.renderUserDetail()}
            </View>
            <View style={{ height: 10 }} />
            <View style={styles.commonViewStyle}>
              {this.renderTimeAddressDetail()}
            </View>
          </ScrollView>
          <View style={styles.commonViewStyle}>
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
});


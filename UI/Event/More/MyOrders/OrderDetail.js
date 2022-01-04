import React, { Component } from 'react';
import {
  Text,
  Image,
  Alert,
  ScrollView,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  FlatList,
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
import {dateConversionFromTimeStamp} from '../../../../HelperClasses/SingleTon'
import LinearGradient from 'react-native-linear-gradient';
import ConstantArrays from '../../../../Constants/ConstantArrays';
import OrderStatusEnum from '../../../../Model/OrderStatus';
import radio from '../../../../assets/radio.png';
import selectedradio from '../../../../assets/radioChecked.png';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';

import LangifyKeys from '../../../../Constants/LangifyKeys';
import tradlyDb from '../../../../TradlyDB/TradlyDB';
import AppConstants from '../../../../Constants/AppConstants';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myOrderArray: [],
      orderDetailData: {},
      updateUI: false,
      isVisible:false,
      showCancelBtn: false,
      showOrderStatus: false,
      showChangeView: false,
      changeStatusArray: [],
      selectedChangeStatus:0,
      translationDic:{},
      satusTranslationAry: [],
    }
    renderOrderStatusView = this.renderOrderStatusView.bind(this);
  }
  componentDidMount() {
    this.langifyAPI(LangifyKeys.orderdetail);
    this.getOrderDetailApi();
    this.langifyAPI(LangifyKeys.orderlist);
  }
  langifyAPI = async (keyGroup) => {
    let searchD = await tradlyDb.getDataFromDB(keyGroup);
    if (searchD != undefined) {
      if (LangifyKeys.orderlist == keyGroup) {
        this.orderListTranslation(searchD);
      }else {
        this.orderDetailTranslationData(searchD);
      }
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${keyGroup}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${appConstant.appLanguage}${group}`, 'get', '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(keyGroup, objc)
      if (LangifyKeys.orderlist == keyGroup) {
        this.orderListTranslation(objc);
      }else {
        this.orderDetailTranslationData(objc);
      }
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  orderDetailTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      // storedetail.header_title
      if ('orderdetail.amt' == obj['key']) {
        this.state.translationDic['amt'] = obj['value'];
      }
      if ('orderdetail.header_title' == obj['key']) {
        this.state.translationDic['title'] = obj['value'];
      }
      if ('orderdetail.order_id' == obj['key']) {
        this.state.translationDic['orderID'] = obj['value'];
      }  
      if ('orderdetail.change_status' == obj['key']) {
        this.state.translationDic['changeStatus'] = obj['value'];
      }
      if ('orderdetail.cancel_order' == obj['key']) {
        this.state.translationDic['cancelOrder'] = obj['value'];
      } 
      if ('orderdetail.units' == obj['key']) {
        this.state.translationDic['units'] = obj['value'];
      }
      if ('orderdetail.order_detail' == obj['key']) {
        this.state.translationDic['orderDetail'] = obj['value'];
      }
      if ('orderdetail.cancel_order_confirmation' == obj['key']) {
        this.state.translationDic['cancelOrderConfirmation'] = obj['value'];
      } 
      if ('orderdetail.no' == obj['key']) {
        this.state.translationDic['no'] = obj['value'];
      } 
      if ('orderdetail.yes' == obj['key']) {
        this.state.translationDic['yes'] = obj['value'];
      }
      if ('orderdetail.order_placed_successfully' == obj['key']) {
        ConstantArrays.statusArray[0]['name'] = obj['value'];
        let dic = {'id':2,'name':obj['value']};
        this.state.satusTranslationAry.push(dic);
      }
      if ('orderdetail.order_in_progress' == obj['key']) {
        ConstantArrays.statusArray[1]['name'] = obj['value'];
        let dic = {'id':3,'name':obj['value']};
        this.state.satusTranslationAry.push(dic);
      }
      if ('orderdetail.shipped' == obj['key']) {
        ConstantArrays.statusArray[2]['name'] = obj['value'];
        let dic = {'id':4,'name':obj['value']};
        this.state.satusTranslationAry.push(dic);
      }
      if ('orderdetail.order_delivered' == obj['key']) {
        ConstantArrays.statusArray[3]['name'] = obj['value'];
        let dic = {'id':9,'name':obj['value']};
        this.state.satusTranslationAry.push(dic);
      }
      if ('orderdetail.incomplete' == obj['key']) {
        let dic = {'id':1,'name':obj['value']};
        this.state.satusTranslationAry.push(dic);
      }
      if ('orderdetail.unreachable' == obj['key']) {
        let dic = {'id':5,'name':obj['value']};
        this.state.satusTranslationAry.push(dic);
      }
      if ('orderdetail.out_for_delivery' == obj['key']) {
        let dic = {'id':6,'name':obj['value']};
        this.state.satusTranslationAry.push(dic);
      }
      if ('orderdetail.undelivered_returned' == obj['key']) {
        let dic = {'id':7,'name':obj['value']};
        this.state.satusTranslationAry.push(dic);
      }
      if ('orderdetail.undelivered_return_confirmed' == obj['key']) {
        let dic = {'id':8,'name':obj['value']};
        this.state.satusTranslationAry.push(dic);
      }
      if ('orderdetail.delivery_confirmed' == obj['key']) {
        let dic = {'id':10,'name':obj['value']};
        this.state.satusTranslationAry.push(dic);
      }
      if ('orderdetail.order_cancelled' == obj['key']) {
        let dic = {'id':16,'name':obj['value']};
        this.state.satusTranslationAry.push(dic);
      }
      if ('orderdetail.ready_for_pickup' == obj['key']) {
        let dic = {'id':17,'name':obj['value']};
        this.state.satusTranslationAry.push(dic);
      }
      if ('orderdetail.order_cancelled_successfully' == obj['key']) {
        this.state.translationDic['cancelledSuccess'] = obj['value'];
      }
      // orderdetail.order_cancelled
    }
  }
  orderListTranslation(object) {
    for (let obj of object) {
      if ('orderlist.customer_return_initated' == obj['key']) {
        let dic = { 'id': 11, 'name': obj['value'] };
        this.state.satusTranslationAry.push(dic);
      }
      if ('orderlist.customer_return_picked' == obj['key']) {
        let dic = { 'id': 12, 'name': obj['value'] };
        this.state.satusTranslationAry.push(dic);
      }
      if ('orderlist.customer_return_confirmed' == obj['key']) {
        let dic = { 'id': 13, 'name': obj['value'] };
        this.state.satusTranslationAry.push(dic);
      }
      if ('orderlist.customer_return_disputed' == obj['key']) {
        let dic = { 'id': 14, 'name': obj['value'] };
        this.state.satusTranslationAry.push(dic);
      }
      if ('orderlist.canceled_by_account' == obj['key']) {
        let dic = { 'id': 15, 'name': obj['value'] };
        this.state.satusTranslationAry.push(dic);
      }
    }
  }
  getOrderDetailApi = async () => {
    let {orderId,account} = this.props.route.params;
    var path = `${APPURL.URLPaths.orderDetail}${orderId}`;
    if (account) {
      path = `${path}?account_id=${appConstant.accountID}`;
    }
    const responseJson = await networkService.networkCall(path, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let pData = responseJson['data']['order'];
      // console.log('pDataOrder ==>', JSON.stringify(pData));
      this.state.orderDetailData = pData;
      let nextStatus = this.state.orderDetailData['next_status'];
      this.state.showCancelBtn = nextStatus.includes(16);
      if (nextStatus.length != 0) {
        for (let obj of nextStatus) {
          let name =  OrderStatusEnum.code(obj);
          let dic = {'name': name, 'id': obj}
          this.state.changeStatusArray.push(dic);
        }
        this.state.showOrderStatus = true
      }
      this.setState({updateUI: !this.state.updateUI, isVisible: false})
    }else {
      this.setState({ isVisible: false })
    }
  }
  changeOrderStatusAPI = async (status) => {
    let dic = {'status': status}
    this.setState({ isVisible: true })
    let {orderId} = this.props.route.params;
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.orderDetail}${orderId}/status`, 'patch',JSON.stringify({order:dic}),appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      this.setState({ isVisible: false })
      if (status == 16) {
        this.successAlert();
      }else {
        this.getOrderDetailApi();
      }
    }else {
      this.setState({ isVisible: false })
      Alert.alert(responseJson)
    }
  }
  successAlert() {
    Alert.alert(  this.state.translationDic['cancelledSuccess'] ?? 'Order cancelled successful!', "",
    [
      {
        text: AppConstants.okTitle, onPress: () => {
          this.props.navigation.goBack()
        }
      }
    ],
  );
  }
  /*  Buttons   */
  cancelBtnAction() {
    Alert.alert(
      this.state.translationDic['cancelOrderConfirmation'] ?? "Are you sure you want to Cancel this order", "",
      [
        {
          text: this.state.translationDic['no'] ?? "Cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: this.state.translationDic['yes'] ?? 'OK', onPress: () => {
            this.changeOrderStatusAPI(16); 
          }
        }
      ],
    );
  }
  eventDetail(id){
    this.props.navigation.navigate(NavigationRoots.EventDetail, {
      id :id,
    });
  }
  storeDetail(id){
    this.props.navigation.navigate(NavigationRoots.MyStore, {
      accId :id,
    });
  }
  changeStatusDoneBtnAction() {
    this.setState({showChangeView: !this.state.showChangeView});
    this.changeOrderStatusAPI(this.state.selectedChangeStatus)
  }

  /*  UI   */
  renderListDetailView = () => {
    var orderView = [];
    if (this.state.orderDetailData['order_details']) {
      let itemAry = this.state.orderDetailData['order_details'];
      for (let obj of itemAry) {
        let listD = obj['listing'];
        let quantity = obj['quantity'];
        let grandTotal = obj['list_price']['formatted'];
        var photo = listD['images'] ? listD['images'] : [];
        orderView.push(<TouchableOpacity onPress={() => this.eventDetail(listD['id'])}>
        <View style={styles.commonViewStyle}>
          <View style={{ flexDirection: 'row', }}>
            <FastImage style={{ width: 80, height: 80, borderRadius: 5 }} source={photo.length == 0 ? sample : { uri: photo[0] }} />
            <View style={{ marginLeft: 15, width: '70%'}}>
              <Text style={eventStyles.titleStyle}>{listD['title']}</Text>
              <View style={{ height: 5 }} />
              <Text style={eventStyles.subTitleStyle}>{listD['description']}</Text>
              <View style={{ height: 10 }} />
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={{ fontSize: 14, fontWeight: '700' }}>{this.state.translationDic['units'] ?? 'Units'}: {quantity}</Text>
                  <Text style={styles.amountTxtStyle}>{grandTotal} /-</Text>
              </View>
              <View style={{marginTop:10, height: 1, width:'100%', backgroundColor: colors.LightUltraGray }} />
            </View>
          </View>
          </View>
          <View style={{ height: 10 }} />
        </TouchableOpacity>)
      }
    }
    if (this.state.orderDetailData['order_details']) {
      return (<View>
          {orderView}
      </View>)
    } else {
      return <View />
    }
  }
  renderTimeAddressDetail = () => {
    if (this.state.orderDetailData['created_at']) {
      let location = this.state.orderDetailData['account']['location'];
      var lView = [];
      if (location['formatted_address']) {
        lView.push(<View>
          <View style={{ flexDirection: 'row' }}>
            <Image style={commonStyles.backBtnStyle} resizeMode={'contain'} source={locationPin} />
            <View style={{ width: 10 }} />
            <Text style={eventStyles.commonTxtStyle}>{location['formatted_address']}</Text>
          </View>
        </View>)
      }
      if (location['formatted_address']) {
        return (
          <View>
            <View style={styles.commonViewStyle}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '75%' }}>
                  {lView}
                </View>
              </View>
            </View>
            <View style={{ height: 10 }} />
          </View>)
      } else {
        return <View />
      }
    } else {
      return <View />
    }
  }
  
  renderUserDetail = () => {
    if (this.state.orderDetailData['account']) {
      let item = this.state.orderDetailData['account'];
      var photo = item['images'] ? item['images'] : [];
      return (<TouchableOpacity onPress={() => this.storeDetail(item['id'])}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{height: 32, width: 32, borderRadius: 16}} source={photo.length == 0 ? sample : { uri: photo[0] }} />
          <View style={{ width: 10 }} />
          <Text style={eventStyles.commonTxtStyle}>{item['name']}</Text>
        </View>
      </TouchableOpacity>)
    } else {
      return <View />
    }
  }
  renderGreenRoundView = (its,show) => {
    if (show) {
    return (<LinearGradient style={{height: 16, width: 16, borderRadius: 10, backgroundColor: colors.AppTheme}} 
        colors={its? [colors.GradientTop, colors.GradientBottom]: [colors.softGray, colors.softGray]}
      />)
    } else {
      return <View />
    } 
  }
  renderGreenLineView = (its,show) => {
    if (show) {
      return (<LinearGradient style={{ height: 60, width: 2, backgroundColor: colors.AppTheme }}
        colors={its ? [colors.GradientTop, colors.GradientBottom] : [colors.softGray, colors.softGray]}
      />) 
    } else {
      return <View />
    }
  }
  renderOrderStatusView = () => {
    var views = [];
    var grandTotal = '';
    var statusHistory = [];
    var statusAry = [];
    var currentStatus = 0;
    var timeLbl = [];
    if (this.state.orderDetailData['grand_total']) {
      grandTotal = this.state.orderDetailData['grand_total']['formatted'];
      statusHistory = this.state.orderDetailData['status_history'];
      currentStatus = this.state.orderDetailData['order_status'];
    }
    if (this.state.showOrderStatus) {
      statusAry = [... ConstantArrays.statusArray]
    } else {
      for (objc of statusHistory){
        // let name =  OrderStatusEnum.code(objc['status']);
        let idx = this.state.satusTranslationAry.findIndex(x => x['id'] == objc['status'])
        var value = ''
        if (idx != -1){
           value = this.state.satusTranslationAry[idx]['name'];
        }
        let dic = {'name': value, 'id': objc['status']}
       statusAry.push(dic);
      }
    }
    var showLine = true;
    for (let a = 0; a < statusAry.length; a++) {
      let statusDic = statusAry[a];
      var sView = [];
      var currentView = [];
      var time = '';
      if (statusHistory[a]) {
        let stamp = statusHistory[a]['created_at'];
        time = dateConversionFromTimeStamp(stamp);
        time = time.replace(' ', '\n')
      }
      if (statusDic['id'] <= currentStatus) {
        if (statusDic['id'] == currentStatus && currentStatus != 16) {
          showLine = false
          acitveStatus = a;
          currentView.push(<View style={styles.lightGreenRoundViewStyle}>
             {this.renderGreenRoundView(true,  true)}
          </View>)
        }else {
          currentView.push(<View>
             {this.renderGreenRoundView(true,   true)}
          </View>)
        }
      }else {
        showLine = false
        currentView.push(<View>
          {this.renderGreenRoundView(false,  true)}
       </View>)
      }
      sView.push(<View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
        <View>
          <Text style={styles.statusTxtStyle}>{statusDic['name']}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.statusValueTxtStyle}>{time}</Text>
        </View>
      </View>)

      views.push(<View>
        <View style={{ flexDirection: 'row',zIndex: 1020 - a }}>
          <View style={{alignItems: 'center', width: 40,zIndex: 100 - a}}>
            {currentView}
            {this.renderGreenLineView(showLine, a < statusAry.length - 1  ? true : false)}
          </View>
          {sView}
        </View>
      </View>)
    }
    return (<View>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            {/* <Text style={eventStyles.titleStyle}>Current Status</Text> */}
            {/* <View style={{ height: 5 }} /> */}
            <Text style={eventStyles.commonTxtStyle}>{this.state.translationDic['orderID']  ?? 'Order ID'} - {this.state.orderDetailData['reference_number']}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '700' }}>{this.state.translationDic['amt'] ?? 'Amt'} :</Text>
            <Text style={styles.amountTxtStyle}>{grandTotal} /-</Text>
          </View>
        </View>
        <LinearGradient style={{ height: 4, backgroundColor: colors.AppTheme, width: 55, marginTop: 5, borderRadius: 2 }} colors={[colors.GradientTop, colors.GradientBottom]} />
      </View>
      <View>
        <View style={{ height: 40 }} />
        {views}
      </View>
    </View>)
  }
  renderChangeStatusView = () => {
    return (<View >
      <FlatList
        data={this.state.changeStatusArray}
        numColumns={1}
        renderItem={this.renderChangeStatusItemCell}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
      />
    </View>)
  }
  renderChangeStatusItemCell = ({item, index }) => {
    let check = item['id'] == this.state.selectedChangeStatus ? true : false
    var views = [];
    var title = item['name']
    let idx = this.state.satusTranslationAry.findIndex(x => x['id'] == item['id'])
    if (idx != -1) {
      title = this.state.satusTranslationAry[idx]['name'];
    }

    views.push(<View style={commonStyles.nextIconStyle}> 
        <Image style={{width:20,height:20,tintColor:check ? colors.AppTheme : colors.Lightgray}} source={check ? selectedradio : radio}/>
    </View>)
    return (
      <TouchableOpacity onPress={() => this.setState({selectedChangeStatus:item['id']})}>
        <View style={eventStyles.listViewStyle}>
          <Text style={{ textAlign: 'left', fontSize: 14, color: colors.AppGray }}> {title} </Text>
          {views}
        </View>
      </TouchableOpacity>
    )
  }
  renderStatusView = () => {
    let maxHeight = '100%'
    if (this.state.showChangeView) {
      return (<View style={{flex:1}}>
        <ScrollBottomSheet
          componentType="ScrollView"
          snapPoints={['50%', "50%", maxHeight]}
          initialSnapIndex={1}
          scrollEnabled={true}
          animationType={'timing'}
          renderHandle={() => (
            <View style={eventStyles.header}>
              <View style={eventStyles.panelHandle} />
              <View style={{backgroundColor: colors.AppWhite, height: windowHeight / 2, width: '100%', marginTop: 15 }}>
                <View style={{justifyContent: 'center' }}>
                  <Text style={{fontSize: 16, fontWeight: '600', paddingLeft: 20}}>{this.state.translationDic['changeStatus'] ?? 'Change Status'}</Text>
                </View>
                <View style={{height: '40%', marginTop: 10 }}>
                  {this.renderChangeStatusView()}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, marginTop: -10 }}>
                  <TouchableOpacity style={eventStyles.bottomBtnViewStyle} onPress={() => this.changeStatusDoneBtnAction(true)}>
                    <View style={eventStyles.applyBtnViewStyle}>
                      <Text style={{color: colors.AppWhite, fontWeight:'600'}}>{appConstant.doneTitle?? 'Done'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )} topInset={false}
          contentContainerStyle={eventStyles.contentContainerStyle}
          onSettle={index => { if (index == 2) {  this.setState({showChangeView:false}) }}}
        />
      </View>)
    } else {
      return <View />
    }
  }
  renderBottomBtnView = () => {
    if (this.state.showCancelBtn) {
      return (<View style={styles.commonViewStyle}>
        <TouchableOpacity style={eventStyles.bottomBtnViewStyle} onPress={() => this.cancelBtnAction()}>
          <View style={eventStyles.clearBtnViewStyle} >
            <Text style={{ color: colors.AppTheme, fontWeight: '600' }}>{this.state.translationDic['cancelOrder'] ?? 'Cancel Order'}</Text>
          </View>
        </TouchableOpacity>
      </View>)
    } else if (this.state.showOrderStatus) {
      return (<View style={styles.commonViewStyle}>
        <TouchableOpacity style={eventStyles.bottomBtnViewStyle} onPress={() => this.setState({showChangeView: true})}>
          <View style={eventStyles.clearBtnViewStyle} >
            <Text style={{ color: colors.AppTheme, fontWeight: '600' }}>{this.state.translationDic['changeStatus'] ?? 'Change Status'}</Text>
          </View>
        </TouchableOpacity>
      </View>)
    } else {
      return <View />
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={this.state.translationDic['orderDetail'] ?? 'Orders Detail'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{height: '100%'}}>
        <View style={{height: '100%', flex:1}}>
          <View style={styles.mainViewStyle}>
            <ScrollView nestedScrollEnable={true} scrollEnabled={true}>
              <View style={styles.commonViewStyle}>
                {this.renderUserDetail()}
              </View>
              <View style={{ height: 10 }} />
              <View>
                {this.renderListDetailView()}
              </View>
              {this.renderTimeAddressDetail()}
              <View style={styles.commonViewStyle}>
                {this.renderOrderStatusView()}
              </View>
            </ScrollView>
            <View>
              {this.renderBottomBtnView()}
              <View style={{ height: 50 }} />
            </View>
          </View>
          <View style={{ zIndex: 20, backgroundColor: colors.blackTransparent, height: this.state.showChangeView ? '100%' : 0 }}>
            <this.renderStatusView />
          </View>
        </View>
        </View>
        <View>
          <View style={{ height: 40 }} />
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
  mainViewStyle: {
    height: '100%', 
    backgroundColor: colors.LightBlueColor,
    justifyContent: 'space-between',
    zIndex: 10, 
    position:'absolute',
    width: '100%'
  },
  commonViewStyle: {
    padding: 16,
    backgroundColor: colors.AppWhite,
    borderWidth: 1,
    borderColor: colors.LightUltraGray,
  },
  amountTxtStyle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.AppTheme,
    marginLeft: 5,
  },
  statusTxtStyle: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusValueTxtStyle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.Lightgray,
    textAlign: 'right'
  },
  lightGreenRoundViewStyle: {
    backgroundColor: colors.softGreen,
    height: 30,
    width: 30,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


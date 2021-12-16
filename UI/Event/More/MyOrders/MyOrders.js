import React, { Component } from 'react';
import {
  Text,
  Image,
  FlatList,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import NavigationRoots from '../../../../Constants/NavigationRoots';
import HeaderView from '../../../../Component/Header'
import colors from '../../../../CommonClasses/AppColor';
import commonStyles from '../../../../StyleSheet/UserStyleSheet';
import appConstant from '../../../../Constants/AppConstants';
import APPURL from '../../../../Constants/URLConstants';
import networkService from '../../../../NetworkManager/NetworkManager';
import eventStyles from '../../../../StyleSheet/EventStyleSheet';
import sample from '../../../../assets/dummy.png';
import timeIcon from '../../../../assets/timeIcon.png';
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
import {getTimeFormat,changeDateFormat} from '../../../../HelperClasses/SingleTon'
const windowWidth = Dimensions.get('window').width;

export default class MyOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myOrderArray: [],
      currencyArray: [],
      updateUI: false,
      isVisible:true,
      pageNo: 1,
      stopPagination: false,
      segmentIndex: 0,
    }
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.callApi();
    })
  }
  callApi() {
    this.state.myOrderArray = [];
    this.state.stopPagination = false
    this.state.pageNo = 1;
    this.getMyOrderApi();
  }
  getMyOrderApi = async () => {
    var path = `${APPURL.URLPaths.myOrders}${this.state.pageNo}`;
    if (this.props.route.params) {
      path = `${path}&account_id=${appConstant.accountID}`;
    }
    const responseJson = await networkService.networkCall(path, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let pData = responseJson['data']['orders'];
      if (pData.length != 0) {
        for(let objc of pData){
          this.state.myOrderArray.push(objc);
        }
      }else {
        this.state.stopPagination = true
      }
      this.setState({updateUI: !this.state.updateUI, isVisible: false})
    }else {
      this.setState({ isVisible: false })
    }
  }
  paginationMethod = () => {
    if (!this.state.stopPagination){
     this.state.pageNo = this.state.pageNo + 1;
     this.getMyOrderApi();
    }
   }
  /*  Buttons   */
  didSelect = (item) => {
      this.props.navigation.navigate(NavigationRoots.OrderDetail, {
        orderId: item['id'],
        account: this.props.route.params ? true : false
      });
  }
  /*  UI   */
  renderOrderListView = () => {
    if (this.state.myOrderArray.length !== 0) {
      return (<View style={{ backgroundColor: colors.lightTransparent,}}>
        <FlatList
          data={this.state.myOrderArray}
          renderItem={this.renderOrderLisCellItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index + 9287373}
          key={'E'}
          onEndReachedThreshold={2}
          onEndReached={this.paginationMethod}
        />
      </View>)
    } else {
      return (<View style={{height: '90%',justifyContent: 'center', alignItems: 'center', width: '100%'}}>
      <Text style={eventStyles.commonTxtStyle}> {!this.state.isVisible ? 'No booking found' : ''}</Text>
    </View>)
    }
    
  }
  renderOrderLisCellItem= ({item, index}) => {
    let listD = item['order_details'][0]['listing'];
    var photo = listD['images'] ? listD['images'] : [];
    let payment = item['payment_method'] ? item['payment_method']['name'] : ''
    return <TouchableOpacity style={styles.variantCellViewStyle} onPress={() => this.didSelect(item)}>
    <View style={{flexDirection: 'row', width: '80%'}}>
      <FastImage style={{ width: 60, height: 60, borderRadius: 2 }} source={photo.length == 0 ? sample : { uri: photo[0] }} />
      <View style={{flex:1}}>
        <View style={{ marginLeft: 10, flex:1}}>
          <Text style={eventStyles.titleStyle}>{listD['title']}</Text>
          <View style={{height: 5}} />
          <Text style={eventStyles.subTitleStyle} numberOfLines={2}>{listD['description']}</Text>
          <View style={{height: 5}} />
          <Text style={eventStyles.subTitleStyle} numberOfLines={1}>{payment}</Text>
        </View>
      </View>
    </View>
    <View style={{ alignContent: 'center', paddingLeft: 10,flex:1}}>
      <Text style={eventStyles.commonTxtStyle}>{item['grand_total']['formatted']}</Text>
    </View>
  </TouchableOpacity>
  }
  renderEventView = () => {
    
  }
  renderSegmentBar = () => {
    return (<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <TouchableOpacity onPress={() => this.setState({ segmentIndex: 0 })}
        style={this.state.segmentIndex == 0 ? eventStyles.selectedSegmentViewStyle : eventStyles.segmentViewStyle}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: this.state.segmentIndex == 0 ? colors.AppTheme : colors.Lightgray }}>
          Upcoming
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.setState({ segmentIndex: 1 })}
        style={this.state.segmentIndex == 1 ? eventStyles.selectedSegmentViewStyle : eventStyles.segmentViewStyle}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: this.state.segmentIndex == 1 ? colors.AppTheme : colors.Lightgray }}>
          Past
        </Text>
      </TouchableOpacity>
    </View>)
  }
  render() {
    var value = 'My Bookings';
    if (this.props.route.params) {
      let { title } = this.props.route.params;
      value = title;
    }
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={value} showBackBtn={true} backBtnAction={() => this.props.navigation.popToTop()}/>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height:'100%'}}>
        <View style={{flex:1,backgroundColor: colors.LightBlueColor }}>
          <View style={{flex:1}}>
            <this.renderOrderListView />
          </View>
          <View style={{ height: 20, backgroundColor: colors.LightBlueColor,width:'100%'}} />
        </View>
        <View style={{ height: 45, backgroundColor: colors.LightBlueColor,width:'100%'}} />
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  Container: {
    height: '100%',
    backgroundColor: colors.AppTheme
  },
  variantCellViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    borderRadius: 5,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    elevation: 10,
    backgroundColor: colors.AppWhite,
    margin: 10,
    padding: 10,
  },
});


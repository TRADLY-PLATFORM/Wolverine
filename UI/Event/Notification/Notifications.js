import React, { Component } from 'react';
import {
  Text,
  Image,
  FlatList,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import NavigationRoots from '../../../Constants/NavigationRoots';
import HeaderView from '../../../Component/Header'
import colors from '../../../CommonClasses/AppColor';
import commonStyles from '../../../StyleSheet/UserStyleSheet';
import appConstant from '../../../Constants/AppConstants';
import APPURL from '../../../Constants/URLConstants';
import networkService from '../../../NetworkManager/NetworkManager';
import eventStyles from '../../../StyleSheet/EventStyleSheet';
import sample from '../../../assets/dummy.png';
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
import {changeDateFormat} from '../../../HelperClasses/SingleTon'
import notificationEnum from '../../../Model/NotificationEnum';

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationArray: [],
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
    this.state.notificationArray = [];
    this.state.stopPagination = false
    this.state.pageNo = 1;
    this.getNotificationsApi();
  }
  getNotificationsApi = async () => {
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.activities}${this.state.pageNo}`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let pData = responseJson['data']['activities'];
      if (pData.length != 0) {
        for(let objc of pData){
          this.state.notificationArray.push(objc);
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
     this.getNotificationsApi();
    }
   }
  /*  Buttons   */
  didSelect = (item) => {
    this.props.navigation.navigate(NavigationRoots.OrderDetail,{
      orderId:item['id'],
    });
  }
  /*  UI   */
  renderNotificationsListView = () => {
    return <View style={{ backgroundColor: colors.lightTransparent, alignItems: 'center'}}>
      <FlatList
        data={this.state.notificationArray}
        renderItem={this.renderNotificationListCellItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index + 373}
        key={'N'}
        onEndReachedThreshold={2}
        onEndReached={this.paginationMethod}
      />
    </View>
  }
  renderNotificationListCellItem= ({item, index}) => {
    let type = notificationEnum.type(item['type']);
    let name = `${item['user']['first_name']} ${type}`;
    var photo = item['user']['profile_pic'].length == 0 ? item['user']['profile_pic'] : [];
    let dateFr = changeDateFormat(item['created_at']  * 1000, 'MMM DD, YYYY');
    let timeFr = changeDateFormat(item['created_at']  * 1000, 'hh:mm A');

    return <TouchableOpacity style={styles.variantCellViewStyle}>
    <View style={{flexDirection: 'row', width: '100%'}}>
      <FastImage style={styles.profileImageStyle} source={photo.length == 0 ? sample : { uri: photo }} />
      <View >
        <View style={{ marginLeft: 10, flex: 1,justifyContent: 'center'}}>
          <View style={{height: 5}} />
          <Text style={eventStyles.titleStyle}>{name}</Text>
          <View style={{height: 5}} />
          <Text style={eventStyles.subTitleStyle}>{`${dateFr} at ${timeFr}`}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
  }

  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Notifications'} showBackBtn={true} backBtnAction={() => this.props.navigation.popToTop()}/>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{height: '100%', backgroundColor: colors.LightBlueColor }}>
          <View style={{height: '94%'}}>
          <this.renderNotificationsListView />
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
  profileImageStyle: {
     width: 50,
      height: 50,
       borderRadius: 25 
  },
  variantCellViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    borderRadius: 5,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
    shadowRadius: 2,
    backgroundColor: colors.AppWhite,
    margin: 10,
    padding: 10,
  },
});


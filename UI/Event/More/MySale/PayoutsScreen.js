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
import NavigationRoots from '../../../../Constants/NavigationRoots';
import HeaderView from '../../../../Component/Header'
import colors from '../../../../CommonClasses/AppColor';
import commonStyles from '../../../../StyleSheet/UserStyleSheet';
import appConstant from '../../../../Constants/AppConstants';
import APPURL from '../../../../Constants/URLConstants';
import networkService from '../../../../NetworkManager/NetworkManager';
import eventStyles from '../../../../StyleSheet/EventStyleSheet';
import Spinner from 'react-native-loading-spinner-overlay';
import TrasnactionList from '../../../../Component/TrasnactionList';

export default class PayoutsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myTransactionsArray: [],
      updateUI: false,
      isVisible:true,
      pageNo: 1,
      stopPagination: false,
    }
  }
  componentDidMount() {
    this.callApi();
  }
  callApi() {
    this.state.myTransactionsArray = [];
    this.state.stopPagination = false
    this.state.pageNo = 1;
    this.getMyTransactionsApi();
  }
  getMyTransactionsApi = async () => {
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.transaction}${this.state.pageNo}&account_id=${appConstant.accountID}&type=9`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let pData = responseJson['data']['transactions'];
      console.log('pData',pData);
      if (pData.length != 0) {
        for(let objc of pData){
          this.state.myTransactionsArray.push(objc);
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
     this.getMyTransactionsApi();
    }
   }
  /*  Buttons   */
  didSelect = (item) => {
    this.props.navigation.navigate(NavigationRoots.OrderDetail,{
      orderId:item['id'],
    });
  }
  /*  UI   */
  renderTransactionListView = () => {
    if (this.state.myTransactionsArray != 0) {
      return <View style={{ backgroundColor: colors.lightTransparent}}>
        <FlatList
          data={this.state.myTransactionsArray}
          renderItem={this.renderTransactionListCellItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index + 9287373}
          key={'E'}
          onEndReachedThreshold={2}
          onEndReached={this.paginationMethod}
        />
      </View>
    } else {
      return (<View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '50%' }}>
        <Text style={eventStyles.titleStyle}>No Payouts found</Text>
      </View>)
    }
  }
  renderTransactionListCellItem= ({item, index}) => {
    return <View>
     <TrasnactionList data={item} />
  </View>
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Payouts'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}/>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{height: '97%', backgroundColor: colors.LightBlueColor }}>
          <this.renderTransactionListView />
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
  headerViewStyle: {
    height: 130,
    backgroundColor: colors.AppTheme,
    alignItems: 'center',
    width: '100%',
    paddingLeft: 16,
  },
  seePayoutsStyle: {
    height: 30,
    width: 120,
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colors.AppWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


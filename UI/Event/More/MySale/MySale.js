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

import LangifyKeys from '../../../../Constants/LangifyKeys';
import tradlyDb from '../../../../TradlyDB/TradlyDB';


export default class MySale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myTransactionsArray: [],
      updateUI: false,
      isVisible:true,
      pageNo: 1,
      stopPagination: false,
      earningData: {},
      translationDic:{},
    }
  }
  componentDidMount() {
    this.langifyAPI();
    this.callApi();
  }
  langifyAPI = async () => {
    let searchD = await tradlyDb.getDataFromDB(LangifyKeys.sales);
    if (searchD != undefined) {
      this.salesTranslationData(searchD);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.sales}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${appConstant.appLanguage}${group}`, 'get', '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(LangifyKeys.sales, objc)
      this.salesTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  salesTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('sales.your_balance' == obj['key']) {
        this.state.translationDic['yourBalance'] = obj['value'];
      }
      if ('sales.balance' == obj['key']) {
        this.state.translationDic['title'] = obj['value'];
      }  
      if ('sales.no_transaction_found' == obj['key']) {
        this.state.translationDic['noTransactionFound'] = obj['value'];
      }
      if ('sales.see_payouts' == obj['key']) {
        this.state.translationDic['seePayouts'] = obj['value'];
      }
      if ('sales.transactions' == obj['key']) {
        this.state.translationDic['transactions'] = obj['value'];
      }
    }
  }
  callApi() {
    this.state.myTransactionsArray = [];
    this.state.stopPagination = false
    this.state.pageNo = 1;
    this.getMyTransactionsApi();
    this.getEarningsApi();
  }
  getMyTransactionsApi = async () => {
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.transaction}${this.state.pageNo}&account_id=${appConstant.accountID}`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let pData = responseJson['data']['transactions'];
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
  getEarningsApi = async () => {
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.earning}${appConstant.accountID}`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let eData = responseJson['data']['total_sales'];
      this.state.earningData = eData;
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
  seePayoutBtnAction() {
    this.props.navigation.navigate(NavigationRoots.PayoutsScreen)
  }
  didSelect = (item) => {
    // this.props.navigation.navigate(NavigationRoots.OrderDetail,{
    //   orderId:item['id'],
    // });
  }
  /*  UI   */
  renderTransactionListView = () => {
    if (this.state.myTransactionsArray != 0) {
      return <View style={{ backgroundColor: colors.lightTransparent, flex: 1 }}>
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
      return <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '50%' }}>
        <Text style={eventStyles.titleStyle}> {this.state.translationDic['noTransactionFound'] ?? 'No Transactions found'}</Text>
      </View>
    }
  }
  renderTransactionListCellItem= ({item, index}) => {
    return <View>
     <TrasnactionList data={item} />
  </View>
  }
  render() {
    let amount = this.state.earningData['formatted'];
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={this.state.translationDic['title'] ?? 'Balance'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '100%' }}>
          <View style={styles.headerViewStyle}>
            <View style={{ height: 10 }} />
            <Text style={{ color: colors.AppWhite }}>{this.state.translationDic['yourBalance'] ?? 'Your Balance'}</Text>
            <View style={{ height: 10 }} />
            <Text style={{ color: colors.AppWhite, fontSize: 20, fontWeight: '600' }}>{amount}</Text>
            <TouchableOpacity style={styles.seePayoutsStyle} onPress={() => this.seePayoutBtnAction()}>
              <Text style={{ color: colors.AppWhite }}>{this.state.translationDic['seePayouts'] ?? 'See Payouts'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.LightBlueColor }}>
            <View style={{ margin: 16 }}>
              <Text style={eventStyles.titleStyle}>{this.state.translationDic['transactions'] ?? 'Transactions'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <this.renderTransactionListView />
            </View>
            <View style={{ height: 20, backgroundColor: colors.LightBlueColor, width: '100%' }} />
          </View>
          <View style={{ height: 45, backgroundColor: colors.LightBlueColor, width: '100%' }} />
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
    width: 150,
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colors.AppWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


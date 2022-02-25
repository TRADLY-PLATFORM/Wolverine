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
  TouchableWithoutFeedback,
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
import dropdownIcon from '../../../../assets/Triangle.png';
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
import radio from '../../../../assets/radio.png';
import selectedradio from '../../../../assets/radioChecked.png';
import LangifyKeys from '../../../../Constants/LangifyKeys';
import tradlyDb from '../../../../TradlyDB/TradlyDB';

const windowWidth = Dimensions.get('window').width;

export default class MyCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myCartArray: [],
      updateUI: false,
      isVisible:false,
      pageNo: 1,
      stopPagination: false,
      showDropDownBool:false,
      accountID: 0,
      qunatitySelectedIndex:0,
      selectedListingID: -1,
      grandTotal: 0,
      translationDic:{},
    }
  }
  componentDidMount() {
    this.langifyAPI()
    this.props.navigation.addListener('focus', () => {
      this.callApi();
    })
  }
  langifyAPI = async () => {
    let cartD = await tradlyDb.getDataFromDB(LangifyKeys.cart);
    if (cartD != undefined) {
      this.cartTranslationData(cartD);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.cart}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${appConstant.appLanguage}${group}`, 'get', '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(LangifyKeys.cart, objc)
      this.cartTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  cartTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('cart.header_title' == obj['key']) {
        this.state.translationDic['title'] = obj['value'];
      }  
      if ('cart.shipment' == obj['key']) {
        this.state.translationDic['shipping'] = obj['value'];
      } 
      if ('cart.you_pay' == obj['key']) {
        this.state.translationDic['youPay'] = obj['value'];
      }
      if ('cart.remove' == obj['key']) {
        this.state.translationDic['remove'] = obj['value'];
      }
      if ('cart.soldby' == obj['key']) {
        this.state.translationDic['soldby'] = obj['value'];
      }
      if ('cart.done' == obj['key']) {
        this.state.translationDic['done'] = obj['value'];
      }
      if ('cart.quantity' == obj['key']) {
        this.state.translationDic['quantity'] = obj['value'];
      } 
      if ('cart.your_cart_is_empty' == obj['key']) {
        this.state.translationDic['your_cart_is_empty'] = obj['value'];
      }
    }
  }

  callApi() {
    this.state.myCartArray = [];
    this.state.stopPagination = false
    this.state.pageNo = 1;
    this.getMyCartApi();
  }
  getMyCartApi = async () => {
    var path = `${APPURL.URLPaths.cart}`;
    const responseJson = await networkService.networkCall(path, 'get','',
      appConstant.bToken,appConstant.authKey,appConstant.defaultCurrencyCode)
    if (responseJson['status'] == true) {
      let pData = responseJson['data']['cart_details'];
      if (responseJson['data']['cart']){
        let gDic = responseJson['data']['cart'];
        if (gDic['grand_total']) {
          this.state.grandTotal = gDic['grand_total']['formatted'];
        }
      }
      if (pData.length != 0) {
        for(let objc of pData){
          this.state.accountID = objc['listing']['account_id'];
          this.state.myCartArray.push(objc);
        }
      }else {
        this.state.stopPagination = true
      }
      this.setState({updateUI: !this.state.updateUI, isVisible: false})
    }else {
      this.setState({ isVisible: false })
    }
  }
  addToCartAPI = async () => {
    this.setState({ isVisible: true })
    let dic = {
      'listing_id': this.state.selectedListingID,
      'quantity': this.state.qunatitySelectedIndex,
    }
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.cart}`, 'POST',
      JSON.stringify({ cart: dic }), appConstant.bToken, appConstant.authKey)
    this.setState({ isVisible: false })
    console.log('responseJson', responseJson);
    if (responseJson['status'] == true) {
      this.callApi();
    } 
  }
  deleteCartAPI = async () => {
    this.setState({ isVisible: true })
    let dic = {'listing_id':[this.state.selectedListingID], }
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.cart}`, 'PATCH',
      JSON.stringify({ cart: dic }), appConstant.bToken, appConstant.authKey)
    this.setState({ isVisible: false })
    if (responseJson['status'] == true) {
      this.callApi();
    } 
  }

  /*  Buttons   */
  didSelect = (index) => {
    let dic = this.state.myCartArray[index]['listing']
    this.state.qunatitySelectedIndex = this.state.myCartArray[index]['quantity'];
    this.state.selectedListingID = dic['id'];
    this.showDropdownBtnAction()
  }
  removeBtnAction = (index) => {
    let dic = this.state.myCartArray[index]['listing']
    this.state.selectedListingID = dic['id'];
    this.deleteCartAPI()
  }
  showDropdownBtnAction(){
      this.setState({showDropDownBool: !this.state.showDropDownBool})
  }
  doneBtnAction() {
    this.addToCartAPI()
    this.showDropdownBtnAction()
  }
  shipmenBtnAction() {
    this.props.navigation.navigate(NavigationRoots.Shipment,{
      accId: this.state.accountID,
      grandTotal: this.state.grandTotal,
    });
  }
  /*  UI   */
  renderMyCartListView = () => {
    if (this.state.myCartArray.length !== 0) {
      return (<View style={{backgroundColor: colors.lightTransparent,margin: 10, flex:1}}>
        <FlatList
          data={this.state.myCartArray}
          renderItem={this.renderMyCartLisCellItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index + 9287373}
          key={'E'}
        />
      </View>)
    } else {
      return (<View style={{height: '90%',justifyContent: 'center', alignItems: 'center', width: '100%'}}>
      <Text style={eventStyles.commonTxtStyle}> {!this.state.isVisible ? this.state.translationDic['your_cart_is_empty'] ?? 'No Cart found' : ''}</Text>
    </View>)
    }
  }
  renderMyCartLisCellItem= ({item, index}) => {
    let itemData = item['listing'];
    let title = itemData['title'] ?? '';
    let price =  itemData['list_price'] ? itemData['list_price']['formatted'] : '';
    let name = itemData['account'] ? itemData['account']['name'] : '';
    let photo = itemData['images'] ? itemData['images'] : [];
    return (<View style={eventStyles.variantCellViewStyle}>
      <View style={{ flexDirection: 'row', width: '100%', padding: 10 }}>
        <FastImage style={styles.imageStyle} source={photo.length == 0 ? sample : { uri: photo[0] }} />
        <View style={{ margin: 5, flex: 1 }}>
          <View style={{ paddingLeft: 5, width: '100%' }}>
            <Text style={eventStyles.titleStyle} numberOfLines={1}>{title}</Text>
            <View style={{ height: 10 }} />
            <Text style={styles.subTitleStyle} numberOfLines={1}>{this.state.translationDic['soldby'] ?? 'Sold by'}: {name}</Text>
          </View>
          <View style={styles.qunntityContainerStyle}>
            <TouchableOpacity style={styles.qunatityDropView} onPress={() => this.didSelect(index)}>
              <Text style={eventStyles.titleStyle}>{this.state.translationDic['quantity'] ?? 'Qty'} {item['quantity']}</Text>
              <Image style={{ margin: 5, height: 10, width: 10 }} resizeMode='center' source={dropdownIcon} />
            </TouchableOpacity>
            <Text style={eventStyles.titleStyle}>{price}</Text>
          </View>
          <View style={{ marginLeft: 5 }}>
            <View style={{height: 1, backgroundColor: colors.LightUltraGray }} />
            <TouchableOpacity style={{alignItems: 'center'}} onPress={() => this.removeBtnAction(index)}>
              <Text style={styles.removeTextStyle}>{this.state.translationDic['remove'] ?? 'Remove'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>)
  }
  renderDropdownView = () => {
    if (this.state.showDropDownBool) {
      return (<TouchableOpacity style={styles.dropViewStyle} onPress={() => this.showDropdownBtnAction()}>
        <View style={styles.qunatityListViewStyle}>
          <View style={{ height: 30 }} />
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            renderItem={this.renderQunatityItemCell}
            showsVerticalScrollIndicator={true}
            keyExtractor={(item, index) => index + 9287373}
            key={'E'}
          />
          <View style={{ padding: 10 }}>
            <TouchableOpacity style={eventStyles.bottomBtnViewStyle} onPress={() => this.doneBtnAction()}>
              <View style={eventStyles.applyBtnViewStyle}>
                <Text style={{ color: colors.AppWhite, fontWeight: '600' }}>{this.state.translationDic['done'] ?? 'Done'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>)
    } 
    return <View />
  }
  renderQunatityItemCell = ({item, index }) => {
    let check = index + 1 == this.state.qunatitySelectedIndex ? true : false
    var views = [];
    views.push(<View style={commonStyles.nextIconStyle}> 
        <Image style={{width:20,height:20,tintColor:check ? colors.AppTheme : colors.Lightgray}} source={check ? selectedradio : radio}/>
    </View>)
    return (
      <TouchableOpacity onPress={() => this.setState({qunatitySelectedIndex:index + 1})}>
        <View style={eventStyles.listViewStyle}>
          <Text style={{ textAlign: 'left', fontSize: 16, color: colors.AppGray }}> {item} </Text>
          {views}
        </View>
      </TouchableOpacity>
    )
  }
  renderBottomBtnView = () => {
    if (this.state.myCartArray.length != 0) {
    return (<View style={eventStyles.bottomContainerViewStyle}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.bottomBtnViewStyle} >
          <View style={styles.youPayViewStyle}>
            <Text style={{ color: colors.Lightgray, fontWeight: '400', fontSize: 12,marginTop:5 }}>{this.state.translationDic['youPay'] ?? 'You Pay'}</Text>
            <Text style={{ color: colors.AppTheme, fontWeight: '600', fontSize: 16 }}>{this.state.grandTotal}</Text>
            <View style={{height: 2}}/>
          </View>
        </View>
        <TouchableOpacity style={styles.bottomBtnViewStyle} onPress={() => this.shipmenBtnAction()}>
          <View style={eventStyles.applyBtnViewStyle}>
            <Text style={{ color: colors.AppWhite, fontWeight: '600' }}>{this.state.translationDic['shipping'] ?? 'Shipping'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>)
    }else {
      return <View />
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={this.state.translationDic['title'] ?? 'My Cart'} showBackBtn={true} backBtnAction={() => this.props.navigation.popToTop()}/>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{justifyContent: 'space-between',height:'100%'}}>
          <View style={{flex:1}}>
            <View style={{ flex: 1, backgroundColor: colors.LightBlueColor }}>
              <View style={{ flex: 1 }}>
                <this.renderMyCartListView />
              </View>
            </View>
            <this.renderDropdownView />
          </View>
          <View>
            {this.renderBottomBtnView()}
            <View style={{ height: 50, backgroundColor: colors.LightBlueColor,width:'100%'}} />
          </View>
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
  imageStyle:{
    width: 110,
    height: 120, 
    borderRadius: 5,
  },
  qunntityContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    width: '100%',
    padding: 5,
    marginTop: 5,
    alignItems: 'center'
  },
  qunatityDropView: {
    borderColor: colors.LightUltraGray,
    borderRadius: 5,
    borderWidth: 1,
    width: 120,
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5
  },
  subTitleStyle: {
    color: colors.Lightgray,
    fontSize: 12,
    fontWeight: '400',
  },
  removeTextStyle: {
    marginTop: 10,
    color: colors.Lightgray,
    fontSize: 14,
    fontWeight: '600',
  },
  dropViewStyle: {
    flex: 1,
    zIndex: 100,
    backgroundColor: colors.blackTransparent,
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    padding:20
  },
  qunatityListViewStyle: {
    backgroundColor: colors.AppWhite,
     height: '40%', 
     width: '100%', 
     borderRadius: 10 ,
  },
  clearViewStyle: {
    padding: 16,
    backgroundColor: colors.LightBlueColor
  },
  bottomBtnViewStyle: {
    width: '45%',
    height:50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    elevation: 20,
    borderRadius: 20, 
  },
  youPayViewStyle: {
    borderRadius: 4,
    margin: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AppWhite,
  },
});


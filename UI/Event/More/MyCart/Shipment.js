import React, { Component } from 'react';
import {
  Text,
  Dimensions,
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
import appConstant from '../../../../Constants/AppConstants';
import APPURL from '../../../../Constants/URLConstants';
import networkService from '../../../../NetworkManager/NetworkManager';
import eventStyles from '../../../../StyleSheet/EventStyleSheet';
import Spinner from 'react-native-loading-spinner-overlay';
import radio from '../../../../assets/radio.svg';
import selectedradio from '../../../../assets/radioChecked.svg';
import SvgUri from 'react-native-svg-uri';
import ShipmentModel from '../../../../Model/ShipmentModel';
import editGreen from '../../../../assets/editGreen.svg';

const windowWidth = Dimensions.get('window').width;

export default class Shipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shipmentArray: [],
      addressesArray: [],
      orderDetailData: {},
      updateUI: false,
      isVisible:true,
      showCancelBtn: false,
      selectedShipmentId: 0,
      selectedShipmentType: '',
      pickUpAddress: '',
      selectedAddressId: 0,

    }
  }
  componentDidMount() {
    this.getShipmentMethodApi()
    this.getStoreDetailApi();
    this.getDeliveryAddressApi()
  }
  getShipmentMethodApi = async () => {
    const { accId } = this.props.route.params;
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.shippingMethod}?account_id=${accId}`, 'get',
     '', appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      let shiptData = responseJson['data']['shipping_methods'];
      this.state.shipmentArray = shiptData
      this.setState({ isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  getStoreDetailApi = async () => {
    const { accId } = this.props.route.params;
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.accounts}/${accId}`, 'get', '',
       appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      let accD = responseJson['data']['account'];
      this.state.pickUpAddress = accD['location']['formatted_address'];
      this.setState({ isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  getDeliveryAddressApi = async () => {
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.addresses}?type=shipping`, 'get',
     '', appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      this.state.addressesArray = [];
      let addressData = responseJson['data']['addresses'];
      console.log('popo ==> ', JSON.stringify(addressData));
      this.state.addressesArray = addressData
      this.setState({ isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  /*  Buttons   */
  didSelectPaymentType(item) {
    if (item['type']== ShipmentModel.deliveryType && this.state.addressesArray.length != 0) {
      this.state.selectedAddressId = this.state.addressesArray[0]['id'];
    }
    this.setState({selectedShipmentId: item['id'],selectedShipmentType: item['type']})
  }
  checkoutBtnAction() {
    const { grandTotal } = this.props.route.params;
    this.props.navigation.navigate(NavigationRoots.ConfirmBooking,{
      shipmentId: this.state.selectedShipmentId,
      grandTotal:grandTotal,
    });
  }
  addAddressBtnAction() {
    this.props.navigation.navigate(NavigationRoots.AddAddress, {
      getDeliveryAddresses: this.getDeliveryAddressApi
    });
  }
  editAddressBtnAction(item) {
    this.props.navigation.navigate(NavigationRoots.AddAddress, {
      getDeliveryAddresses: this.getDeliveryAddressApi,
      id:item['id'],
      addressData:item,
      isEdit:true,
    });
  }
  /*  UI   */
  renderPaymentMethodsView = () => {
    return (<View>
      <FlatList
        data={this.state.shipmentArray}
        renderItem={this.renderPaymentCellItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index + 2121}
        key={'P'}
      />
    </View>)
  }
  renderPaymentCellItem = ({ item, index }) => {
    let check = item['id'] == this.state.selectedShipmentId;
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
  renderPickUpAddressDetail = () => {
    if (this.state.selectedShipmentType == ShipmentModel.pickUpType) {
      return (<View style={styles.commonViewStyle}>
        <View>
          <Text style={eventStyles.titleStyle}>PickUp Address</Text>
          <View style={{height: 1,marginTop: 10 ,backgroundColor: colors.LightUltraGray}}/>
          <View style={{height: 10}}/>
          <Text style={eventStyles.commonTxtStyle}>{this.state.pickUpAddress}</Text>
        </View>
      </View>)
    } else {
      return <View />
    }
  }
  renderBottomBtnView = () => {
    const { grandTotal } = this.props.route.params;
    return (<View style={eventStyles.bottomContainerViewStyle}>
       <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.bottomBtnViewStyle} >
          <View style={{alignItems: 'center'}}>
            <Text style={{ color: colors.Lightgray, fontWeight: '600', fontSize: 14 }}>You Pay</Text>
            <View style={{height: 5}}/>
            <Text style={{ color: colors.AppTheme, fontWeight: '600', fontSize: 16  }}>{grandTotal}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bottomBtnViewStyle} onPress={() => this.checkoutBtnAction()}
           disabled={this.state.selectedShipmentId == 0}>
          <View style={this.state.selectedShipmentId == 0 ? eventStyles.disableApplyBtnViewStyle : eventStyles.applyBtnViewStyle } >
            <Text style={{ color: colors.AppWhite, fontWeight: '600' }}>Checkout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>)
  }
  renderAddressView = () => {
    if (this.state.selectedShipmentType == ShipmentModel.deliveryType && this.state.addressesArray.length != 0) {
      var adAry = [];
      adAry = [... this.state.addressesArray];
      adAry.push({ addNew: true })
      return (<View style={{ marginLeft: 16 }}>
        <Text style={eventStyles.titleStyle} numberOfLines={1}>Select Pickup address</Text>
        <View style={{ height: 20 }} />
        <FlatList
          data={adAry}
          renderItem={this.renderAddressesCellItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index + 2121}
          key={'P'}
        />
      </View>)
    } else {
      return <View />
    }
  }
  renderAddressesCellItem = ({ item, index }) => {
    if (index < this.state.addressesArray.length){
      let check = item['id'] == this.state.selectedAddressId;
      return (<View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View>
          <View style={commonStyles.nextIconStyle}>
            <SvgUri width={20} height={20} source={check ? selectedradio : radio} fill={check ? colors.AppTheme : colors.Lightgray} />
          </View>
        </View>
        <View style={{ padding: 10 }}>
          <TouchableOpacity style={styles.addressCellViewStyle} onPress={() => this.setState({selectedAddressId: item['id']})}>
            <View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={eventStyles.titleStyle}>{item['name']}</Text>
                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => this.editAddressBtnAction(item)}>
                  <SvgUri width={15} height={15} source={editGreen} fill={colors.AppTheme} />
                </TouchableOpacity>
              </View>
              <View style={{ height: 10 }} />
              <Text style={eventStyles.subTitleStyle}>{item['formatted_address']}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>)
    } else {
      return (<View style={{margin: 10}}> 
        <TouchableOpacity style={styles.addAddressViewStyle} onPress={() => this.addAddressBtnAction()}> 
          <Text style={{fontSize:16, fontWeight:'600'}}>Add new address  +</Text>
        </TouchableOpacity>
      </View>)
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Shipment Option'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor, justifyContent: 'space-between' }}>
          <ScrollView nestedScrollEnable={true} scrollEnabled={true}>
            <View style={{ height: '100%', backgroundColor: colors.LightBlueColor }}>
              <View style={{ height: 10 }} />
              {this.renderPaymentMethodsView()}
              <View >
                {this.renderPickUpAddressDetail()}
              </View>
              <View>
                {this.renderAddressView()}
                </View>
            </View>
          </ScrollView>
          <View>
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
    width: '45%',
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
  addressCellViewStyle: {
    padding: 16,
    backgroundColor: colors.AppWhite,
    borderRadius: 10,
    width: windowWidth - 76,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 10,
  },
  addAddressViewStyle: {
    padding: 16,
    backgroundColor: colors.AppWhite,
    borderRadius: 10,
    width: windowWidth - 52,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 10,
  },
});


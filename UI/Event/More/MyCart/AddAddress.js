import React, { Component } from 'react';
import {
  TextInput,
  Text,
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import NavigationRoots from '../../../../Constants/NavigationRoots';
import HeaderView from '../../../../Component/Header'
import colors from '../../../../CommonClasses/AppColor';
import commonStyles from '../../../../StyleSheet/UserStyleSheet';
import Spinner from 'react-native-loading-spinner-overlay';
import APPURL from '../../../../Constants/URLConstants';
import DefaultPreference from 'react-native-default-preference';
import networkService from '../../../../NetworkManager/NetworkManager';
import appConstant from '../../../../Constants/AppConstants';
import eventStyles from '../../../../StyleSheet/EventStyleSheet';

const windowWidth = Dimensions.get('window').width;

export default class AddAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: 0,
      photo: null,
      updateUI: false,
      bToken: '',
      name: '',
      phoneNo: '',
      address1: '',
      address2: '',
      state: '',
      country: '',
      zipcode: '',
      isVisible: false,
      isEditing: false,
    }
  }
  componentDidMount() { 
    let {addressData} = this.props.route.params 
    if (addressData != undefined) {
      this.state.name = addressData['name'];
      this.state.phoneNo = addressData['phone_number'];
      this.state.address1 = addressData['address_line_1'];
      this.state.address2 = addressData['address_line_2'];
      this.state.state = addressData['state'];
      this.state.country = addressData['country'];
      this.state.zipcode = addressData['post_code'];
    }

    this.setState({ updateUI: !this.state.updateUI})
  }
  addAddressAPI = async () => {
    this.setState({ isVisible: true })
    var dic = {
      'name': this.state.name ?? '',
      'address_line_1': this.state.address1 ?? '',
      'state': this.state.state ?? '',
      'post_code': this.state.zipcode ?? '',
      'country': this.state.country ?? '',
      'type': "shipping",
    }
    if (this.state.address2.length != 0){
      dic['address_line_2'] = this.state.address2
    }
    if (this.state.phoneNo.length != 0){
      dic['phone_number'] = this.state.phoneNo
    }
    let {addressData} = this.props.route.params 
    var path = '';
    var method = 'POST'
    if (addressData != undefined) {
      path = `/${addressData['id']}`;
      method = 'PUT';
    }
    
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.addresses}` + path, method,
      JSON.stringify({ address: dic }), appConstant.bToken, appConstant.authKey);
    this.setState({ isVisible: false })
    console.log('responseJson', responseJson);
    if (responseJson['status'] == true) {
      this.props.route.params.getDeliveryAddresses();
      this.props.navigation.goBack();
    } else {
      Alert.alert(responseJson)
    }
  }
  /*  Buttons   */
  createBtnAction() {
    if (this.state.name.length == 0) {
      Alert.alert('Name field should not be empty')
    } else if (this.state.address1.length == 0) {
      Alert.alert('Address1 field should not be empty')
    } else if (this.state.state.length == 0) {
      Alert.alert('State field should not be empty')
    } else if (this.state.country.length == 0) {
      Alert.alert('Country field should not be empty')
    } else if (this.state.zipcode.length == 0) {
      Alert.alert('Zipcode field should not be empty')
    }  else {
      this.addAddressAPI()
    }
  }
  categoryBtnAction() {
   
  }
  valueBtnAction(id) {
    
  }
 
  cancelBtnAction() {
      this.props.navigation.goBack();
  }
  addressBtnAction() {
    this.props.navigation.navigate(NavigationRoots.AddressList, {
      getAddress: this.getAddress,
    });
  }
  /*  Delegates   */
  onTagChanges(data, id) {
   
  }
  getSelectedCategoryID = data => {

  }
  getAttributeSelectedValues = (data, singleSelect) => {
    
  }
  getAddress = data => {

  }

  deleteImageButtonAction() {
  }
  /*  UI   */
  imagePicker(id) {
    
  }
  renderTitleLbl = ({ title }) => {
    return (
      <View style={{margin: -5}}>
        <Text style={commonStyles.textLabelStyle}> {title == undefined ? 'Category' : title}
          <Text style={{color: colors.AppRed, paddingTop: 5}}> *</Text>
        </Text>
      </View>
    );
  }
  render() {
    let {isEdit} = this.props.route.params;
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={isEdit ? 'Update address' : 'Add new address'}
          showBackBtn={false} showDoneBtn={true}
          doneBtnTitle={'Cancel'} doneBtnAction={() => this.cancelBtnAction()}/>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ backgroundColor: colors.AppWhite, height: '100%', padding: 16 }}>
              <View style={{ height: 20 }} />
              <this.renderTitleLbl title={'Name'} />
              <TextInput 
                style={commonStyles.addTxtFieldStyle}
                placeholder={'Enter name'}
                value={this.state.name}
                onChangeText={value => this.setState({name: value})}
                />
              <View style={{ height: 20 }} />
              <Text style={commonStyles.textLabelStyle}>Phone Number</Text>
              <TextInput
                style={commonStyles.addTxtFieldStyle}
                placeholder={'Enter phone number'}
                value={this.state.phoneNo}
                onChangeText={value => this.setState({phoneNo: value})}
                />
              <View style={{ height: 20 }} />
              <this.renderTitleLbl title={'Address 1'} />
              <TextInput 
                style={commonStyles.addTxtFieldStyle}
                placeholder={'Enter address 1'}
                value={this.state.address1}
                onChangeText={value => this.setState({address1: value})}
              />
              <View style={{ height: 20 }} />
              <Text style={commonStyles.textLabelStyle}>Address 2</Text>
              <TextInput
                style={commonStyles.addTxtFieldStyle}
                placeholder={'Enter address 2'}
                value={this.state.address2}
                onChangeText={value => this.setState({address2: value})}
              />
              <View style={{ height: 20 }} />
              <this.renderTitleLbl title={'State'} />
              <TextInput 
                style={commonStyles.addTxtFieldStyle}
                placeholder={'Enter state'}
                value={this.state.state}
                onChangeText={value => this.setState({state: value})}
                />
              <View style={{ height: 20 }} />
              <this.renderTitleLbl title={'Country'} />
              <TextInput 
                style={commonStyles.addTxtFieldStyle}
                placeholder={'Enter country'}
                value={this.state.country}
                onChangeText={value => this.setState({country: value})}
              />
              <View style={{ height: 20 }} />
              <this.renderTitleLbl title={'Zip code'} />
              <TextInput 
                style={commonStyles.addTxtFieldStyle}
                placeholder={'Enter zipcode'}
                value={this.state.zipcode}
                onChangeText={value => this.setState({zipcode: value})}
              />
              <View style={{zIndex: 1}}>
                <View style={{ height: 60 }} />
                <TouchableOpacity style={commonStyles.themeBtnStyle} onPress={() => this.createBtnAction()}>
                  <Text style={commonStyles.themeTitleStyle}>{isEdit ? 'Update' : 'Add Address'}</Text>
                </TouchableOpacity>
                <View style={{ height: 20 }} />
              </View>
            </View>
          </ScrollView >
        </View>
      </SafeAreaView>
    );
  }
}
const imagePickerHeight = 200;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.AppTheme
  },
  imageSelectedStyle: {
    height: 120,
    width: 120,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteViewStyle: {
    height: 20,
    width: 20,
    marginLeft: 105,
    top: -125,
  },
  SelectedImageStyle: {
    height: 120,
    width: 120,
    borderRadius: 10,
  },
  dottedViewStyle: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    height: 120,
    width: 120,
    borderStyle: 'dashed',
    borderColor: colors.BorderColor
  },
  dropDownViewStyle: {
    width: "100%",
    backgroundColor: 'white',
    marginTop: 70,
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 5,
    borderColor: colors.BorderColor,
    marginTop: 35,
    zIndex: 90,
    borderBottomWidth: 1,
  },
  shippingViewStyle: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  squareViewStyle: {
    height: 30,
    width: 30,
    justifyContent: 'center',
  },
  tickImageStyle: {
    height: 24,
    width: 24,
  },
});

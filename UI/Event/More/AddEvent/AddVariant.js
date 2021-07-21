import React, { Component } from 'react';
import {
  Image,
  TextInput,
  Text,
  Alert,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import NavigationRoots from '../../../../Constants/NavigationRoots';
import HeaderView from '../../../../Component/Header'
import colors from '../../../../CommonClasses/AppColor';
import forwardIcon from '../../../../assets/forward.png';
import CalendarPicker from 'react-native-calendar-picker';
import eventStyles from '../../../../StyleSheet/EventStyleSheet';
import commonStyles from '../../../../StyleSheet/UserStyleSheet';
import dropdownIcon from '../../../../assets/Triangle.png';
import APPURL from '../../../../Constants/URLConstants';
import networkService from '../../../../NetworkManager/NetworkManager';
import appConstant from '../../../../Constants/AppConstants';

export default class AddVariant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateUI: false,
      variantName: 'Select Variant Type',
      variantTypeValues: 'Select Variant Type Values',
      variantTypeArray:[],
      selectedVariantType:{},
    }
  }
  componentDidMount() {
    this.setState({updateUI: !this.state.updateUI})
    this.getVariantApi();
  }
  getVariantApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.variantType}`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let vData = responseJson['data']['variant_types'];
      this.state.variantTypeArray = vData
      console.log('acctData => ',vData);
      this.setState({updateUI: !this.state.updateUI})
    }else {
      this.setState({ isVisible: false })
    }
  }
  /*  Buttons   */
  didSelect = (item) => {
    this.state.selectedCurrency = [];
    this.state.selectedCurrency.push(item);
    this.setState({ updateUI: !this.state.updateUI })
  }
  doneBtnAction() {
   
  }
  variantBtnAction() {
    this.props.navigation.navigate(NavigationRoots.VariantList,{
      variantTypeArray: this.state.variantTypeArray,
      getVariantData: this.getVariant,
    });
  }
  variantTypeValueBtnAction() {
    if (this.state.selectedVariantType['values']) {
      this.props.navigation.navigate(NavigationRoots.VariantList, {
        varriantTypeValueArray: this.state.selectedVariantType['values'],
        getVariantTypeValuesData: this.getVariantTypeValues,
        multipleSelect: true,
      });
    }
  }
  /* Delegate */
  getVariant = data => {
    this.state.selectedVariantType = data[0];
    this.setState({ updateUI: !this.state.updateUI, variantName: this.state.selectedVariantType['name'] })
  }
  getVariantTypeValues = data => {
    console.log('data', data);
    var value = data
    if (value.length != 0) {
      var nameAry = [];
      for (let o = 0; o < value.length; o++) {
        console.log('obj',value[o]);
        nameAry.push(value[o]['name'])
      }
      this.setState({ updateUI: !this.state.updateUI, variantTypeValues: nameAry.toString() })
    }
  }
  /*  UI   */
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Add Variants'}
          showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}
          showDoneBtn={true} doneBtnAction={() => this.doneBtnAction()} />
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor }}>
          <View style={styles.mainViewStyle}>
            <View>
              <Text style={commonStyles.textLabelStyle}>Variant</Text>
              <TouchableOpacity style={eventStyles.clickAbleFieldStyle} onPress={() => this.variantBtnAction()}>
                <Text style={commonStyles.txtFieldWithImageStyle}>{this.state.variantName}</Text>
                <Image style={commonStyles.backBtnStyle} resizeMode='center' source={forwardIcon} />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 20}}>
              <Text style={commonStyles.textLabelStyle}>Variant Type</Text>
              <TouchableOpacity style={eventStyles.clickAbleFieldStyle} onPress={() => this.variantTypeValueBtnAction()}>
                <Text style={commonStyles.txtFieldWithImageStyle}>{this.state.variantTypeValues}</Text>
                <Image style={commonStyles.backBtnStyle} resizeMode='center' source={forwardIcon} />
              </TouchableOpacity>
            </View>
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
  mainViewStyle: {
    backgroundColor: colors.AppWhite,
    padding: 16,
    borderColor: colors.BorderColor,
    borderWidth: 1,
  },
});


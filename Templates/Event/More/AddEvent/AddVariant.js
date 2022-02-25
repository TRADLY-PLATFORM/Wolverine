import React, { Component } from 'react';
import {
  Image,
  FlatList,
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
import eventStyles from '../../../../StyleSheet/EventStyleSheet';
import commonStyles from '../../../../StyleSheet/UserStyleSheet';
import deleteIcon from '../../../../assets/deleteIcon.png';
import APPURL from '../../../../Constants/URLConstants';
import networkService from '../../../../NetworkManager/NetworkManager';
import appConstant from '../../../../Constants/AppConstants';
import Spinner from 'react-native-loading-spinner-overlay';

import LangifyKeys from '../../../../Constants/LangifyKeys';
import tradlyDb from '../../../../TradlyDB/TradlyDB';


export default class AddVariant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateUI: false,
      variantName: 'Select Variant Type',
      variantTypeValues: '',
      variantTypeArray:[],
      selectedVariantType:{},
      selectedVariantTypeValues:{},
      disableAddBtn: true,
      selectedVariantArray:[],
      isVisible: false,
      translationDic:{},
    }
  }
  componentDidMount() {
    this.langifyAPI();
    let {selectVariantArray} = this.props.route.params;
    var  vAry = []
    for (let objc of selectVariantArray){
      if(objc['variantType']){
        vAry.push(objc['variantType'])
      }else {
        vAry.push(objc)
      }
    }
    this.state.selectedVariantArray = vAry;;
    this.setState({updateUI: !this.state.updateUI})
    this.getVariantApi();
  }
  langifyAPI = async () => {
    let searchD = await tradlyDb.getDataFromDB(LangifyKeys.addvariant);
    if (searchD != undefined) {
      this.varinatTranslationData(searchD);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.addvariant}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${appConstant.appLanguage}${group}`, 'get', '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(LangifyKeys.addvariant, objc)
      this.varinatTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  varinatTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('storedetail.variant_type' == obj['key']) {
        this.state.translationDic['variantType'] = obj['value'];
      }  
      if ('storedetail.select_variant_type' == obj['key']) {
        this.state.translationDic['selectVariantType'] = obj['value'];
      }  
      if ('storedetail.variant_type_value' == obj['key']) {
        this.state.translationDic['variantTypeValue'] = obj['value'];
      }
      if ('storedetail.select_variant_type_value' == obj['key']) {
        this.state.translationDic['selectVariantTypeValue'] = obj['value'];
      }
      if ('storedetail.add_variant' == obj['key']) {
        this.state.translationDic['title'] = obj['value'];
      }
      if ('storedetail.done' == obj['key']) {
        this.state.translationDic['done'] = obj['value'];
        appConstant.doneTitle = obj['value'];
      }
    }
  }
  getVariantApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.variantType}`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let vData = responseJson['data']['variant_types'];
      this.state.variantTypeArray = vData
      this.setState({updateUI: !this.state.updateUI,isVisible: false})
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
    // if (this.state.selectedVariantArray != 0) {
    this.props.route.params.getVariant(this.state.selectedVariantArray);
    // }
    this.props.navigation.goBack();
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
  addVariantBtnAction() {
    if (this.state.variantTypeValues.length != 0 ) {
      let dict = {
        name:this.state.selectedVariantType['name'],
        id:this.state.selectedVariantType['id'],
        values: this.state.selectedVariantTypeValues,
      }
      this.state.selectedVariantArray.push(dict);
      this.state.variantName = this.state.translationDic['variantType'] ?? 'Select Variant Type';
      this.state. variantTypeValues = '';
      this.setState({ disableAddBtn: true})
    }
  }
  deleteBtnAction(id) {
    this.state.selectedVariantArray.splice(id, 1)
    this.setState({ updateUI: !this.state.updateUI })
  }
  /* Delegate */
  getVariant = data => {
    this.state.selectedVariantType = data[0];
    let index = this.state.selectedVariantArray.findIndex(x => x['id'] == this.state.selectedVariantType['id'])
    // if (index == -1){
    this.setState({ updateUI: !this.state.updateUI, variantName: this.state.selectedVariantType['name'] })
    // } else {
    //   Alert.alert('Already Selected please choose another')
    // }
    this.setState({ disableAddBtn: true})
  }
  getVariantTypeValues = data => {
    this.state.selectedVariantTypeValues = data[0];
    var value = data
    if (value.length != 0) {
      var nameAry = [];
      var vtid = '';
      for (let o = 0; o < value.length; o++) {
        nameAry.push(value[o]['name'])
        vtid = value[o]['id'];
      }
      let index = this.state.selectedVariantArray.findIndex(x => x['values']['id'] == vtid)
      if (index == -1){
        this.setState({ updateUI: !this.state.updateUI, variantTypeValues: nameAry.toString() })
        this.setState({ disableAddBtn: false})
      } else {
        this.setState({ disableAddBtn: true})
        // Alert.alert('Already Selected please choose another')
      }
    }
  }
 
  /*  UI   */
  renderSelectedVariantListView = () => {
    if (this.state.selectedVariantArray.length != 0) {
    return (<View style={styles.mainViewStyle}>
      <FlatList
        data={this.state.selectedVariantArray}
        renderItem={this.renderListCellItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
      />
    </View>)
    } else {
      return <View />
    }
  }
  renderListCellItem = ({ item, index }) => {
    if (item['values']){
      return <View style={{ flexDirection: 'row',borderWidth: 1, borderColor: colors.BorderColor, padding: 10, justifyContent: 'space-between', margin: 5 }}>
        <View >
            <Text style={{ fontSize: 14, fontWeight: '500' }}>{item['name']}</Text>
            <View style={{height: 5}}/>
            <Text style={eventStyles.subTitleStyle}>{item['values']['name']}</Text>
        </View>
        <TouchableOpacity onPress={() => this.deleteBtnAction(index)}>
          <Image style={commonStyles.backBtnStyle} resizeMode='center' source={deleteIcon} />
        </TouchableOpacity>
      </View>
    } else {
      return <View />
    }
  }
  render() {
    let valueTitle = this.state.variantTypeValues.length == 0 ? this.state.translationDic['selectVariantTypeValue'] ?? 'Select Variant Type Values': this.state.variantTypeValues;
    return (
      <SafeAreaView style={styles.Container}>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <HeaderView title={this.state.translationDic['title'] ?? 'Add Variant'}
          showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}
          showDoneBtn={true} doneBtnAction={() => this.doneBtnAction()} doneBtnTitle={appConstant.doneTitle}/>
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor }}>
          <View style={styles.mainViewStyle}>
            <View>
              <Text style={commonStyles.textLabelStyle}>{this.state.translationDic['variantType'] ?? 'Variant Type'}</Text>
              <TouchableOpacity style={eventStyles.clickAbleFieldStyle} onPress={() => this.variantBtnAction()}>
                <Text style={commonStyles.txtFieldWithImageStyle}>{this.state.variantName}</Text>
                <Image style={commonStyles.backBtnStyle} resizeMode='center' source={forwardIcon} />
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={commonStyles.textLabelStyle}>{this.state.translationDic['variantTypeValue'] ?? 'Variant Type Value'}</Text>
              <TouchableOpacity style={eventStyles.clickAbleFieldStyle} onPress={() => this.variantTypeValueBtnAction()}>
                <Text style={commonStyles.txtFieldWithImageStyle}>{valueTitle}</Text>
                <Image style={commonStyles.backBtnStyle} resizeMode='center' source={forwardIcon} />
              </TouchableOpacity>
            </View>
            <View style={{ height: 40 }} />
            <TouchableOpacity
              disabled = {this.state.disableAddBtn}
              style={this.state.disableAddBtn ? commonStyles.disableThemeBtnStyle :commonStyles.themeBtnStyle }
              onPress={() => this.addVariantBtnAction()}>
              <Text style={commonStyles.themeTitleStyle}>{this.state.translationDic['title'] ?? 'Add Variant'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 20 }} />
          <View >
            <this.renderSelectedVariantListView />
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


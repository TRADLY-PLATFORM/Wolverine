import React, { Component } from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import NavigationRoots from '../../../../Constants/NavigationRoots';
import HeaderView from '../../../../Component/Header'
import colors from '../../../../CommonClasses/AppColor';
import commonStyles from '../../../../StyleSheet/UserStyleSheet';
import forwardIcon from '../../../../assets/forward.png';
import tickIcon from '../../../../assets/tick.png';
import emptyIcon from '../../../../assets/empty.png';


import APPURL from '../../../../Constants/URLConstants';
import networkService from '../../../../NetworkManager/NetworkManager';
import LangifyKeys from '../../../../Constants/LangifyKeys';
import tradlyDb from '../../../../TradlyDB/TradlyDB';
import AppConstants from '../../../../Constants/AppConstants';




export default class VariantList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedVariantType: [],
      variantTypeArray: [],
      updateUI: false,
      translationDic:{},
    }
  }
  componentDidMount() {
    this.langifyAPI()
    const {variantTypeArray, multipleSelect,varriantTypeValueArray} = this.props.route.params;
    if (multipleSelect) {
      console.log('varriantTypeValueArray', varriantTypeValueArray)
      this.state.variantTypeArray = varriantTypeValueArray
    }else {
      this.state.variantTypeArray = variantTypeArray

    }
    this.setState({updateUI: !this.state.updateUI})
  }
  langifyAPI = async () => {
    let searchD = await tradlyDb.getDataFromDB(LangifyKeys.variant);
    if (searchD != undefined) {
      this.variantTranslationData(searchD);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.variant}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${AppConstants.appLanguage}${group}`, 'get', '', AppConstants.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      // console.log('objc', objc)
      tradlyDb.saveDataInDB(LangifyKeys.variant, objc)
      this.variantTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  variantTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('variant.title' == obj['key']) {
        this.state.translationDic['title'] = obj['value'];
      }  
      if ('variant.done' == obj['key']) {
        this.state.translationDic['done'] = obj['value'];
      }  
    }
  }
  /*  Buttons   */

  didSelect = (item) => {
    this.state.selectedVariantType = [];
    this.state.selectedVariantType.push(item);
    this.setState({ updateUI: !this.state.updateUI })
  }
  doneBtnAction () {
    const {multipleSelect} = this.props.route.params;
    if (multipleSelect) {
      this.props.route.params.getVariantTypeValuesData(this.state.selectedVariantType);
    }else {
      this.props.route.params.getVariantData(this.state.selectedVariantType);
    }
    this.props.navigation.goBack();
  }
  /*  UI   */
  renderListView = () => {
    let atAry = this.state.variantTypeArray;
    var views = [];
    for (let a = 0; a < atAry.length; a++) {
      let item = atAry[a];
      let obj = this.state.selectedVariantType.findIndex(x => x.id === item['id'])
      let check = obj == -1 ? true : false
      views.push(
        <TouchableOpacity onPress={() => this.didSelect(item)}>
          <View style={styles.listViewStyle}>
            <Text style={{ textAlign: 'left', fontSize: 16, color: colors.AppGray }}> {item['name']} </Text>
            <Image style={commonStyles.nextIconStyle} source={check ? emptyIcon : tickIcon} />
          </View>
        </TouchableOpacity>
      );
    }
    return views;
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={this.state.translationDic['Variants'] ?? 'Variants'}
          showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}
          showDoneBtn={true} doneBtnAction={() => this.doneBtnAction()} doneBtnTitle={this.state.translationDic['done']?? 'Done'}/>
        <View style={{height: '100%', backgroundColor: colors.AppWhite }}>
          <this.renderListView />
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
  listViewStyle: {
    justifyContent: 'space-between',
    width: "97%",
    margin: 5,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderColor: colors.BorderColor,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
});


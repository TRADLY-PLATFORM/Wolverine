import React, { Component } from 'react';
import {
  FlatList,
  TextInput,
  Text,
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import HeaderView from '../../../Component/Header'
import colors from '../../../CommonClasses/AppColor';
import commonStyles from '../../../StyleSheet/UserStyleSheet';
import tickIcon from '../../../assets/tick.png';
import emptyIcon from '../../../assets/empty.png';
import APPURL from '../../../Constants/URLConstants';
import networkService from '../../../NetworkManager/NetworkManager';
import appConstant from '../../../Constants/AppConstants';

import LangifyKeys from '../../../Constants/LangifyKeys';
import tradlyDb from '../../../TradlyDB/TradlyDB';


const windowWidth = Dimensions.get('window').width;

export default class AttributeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: [],
      attributeArray: [],
      updateUI: false,
      translationDic:{},
    }
  }

  componentDidMount() {
    this.langifyAPI();
    const {attributeArray} = this.props.route.params;
    this.state.attributeArray = attributeArray
    this.setState({updateUI: !this.state.updateUI})
  }
  langifyAPI = async () => {
    let addStoreD = await tradlyDb.getDataFromDB(LangifyKeys.filter);
    if (addStoreD != undefined) {
      this.attributeTranslationData(addStoreD);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.filter}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}en${group}`, 'get', '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(LangifyKeys.filter, objc)
      this.attributeTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  attributeTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('filter.attributes' == obj['key']) {
        this.state.translationDic['title'] =  obj['value'];
      }
    }
  }
  /*  Buttons   */
  didSelect = (item, itemData) => {
    const {singleSelect} = this.props.route.params;
    if (singleSelect) {
      this.state.selectedAttributes = [];
      this.state.selectedAttributes.push(item);
    } else  {
      let obj = this.state.selectedAttributes.findIndex(x => x.id === item['id'])
      if (obj != -1) {
        this.state.selectedAttributes.splice(obj, 1);
      }else {
        this.state.selectedAttributes.push(item);
      }
    }
    this.setState({updateUI: !this.state.updateUI})
  }
  doneBtnAction () {
    const {singleSelect,valueId} = this.props.route.params;
    var valueDic = {};
    valueDic['valueId'] = valueId;
    valueDic['data'] = this.state.selectedAttributes;
    this.props.route.params.getAtriValue([valueDic],singleSelect);
    this.props.navigation.goBack();
  }
  /*  UI   */
  renderListView = () => {
    let atAry = this.state.attributeArray;
    var views = [];
    for (let a = 0; a < atAry.length; a++) {
      let item = atAry[a];
      let obj = this.state.selectedAttributes.findIndex(x => x.id === item['id'])
      let check = obj == -1 ? true : false
      views.push(
        <TouchableOpacity onPress={() => this.didSelect(item, a)}>
          <View style={styles.listViewStyle}>
            <Text style={{textAlign: 'left', fontSize: 16, color: colors.AppGray, width: '85%'}}>
              {item['name']}
            </Text>
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
        <HeaderView title={this.state.translationDic['title'] ?? 'Attributes'}
          doneBtnTitle={appConstant.doneTitle}
          showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}
          showDoneBtn={true} doneBtnAction={() => this.doneBtnAction()}/>
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
    // height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    padding:5,
    paddingRight: 10,

  },
});


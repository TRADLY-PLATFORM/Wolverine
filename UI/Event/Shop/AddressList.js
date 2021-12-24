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
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import HeaderView from '../../../Component/Header'
import colors from '../../../CommonClasses/AppColor';
import SearchBar from 'react-native-search-bar';
import 'react-native-gesture-handler';
import APPURL from '../../../Constants/URLConstants';
import networkService from '../../../NetworkManager/NetworkManager';
import appConstant from '../../../Constants/AppConstants';

import LangifyKeys from '../../../Constants/LangifyKeys';
import tradlyDb from '../../../TradlyDB/TradlyDB';

const windowWidth = Dimensions.get('window').width;

export default class AddressList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddress: {},
      searchArray: [],
      updateUI: false,
      isVisible: false,
      searchKey: '',
      typingTimeout: 0,
      translationDic:{},
    }
  }

  componentDidMount() {
    this.refs.searchBar.focus()
    this.langifyAPI()
  }
  langifyAPI = async () => {
    let addStoreD = await tradlyDb.getDataFromDB(LangifyKeys.address);
    if (addStoreD != undefined) {
      this.addressTranslationData(addStoreD);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.address}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}en${group}`, 'get', '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(LangifyKeys.address, objc)
      this.addressTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  addressTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('addstore.address' == obj['key']) {
        this.state.translationDic['address'] =  obj['value'];
      }
      if ('address.search_address' == obj['key']) {
        this.state.translationDic['search'] =  obj['value'];
      }
    }
  }
  searchApi = async (text) => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(APPURL.URLPaths.searchAddress + text, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let sData = responseJson['data']['addresses'];
      this.state.searchArray = sData
      this.setState({ updateUI: !this.state.updateUI,isVisible: false })
    }else {
      this.setState({isVisible: false })
    }
  }
  onSearchChanges = (text) => {
    this.setState({searchKey: text})
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
   }
   this.setState({
      typingTimeout: setTimeout(function () {
        this.searchApi(this.state.searchKey);
      }.bind(this), 1000)
    })
  }
  /*  Buttons   */
  didSelect = (item) => {
    this.props.route.params.getAddress(item);
    this.props.navigation.goBack();
  }
  doneBtnAction () {
    const {singleSelect} = this.props.route.params;
    this.props.route.params.getAtriValue(this.state.selectedAttributes,singleSelect);
    this.props.navigation.goBack();
  }
  /*  UI   */
  renderListView = () => {
    let atAry = this.state.searchArray;
    var views = [];
    for (let a = 0; a < atAry.length; a++) {
      let item = atAry[a];
      views.push(
        <TouchableOpacity onPress={() => this.didSelect(item)}>
          <View style={styles.listViewStyle}>
            <Text style={{ textAlign: 'left', fontSize: 16, color: colors.AppGray, padding: 10 }}>
              {item['formatted_address']}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    return views;
  }
  renderActivityLoader = () => {
    if (this.state.isVisible) {
    return <View style={{marginTop: 10}}>
      <ActivityIndicator size="small" />
    </View>
    }else {
      return <View />
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={this.state.translationDic['address'] ?? 'Address'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} />
        <View style={{ height: '100%', backgroundColor: colors.AppWhite }}>
          <View style={{ backgroundColor: colors.AppTheme, height: 55 }} >
            <SearchBar
              ref="searchBar"
              barTintColor={colors.AppWhite}
              searchBarStyle={'minimal'}
              tintColor={colors.AppWhite}
              placeholderTextColor={colors.AppWhite}
              placeholder={this.state.translationDic['search'] ?? 'Search'}
              textFieldBackgroundColor={colors.GradientBottom}
              style={{ borderColor: colors.Lightgray, height: 50 }}
              textColor={colors.AppWhite}
              onChangeText={text => this.onSearchChanges(text)}
              tintColor={colors.AppWhite}
            />
          </View>
          <this.renderActivityLoader />
          <ScrollView>
            <this.renderListView />
          </ScrollView>
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
  searchViewStyle: {
    backgroundColor: colors.AppTheme,
    height: 50,
  },
  listViewStyle: {
    justifyContent: 'space-between',
    width: "97%",
    margin: 5,
    marginLeft: 10,
    borderBottomWidth: 1,
    borderColor: colors.BorderColor,
    flexDirection: 'row',
    alignItems: 'center',
  },
});


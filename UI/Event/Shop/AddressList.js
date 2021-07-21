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
import SearchBar from 'react-native-search-bar';
import 'react-native-gesture-handler';
import APPURL from '../../../Constants/URLConstants';
import networkService from '../../../NetworkManager/NetworkManager';
import appConstant from '../../../Constants/AppConstants';

const windowWidth = Dimensions.get('window').width;

export default class AddressList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddress: {},
      searchArray: [],
      updateUI: false,
      isVisible: false,
    }
  }

  componentDidMount() {
    this.refs.searchBar.focus()
  }
  searchApi = async (text) => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(APPURL.URLPaths.searchAddress + text, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let sData = responseJson['data']['addresses'];
      this.state.searchArray = sData
      this.setState({ updateUI: !this.state.updateUI,isVisible: false })
    }
  }
  onSearchChanges(text) {
    this.searchApi(text);
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
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Address'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} />
        <View style={{ height: '100%', backgroundColor: colors.AppWhite }}>
          <View style={{ backgroundColor: colors.AppTheme, height: 55 }} >
            <SearchBar
              ref="searchBar"
              barTintColor={colors.AppWhite}
              searchBarStyle={'minimal'}
              tintColor={colors.AppWhite}
              textFieldBackgroundColor={colors.AppGreen}
              style={{ borderColor: colors.Lightgray, height: 50 }}
              textColor={colors.AppWhite}
              onChangeText={text => this.onSearchChanges(text)}
              tintColor={colors.AppWhite}
            />
          </View>
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


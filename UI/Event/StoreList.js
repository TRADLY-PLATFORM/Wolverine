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
import NavigationRoots from '../../Constants/NavigationRoots';
import HeaderView from '../../Component/Header'
import colors from '../../CommonClasses/AppColor';
import commonStyles from '../../StyleSheet/UserStyleSheet';
import eventStyles from '../../StyleSheet/EventStyleSheet';
import APPURL from '../../Constants/URLConstants';
import networkService from '../../NetworkManager/NetworkManager';
import appConstant from '../../Constants/AppConstants';
import Spinner from 'react-native-loading-spinner-overlay';
import ExploreListItem from '../../Component/ExploreListItem'
import constantArrays from '../../Constants/ConstantArrays';
import StoreListItem from '../../Component/StoreListItem';

const windowHeight = Dimensions.get('window').height;


export default class StoreList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateUI: false,
      showSortView: false,
      showDropDown: false,
      categoryID: -1,
      showMap:false,
      storesArray:[],
      pageNo: 1,
      stopPagination: false,
      sortSelectedIndex :-1,
      params: '',
      selectedDateIndex: 0,
      datesArray: [],
      selectedDate:'',
    }
  }
  componentDidMount() {
    this.initApi()
  }
  initApi() {
    this.callApi();
  }
  callApi() {
    this.state.storesArray = [];
    this.state.stopPagination = false
    this.state.pageNo = 1;
    this.getAccountsApi();
  }
  getAccountsApi = async (param) => {
    this.setState({ isVisible: true })
    var path = appConstant.accountID;
    path = `${this.state.pageNo}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.followers}${path}`,'get', '', appConstant.bToken, appConstant.authKey)
      console.log('responseJson', responseJson)
    if (responseJson['status'] == true) {
      let stores = responseJson['data']['accounts'];
      if (stores.length != 0) {
        for(let objc of stores){
          this.state.storesArray.push(objc);
        }
      }else {
        this.state.stopPagination = true
      }
      this.setState({ updateUI: !this.state.updateUI, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  /*  Buttons   */
  didSelectEventList(item) {
    this.props.navigation.navigate(NavigationRoots.MyStore, {
      accId: item['id'],
    });
  }
  
  paginationMethod = () => {
    if (!this.state.stopPagination) {
      this.state.pageNo = this.state.pageNo + 1;
      this.getAccountsApi(this.state.params);
    }
  }

  /*  UI   */
 
  renderListView = () => {
    let {title} = this.props.route.params;

    if (this.state.storesArray.length != 0) {
      return (<View style={{ margin: 5, height: '100%' }}>
        <FlatList
          data={this.state.storesArray}
          numColumns={1}
          initialNumToRender={7}
          renderItem={this.renderListCellItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index + 3245}
          key={'L'}
          onEndReachedThreshold={0}
          onEndReached={this.paginationMethod}
        />
      </View>)
    } else {
      return <View style={{height: '100%',justifyContent: 'center', alignItems: 'center', backgroundColor: colors.LightBlueColor, width: '100%'}}>
        <Text style={eventStyles.commonTxtStyle}>{title}</Text>
      </View>
    }
  }
  renderListCellItem = ({ item, index }) => {
    return (<TouchableOpacity onPress={() => this.didSelectEventList(item)}>
      <StoreListItem data={item} />
    </TouchableOpacity>)
  } 
  render() {
    let {title} = this.props.route.params;
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={title} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: windowHeight, backgroundColor: colors.LightBlueColor }}>
            <View style={{zIndex: 5, height: '82%'}}>
            {this.renderListView()}
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
});

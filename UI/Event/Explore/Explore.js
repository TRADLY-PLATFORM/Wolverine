import React, { Component } from 'react';
import {
  FlatList,
  StatusBar,
  Text,
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import NavigationRoots from '../../../Constants/NavigationRoots';
import HeaderView from '../../../Component/Header'
import colors from '../../../CommonClasses/AppColor';
import commonStyles from '../../../StyleSheet/UserStyleSheet';
import eventStyles from '../../../StyleSheet/EventStyleSheet';
import filterGrayIcon from '../../../assets/filterGrayIcon.png';
import sortIcon from '../../../assets/sortIcon.png';
import viewMapIcon from '../../../assets/viewMap.svg';
import APPURL from '../../../Constants/URLConstants';

import networkService from '../../../NetworkManager/NetworkManager';
import appConstant from '../../../Constants/AppConstants';
import Spinner from 'react-native-loading-spinner-overlay';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import radio from '../../../assets/radio.svg';
import selectedradio from '../../../assets/radioChecked.svg';
import searchSvg from '../../../assets/searchSvg.svg';

import {changeDateFormat,getDatesArray,getNextDate} from '../../../HelperClasses/SingleTon'
import ExploreListItem from '../../../Component/ExploreListItem'
import SearchBar from 'react-native-search-bar';
import SvgUri from 'react-native-svg-uri';

import constantArrays from '../../../Constants/ConstantArrays';
import LocationPermission from '../../../HelperClasses/LocationPermission';
const windowHeight = Dimensions.get('window').height;

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
const GOOGLE_MAPS_APIKEY = 'AIzaSyBAV63gkOE0d0eSV_3rIagJfzMwDcbzPnM';
const windowWidth = Dimensions.get('window').width;


export default class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: 0,
      photo: null,
      updateUI: false,
      showSortView: false,
      showDropDown: false,
      categoryID: -1,
      categoryName: 'Select Category',
      showMap:false,
      eventsArray:[],
      pageNo: 1,
      stopPagination: false,
      sortSelectedIndex :-1,
      params: '',
      selectedDateIndex: 0,
      datesArray: [],
      selectedDate:'',
      filtersArray: [],
      isVisible: false,
      dataLoad: false,
      showSearchBar: true,
      searchKey:'',
      typingTimeout: 0
    }
  }
  componentDidMount() {
    // this.refs.searchBar.focus()
    this.state.datesArray = getDatesArray();
    // this.props.navigation.addListener('focus', () => {
      appConstant.hideTabbar = true
      let lp = new LocationPermission();
      lp._requestLocation();
      this.setState({showSearchBar: false})
      this.initApi()
    // });
  }
  componentWillUnmount() {
    this.state.dataLoad = true
  }
  initApi() {
    if (this.state.datesArray.length != 0){
      this.state.selectedDate = changeDateFormat(this.state.datesArray[0], 'YYYY-MM-DD');
      let strtD = ''//`&start_at=${this.state.selectedDate}T00:00:00Z`;
      this.state.params = `${strtD}`;
    }
    this.callApi(this.state.params);
  }
  callApi(param) {
    this.setState({ dataLoad: false })
    this.state.eventsArray = [];
    this.state.stopPagination = false
    this.state.pageNo = 1;
    this.getEventsApi(param);
  }
  getEventsApi = async (param) => {
    this.setState({ isVisible: true })
    var path = '&per_page=30&type=events&';
    if (appConstant.lat.length != 0) {
      path = path + `latitude=${appConstant.lat}&longitude=${appConstant.long}` + param;
    }
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.listings}?page=${this.state.pageNo}${path}`,
      'get', '', appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      let events = responseJson['data']['listings'];
      if (events.length != 0) {
        for(let objc of events){
          this.state.eventsArray.push(objc);
        }
      }else {
        this.state.stopPagination = true
      }
      this.setState({ updateUI: !this.state.updateUI, isVisible: false,dataLoad: true })
    } else {
      this.setState({ isVisible: false,dataLoad: true  })
    }
  }
  _handleRefresh = () => {
    this.setState({ isVisible: true })
    this.callApi(this.state.params);
  }
  onSearchChanges = () => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
   }
   this.setState({
      typingTimeout: setTimeout(function () {
        if (this.state.searchKey.length != 0) {
          this.state.params = `&search_key=${this.state.searchKey}`;
          this.setState({ isVisible: true })
          this.callApi(this.state.params);
        }
        this.refs.searchBar.unFocus()
        this.setState({showSearchBar: false })
      }.bind(this), 10)
    })
  }
  
  /*  Buttons   */
  openSearchBarAction =  () => {
    this.setState({showSearchBar: true, showMap: false })
    setTimeout(function () {
      this.refs.searchBar.focus()
    }.bind(this), 100)
  }
  didSelectEventList(item, index) {
    this.props.navigation.navigate(NavigationRoots.EventDetail, {
      id :item['id'],
    });
  }
  filterBtnAction() {
    this.props.navigation.navigate(NavigationRoots.Filter, {
      filtersArray :this.state.filtersArray,
      getFilterData :this.getFilterData,
    });
  }
  sortBtnAction(done) {
    appConstant.hideTabbar = this.state.showSortView
    this.props.navigation.setParams({tabBarVisible: false});
    this.setState({showSortView: !this.state.showSortView})
    if (done){
      if (this.state.sortSelectedIndex != -1) {
        let sortKey  = ['nearest_distance','price_low_to_high','price_high_to_low'];
        this.state.params = `${this.state.params}&sort=${sortKey[this.state.sortSelectedIndex]}`
      }
      this.callApi(this.state.params);
    }
  }
  didSelectDate(index) {
    this.state.selectedDateIndex = index
    if (index != 0) {
      this.state.selectedDate = changeDateFormat(this.state.datesArray[index - 1], 'YYYY-MM-DD');
      let nxtDate = getNextDate(this.state.datesArray[index])
      let nxt = changeDateFormat(nxtDate, 'YYYY-MM-DD')
      this.setState({ updateUI: !this.state.updateUI })
      let strtD = `${this.state.selectedDate}T00:00:00Z`;
      let endD = `${nxt}T00:00:00Z`;
      this.state.params = `&start_at=${strtD}&end_at=${endD}`;
      this.callApi(this.state.params);
    } else {
      this.initApi()
    }
  }

  paginationMethod = () => {
    if (!this.state.stopPagination) {
      this.state.pageNo = this.state.pageNo + 1;
      this.getEventsApi(this.state.params);
    }
  }
  /*  Delegate   */
  getFilterData = data => {
    var queryParams = '';
    for (let objc of data) {
      if (objc['time']) {
        let timeD = objc['time'];
        let strtD = `${this.state.selectedDate}T${this.convert12HoursFormat(timeD['start'])}Z`
        let endD = `${this.state.selectedDate}T${this.convert12HoursFormat(timeD['end'])}Z`;
        queryParams = `&start_at=${strtD}&end_at=${endD}`;
      }
      if (objc['date']) {
        let dData = objc['date'];
        let cf = changeDateFormat(dData['created_from'], 'YYYY-MM-DDThh:mm:ss')
        let ct = changeDateFormat(dData['created_to'], 'YYYY-MM-DDThh:mm:ss')
        queryParams = queryParams + `&created_from=${cf}Z&created_to=${ct}Z`;
      } 
      if (objc['rating']) {
        var strtD = '';
        if (!queryParams.includes('start_at')) {
           strtD = `&start_at=${this.state.selectedDate}T00:00:00Z`;
        }  
        let rObjc = objc['rating']
        queryParams = queryParams + `&rating=${rObjc['rating']}` + strtD;
      }
      if (objc['distance']) {
        var strtD = '';
        if (!queryParams.includes('start_at')) {
           strtD = `&start_at=${this.state.selectedDate}T00:00:00Z`;
        }
        let dObjc = objc['distance']
        queryParams = queryParams + `&max_distance=${dObjc['distance']}` + strtD;
      }
      if (objc['category']) {
        var strtD = '';
        if (!queryParams.includes('start_at')) {
           strtD = `&start_at=${this.state.selectedDate}T00:00:00Z`;
        }
        let dObjc = objc['category']
        queryParams = queryParams + `&category_id=${dObjc['id']}` + strtD;
      }
      if (objc['price']) {
        var strtD = '';
        if (!queryParams.includes('start_at')) {
           strtD = `&start_at=${this.state.selectedDate}T00:00:00Z`;
        }   
        let dObjc = objc['price']
        queryParams = queryParams + `&price_from=${dObjc['from']}&price_to=${dObjc['to']}` + strtD;
      }
      if (objc['attribute']) {
        let nObj = objc['attribute']
        let dObjc = nObj['values'];
        var strtD = '';
        if (!queryParams.includes('start_at')) {
           strtD = `&start_at=${this.state.selectedDate}T00:00:00Z`;
        }
        if (dObjc.length != 0) {
          queryParams = queryParams + `&attribute_value_id=${dObjc.join(',')}` + strtD;
        }
      }
    }
    this.state.filtersArray = data
    this.state.params = queryParams;
    if (this.state.filtersArray == 0) {
      this.initApi()
    } else {
      this.callApi(this.state.params)
    }
  }
  convert12HoursFormat(time) {
    var timeString = `${time.length == 1 ? `0${time}`:time}:00:00`;
    return timeString
  }
  /*  UI   */
  renderSortItemCell = ({item, index }) => {
    let check = index == this.state.sortSelectedIndex ? true : false
    var views = [];
    views.push(<View style={commonStyles.nextIconStyle}> 
        <SvgUri width={20} height={20} source={check ? selectedradio : radio} fill={check ? colors.AppTheme : colors.Lightgray} />
    </View>)
    return (
      <TouchableOpacity onPress={() => this.setState({sortSelectedIndex:index})}>
        <View style={eventStyles.listViewStyle}>
          <Text style={{ textAlign: 'left', fontSize: 16, color: colors.AppGray }}> {item} </Text>
          {views}
        </View>
      </TouchableOpacity>
    )
  }
  renderSortListView = () => {
    return (<View >
      <FlatList
        data={constantArrays.sortingArray}
        numColumns={1}
        renderItem={this.renderSortItemCell}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
      />
    </View>)
  }
  renderSortView = () => {
    let maxHeight = '100%'
    if (this.state.showSortView) {
      return (<View>
        <ScrollBottomSheet
          componentType="ScrollView"
          snapPoints={['50%', "50%", maxHeight]}
          initialSnapIndex={1}
          scrollEnabled={true}
          animationType={'timing'}
          renderHandle={() => (
            <View style={eventStyles.header}>
              <View style={eventStyles.panelHandle} />
              <View style={{backgroundColor: colors.AppWhite, height: windowHeight / 2, width: '100%', marginTop: 15 }}>
                <View style={{justifyContent: 'center' }}>
                  <Text style={{fontSize: 16, fontWeight: '600', paddingLeft: 20}}>Sort</Text>
                </View>
                <View style={{height: '40%', marginTop: 10 }}>
                  {this.renderSortListView()}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, marginTop: -10 }}>
                  <TouchableOpacity style={eventStyles.bottomBtnViewStyle} onPress={() => this.sortBtnAction(true)}>
                    <View style={eventStyles.applyBtnViewStyle}>
                      <Text style={{color: colors.AppWhite, fontWeight: '600'}}>Done</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )} topInset={false}
          contentContainerStyle={eventStyles.contentContainerStyle}
          onSettle={index => { if (index == 2) {  this.sortBtnAction() }}}
        />
      </View>)
    } else {
      return <View />
    }
  }
  renderDateListView = () => {
    return (<View style={{ margin: 5, height: 35 }}>
      <FlatList
        data={this.state.datesArray}
        numColumns={1}
        renderItem={this.renderDateListViewCellItem}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index}
        horizontal={true}

      />
    </View>)
  }
  renderDateListViewCellItem = ({item, index}) => {
    var dt = index == 1 ? 'Today' : changeDateFormat(this.state.datesArray[index - 1], 'ddd D')
    if (index == 0) {
      dt = "All";
    }
    if (this.state.selectedDateIndex == index) {
      return(<View style={{margin: 5,marginLeft: 10, borderRadius: 15}}>
        <TouchableOpacity style={eventStyles.selectedBntViewStyle} onPress={() => this.didSelectDate(index)}>
          <Text style={eventStyles.selectedBtnTxtStyle}>{dt}</Text>
        </TouchableOpacity>
      </View>
      )
    }else {
      return (<View style={{margin: 5,marginLeft: 10,  borderRadius: 15}}>
        <TouchableOpacity style={eventStyles.addBntViewStyle} onPress={() => this.didSelectDate(index)}>
          <Text style={eventStyles.btnTxtStyle}>{dt}</Text>
        </TouchableOpacity>
      </View>
      )
    }
  }
  renderViewMaBtnView = () => {
    return (<View style={{position: 'relative',flexDirection: 'row-reverse', padding: 10, marginTop:this.state.showMap ? -20 : -80, zIndex: 100}}>
      <TouchableOpacity style={eventStyles.viewOnMapBtnStyle} onPress={() => this.setState({ showMap: !this.state.showMap })}>
        <SvgUri width={20} height={20} source={viewMapIcon} fill={colors.AppTheme} />
        <View style={{ width: 5 }} />
        <Text style={{ fontWeight: '500', fontSize: 14, color: colors.AppTheme }}>{this.state.showMap ? 'View List' : 'View Map'}</Text>
      </TouchableOpacity>
  </View>)
  }
   renderMarker = () => {
     var markerView = [];
    for (let objc of this.state.eventsArray) {
      let coordinate = objc['coordinates'];
      if (coordinate != undefined) {
        markerView.push(<Marker
          coordinate={coordinate}
          image={require('../../../assets/mapPin.png')}
          title={objc['title']}
        />);
      }
    }
    return markerView;
   }
   renderListView = () => {
    if (this.state.eventsArray.length != 0) {
      return (<View style={{ margin: 5, height: '100%' }}>
        <FlatList
          data={this.state.eventsArray}
          renderItem={this.renderListCellItem}
          keyExtractor={(item, index) => index + 3245}
          key={'L'}
          horizontal={this.state.showMap ? true : false}
          onEndReachedThreshold={0}
          onEndReached={this.paginationMethod}
          onRefresh={this._handleRefresh}
          refreshing={this.state.isVisible}
        />
      </View>)
    } else {
      return <View style={{height: '90%',justifyContent: 'center', alignItems: 'center', width: windowWidth}}>
        <Text style={eventStyles.commonTxtStyle}> {this.state.dataLoad ? 'No events have been posted yet' : ''}</Text>
      </View>
    }
  }
  renderListCellItem = ({ item, index }) => {
    return (<TouchableOpacity onPress={() => this.didSelectEventList(item, index)}>
      <ExploreListItem data={item} />
    </TouchableOpacity>)
  }
  renderHeaderView = () => {
    return (<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <TouchableOpacity style={eventStyles.headerViewStyle} onPress={() => this.sortBtnAction()}>
        <Image style={commonStyles.backBtnStyle} resizeMode={'contain'} source={sortIcon} />
        <Text style={{ color: colors.AppGray, marginLeft: 10 }}>Sort</Text>
      </TouchableOpacity>
      <TouchableOpacity style={eventStyles.headerViewStyle} onPress={() => this.filterBtnAction()}>
        <Image style={commonStyles.backBtnStyle} resizeMode={'contain'} source={filterGrayIcon} />
        <Text style={{ color: colors.AppGray, marginLeft: 10 }}>Filters</Text>
      </TouchableOpacity>
    </View>)
  }
  renderMainView = () => {
    return (<View style={{ flex: 1 }}>
      {this.renderHeaderView()}
      {this.renderDateListView()}
      <View style={{ flex: 1 }}>
        {this.renderListView()}
        {this.renderViewMaBtnView()}
      </View>
      <View style={{ height: 0, width: '100%' }} />
    </View>)
  }
  renderSearchBar = () => {
    if (this.state.showSearchBar) {
      return (<View style={{ backgroundColor: colors.AppTheme, height: 60}} >
        <SearchBar
          ref="searchBar"
          barTintColor={colors.AppWhite}
          searchBarStyle={'minimal'}
          tintColor={colors.AppWhite}
          placeholderTextColor={colors.AppWhite}
          textFieldBackgroundColor={colors.AppWhite}
          style={{ borderColor: colors.AppWhite, height: 60 }}
          textColor={colors.AppBlack}
          onChangeText={text =>     this.setState({searchKey: text})        }
          tintColor={colors.AppWhite}
          onCancelButtonPress={() => this.setState({showSearchBar: false})}
          onSearchButtonPress={() => this.onSearchChanges()}
        />
      </View>)
    } else {
      return <HeaderView title={'Search'} showDoneBtn={true} doneBtnTitle={'Search'} doneBtnAction={() => this.openSearchBarAction()} />
    }
  }

  render() {
    if (this.state.showMap) {
      return (<View style={{ flex:1 }}>
        <View style={{flex: 1, zIndex:10, height: windowHeight}}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={eventStyles.mapStyle}
            initialRegion={{
              latitude: appConstant.lat,
              longitude: appConstant.long,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          >
            {this.renderMarker()}
          </MapView>
        </View>
        <TouchableOpacity style={styles.searchBtnStyle} onPress={() => this.openSearchBarAction()}> 
          <Text>Search..</Text>
          <View>
            <SvgUri width={25} height={25} source={searchSvg} fill={colors.AppGray} />
          </View>
        </TouchableOpacity>
        <View style={{height: 180, zIndex: 12,position: 'absolute', marginTop: windowHeight - 280}}>
          {this.renderViewMaBtnView()}
          {this.renderListView()}
        </View>
      </View>)
    }
    return (
      <SafeAreaView style={styles.Container}>
        {this.renderSearchBar()}
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ backgroundColor: colors.LightBlueColor, flex: 1 }}>
          <View style={{ zIndex: 5, position: 'absolute', height: '100%'}}>
            <this.renderMainView />
          </View>
          <View style={{ zIndex: 20, backgroundColor: colors.blackTransparent, height: this.state.showSortView ? '100%' : 0 }}>
            <this.renderSortView />
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
  headerViewStyle: {
    width: '50%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.BorderColor,
  },
  containerMapStyle: {
    margin:0,
    height: "100%",
    width: "100%",
  },
  mapStyle: {
    position: 'absolute',
    marginTop: 0,
    height: "100%",
    ...StyleSheet.absoluteFillObject,
    borderRadius: 5
  },
  contentContainerStyle: {
    padding: 16,
    backgroundColor: colors.AppWhite,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.AppWhite,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  panelHandle: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4
  },
  item: {
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'red',
    alignItems: 'center',
    marginVertical: 10,
  },
  listViewStyle: {
    flex:1,
    margin: 5,
    marginLeft: 16,
    marginRight: 16,
    borderBottomWidth: 1,
    borderColor: colors.BorderColor,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  searchBtnStyle: {
    height: 40,
    width: windowWidth - 40,
    zIndex: 11,
    position: 'absolute',
    marginTop: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
    backgroundColor: colors.AppWhite,
    paddingRight: 10,
    borderRadius: 5,
    flexDirection: 'row',
    paddingLeft: 16, 
  }

});


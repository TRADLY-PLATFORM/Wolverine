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
import NavigationRoots from '../../../Constants/NavigationRoots';
import HeaderView from '../../../Component/Header'
import colors from '../../../CommonClasses/AppColor';
import commonStyles from '../../../StyleSheet/UserStyleSheet';
import eventStyles from '../../../StyleSheet/EventStyleSheet';
import filterGrayIcon from '../../../assets/filterGrayIcon.png';
import sortIcon from '../../../assets/sortIcon.png';
import viewMapIcon from '../../../assets/viewMapIcon.png';
import APPURL from '../../../Constants/URLConstants';
import networkService from '../../../NetworkManager/NetworkManager';
import appConstant from '../../../Constants/AppConstants';
import Spinner from 'react-native-loading-spinner-overlay';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import radio from '../../../assets/radio.png';
import selectedradio from '../../../assets/selectedradio.png';
import {changeDateFormat,getDatesArray,getNextDate} from '../../../HelperClasses/SingleTon'
import ExploreListItem from '../../../Component/ExploreListItem'

import constantArrays from '../../../Constants/ConstantArrays';
import LocationPermission from '../../../HelperClasses/LocationPermission';
const windowHeight = Dimensions.get('window').height;

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
const origin = { latitude: 30.6225, longitude: 76.6224 };
const destination = { latitude: 30.7051, longitude: 76.68154 };
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
      filterArray: [],
      isVisible: false,
      dataLoad: false,
    }
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      appConstant.hideTabbar = true
      let lp = new LocationPermission();
      lp._requestLocation();
    });
    this.state.datesArray = getDatesArray();
    this.state.selectedDate = this.state.datesArray[0];
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
    this.state.params = '';
    this.setState({ isVisible: true })
    this.callApi(this.state.params);
  }
  /*  Buttons   */
  didSelectEventList(item, index) {
    this.props.navigation.navigate(NavigationRoots.EventDetail, {
      id :item['id'],
    });
  }
  filterBtnAction() {
    this.props.navigation.navigate(NavigationRoots.Filter, {
      filterArray :this.state.filterArray,
      getFilterData :this.getFilterData,
    });
  }
  sortBtnAction(done) {
    appConstant.hideTabbar = this.state.showSortView
    this.props.navigation.setParams({tabBarVisible: false});
    this.setState({showSortView: !this.state.showSortView})
    if (done){
      if (this.state.sortSelectedIndex != -1) {
        let sortKey  = ['newest_first','price_high_to_low', 'price_low_to_high', 'relevance'];
        this.state.params = `${this.state.params}&sort=${sortKey[this.state.sortSelectedIndex]}`
      }
      this.callApi(this.state.params);
    }
  }
  didSelectDate(index) {
    this.state.selectedDateIndex = index
    this.state.selectedDate = changeDateFormat(this.state.datesArray[index], 'YYYY-MM-DD');
    let nxtDate = getNextDate(this.state.datesArray[index])
    let nxt = changeDateFormat(nxtDate, 'YYYY-MM-DD')
    this.setState({ updateUI: !this.state.updateUI})
    let strtD = `${this.state.selectedDate}T00:00:00Z`;
    let endD = `${nxt}T00:00:00Z`;
    this.state.params = `&start_at=${strtD}&end_at=${endD}`;
    this.callApi(this.state.params);
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
        let rObjc = objc['rating']
        queryParams = queryParams + `&rating=${rObjc['rating']}`;
      }
      if (objc['distance']) {
        let dObjc = objc['distance']
        queryParams = queryParams + `&max_distance=${dObjc['distance']}`;
      }
      if (objc['category']) {
        let dObjc = objc['category']
        queryParams = queryParams + `&category_id=${dObjc['id']}`;
      }
      if (objc['price']) {
        let dObjc = objc['price']
        queryParams = queryParams + `&price_from=${dObjc['from']}&price_to=${dObjc['to']}`;
      }
    }
    this.state.filterArray = data
    this.state.params = queryParams;
    this.callApi(this.state.params);

  }
  convert12HoursFormat(time) {
    var timeString = `${time.length == 1 ? `0${time}`:time}:00:00`;
    return timeString
  }
  /*  UI   */
  renderSortItemCell = ({item, index }) => {
    let check = index == this.state.sortSelectedIndex ? true : false
    return (
      <TouchableOpacity onPress={() => this.setState({sortSelectedIndex:index})}>
        <View style={eventStyles.listViewStyle}>
          <Text style={{ textAlign: 'left', fontSize: 16, color: colors.AppGray }}> {item} </Text>
          <Image style={commonStyles.nextIconStyle} source={check ? selectedradio : radio} />
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
      return (<View style={{backgroundColor: 'green'}}>
        <ScrollBottomSheet
          componentType="ScrollView"
          snapPoints={['40%', "40%", maxHeight]}
          initialSnapIndex={1}
          scrollEnabled={true}
          animationType={'timing'}
          renderHandle={() => (
            <View style={eventStyles.header}>
              <View style={eventStyles.panelHandle} />
              <View style={{ backgroundColor: colors.AppWhite, height: windowHeight/ 2, width: '100%', marginTop: 15 }}>
                <View style={{justifyContent: 'center'}}>
                  <Text style={{fontSize: 16, fontWeight: '600', paddingLeft: 20}}>Sort </Text>
                </View>
                <View style={{height: '58%', marginTop: 10}}>
                  {this.renderSortListView()}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16,marginTop: -10 }}>
                  <TouchableOpacity style={eventStyles.bottomBtnViewStyle} onPress={()=> this.sortBtnAction(true)}>
                    <View style={eventStyles.applyBtnViewStyle}>
                      <Text style={{ color: colors.AppWhite, fontWeight: '600' }}>Done</Text>
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
  renderListView = () => {
    if (this.state.eventsArray.length != 0) {
      return (<View style={{ margin: 5, height: '87%' }}>
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
      return <View style={{height: '90%',justifyContent: 'center', alignItems: 'center', backgroundColor: colors.LightBlueColor}}>
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
    let dt = index == 0 ? 'Today' : changeDateFormat(item, 'ddd D')
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
    return (<TouchableOpacity style={{position: 'relative',flexDirection: 'row-reverse', padding: 10, marginTop:this.state.showMap ? -20 : -80, zIndex: 100}}
       onPress={() => this.setState({showMap: !this.state.showMap})}>
      <View style={eventStyles.viewOnMapBtnStyle}>
      <Image style={{ width: 20, height: 20 }} resizeMode={'contain'} source={viewMapIcon} />
      <View style={{width: 5}}/>
      <Text style={{fontWeight: '500', fontSize: 14, color:colors.AppTheme}}>{this.state.showMap ? 'View List' : 'View Map'}</Text>
      </View>
  </TouchableOpacity>)
  }
   renderMarker = () => {
     var markerView = [];
    for (let objc of this.state.eventsArray) {
      let coordinate = objc['coordinates'];
      // console.log('objc', coordinate)
      markerView.push(<Marker
        coordinate={coordinate}
        image = {require('../../../assets/mapPin.png')} 
        title={objc['title']}
      />);
    }
    return markerView;
   }
  renderMainView = () => {
      if (this.state.showMap) {
        return (<View style={{ height: windowHeight / 1.25, width: windowWidth }}>
          <View style={eventStyles.containerMapStyle}>
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
          <View style={{ marginTop: - 200, flex: 1, zIndex: 12 }}>
            {this.renderViewMaBtnView()}
            {this.renderListView()}
          </View>
        </View>)
      } else {
        return (<View style={{ height: '100%' }}>
          <View>
            {this.renderHeaderView()}
            {this.renderDateListView()}
          </View>
          <View style={{ height: windowHeight / 1.32 }}>
            {this.renderListView()}
            {this.renderViewMaBtnView()}
          </View>
        </View>)
      }
  }

  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Explore'} showBackBtn={false} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor }}>
          <View style={{ zIndex: 5, position: 'absolute' }}>
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
  viewOnMapBtnStyle: {
    height: 40,
    backgroundColor: colors.AppWhite,
    flexDirection: 'row',
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    borderRadius: 20,
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

});


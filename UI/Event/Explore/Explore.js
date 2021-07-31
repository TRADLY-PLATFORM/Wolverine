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
import sample from '../../../assets/dummy.png';
import eventStyles from '../../../StyleSheet/EventStyleSheet';
import timeIcon from '../../../assets/timeIcon.png';
import starIcon from '../../../assets/star.png';
import heartIcon from '../../../assets/heartIcon.png';
import filterGrayIcon from '../../../assets/filterGrayIcon.png';
import sortIcon from '../../../assets/sortIcon.png';
import viewMapIcon from '../../../assets/viewMapIcon.png';
import APPURL from '../../../Constants/URLConstants';
import networkService from '../../../NetworkManager/NetworkManager';
import appConstant from '../../../Constants/AppConstants';
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import radio from '../../../assets/radio.png';
import selectedradio from '../../../assets/selectedradio.png';
import {getTimeFormat,changeDateFormat,getDatesArray} from '../../../HelperClasses/SingleTon'

import constantArrays from '../../../Constants/ConstantArrays';

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
    }
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      appConstant.hideTabbar = true
    });
    this.state.datesArray = getDatesArray();
    this.state.selectedDate = this.state.datesArray[0];
    this.callApi(this.state.params);

  }
  callApi(param) {
    this.state.eventsArray = [];
    this.state.stopPagination = false
    this.state.pageNo = 1;
    this.getEventsApi(param);
  }
  getEventsApi = async (param) => {
    this.setState({ isVisible: true })
    var path = `&per_page=30&type=events&latitude=30.70&longitude=76.62` + param;
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
      this.setState({ updateUI: !this.state.updateUI, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
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
      getFilterData: this.getFilterData,
    });
  }
  sortBtnAction(done) {
    appConstant.hideTabbar = this.state.showSortView
    this.props.navigation.setParams({tabBarVisible: false});
    this.setState({showSortView: !this.state.showSortView})
    if (done){
      if (this.state.sortSelectedIndex != -1) {
        let sortKey  = ['newest_first','price_high_to_low', 'price_low_to_high', 'relevance'];
        this.state.params = `${path}&sort=${sortKey[this.state.sortSelectedIndex]}`
      }
      this.callApi();
    }
  }
  didSelectDate(index) {
    this.state.selectedDateIndex = index
    this.state.selectedDate = this.state.datesArray[index];
    this.setState({ updateUI: !this.state.updateUI})
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
    }
    this.state.filterArray = data
    this.state.params = queryParams;
    this.callApi(this.state.params);

  }
  convert12HoursFormat(time) {
    var timeString = `${time.length == 1 ? `0${time}`:time}:00:00`;
    // const timeString12hr = new Date('1970-01-01T' + timeString) .toLocaleTimeString({timeZone:'en-US',hour12:true,hour:'numeric',minute:'numeric'});
    // timeString12hr;
    // let startDate = 'Tue Jul 27 2021' + ` ${timeString12hr}`
    // let startTimestamp = new Date(startDate).getTime() / 1000;
    return timeString
  }
  /*  UI   */
  renderSortItemCell = ({item, index }) => {
    let check = index == this.state.sortSelectedIndex ? true : false
    return (
      <TouchableOpacity onPress={() => this.setState({sortSelectedIndex:index})}>
        <View style={styles.listViewStyle}>
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
            <View style={styles.header}>
              <View style={styles.panelHandle} />
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
          contentContainerStyle={styles.contentContainerStyle}
          onSettle={index => { if (index == 2) {  this.sortBtnAction() }}}
        />
      </View>)
    } else {
      return <View />
    }
  }
  renderListView = () => {
    if (this.state.eventsArray.length != 0) {
      return (<View style={{ margin: 5, height: '90%' }}>
        <FlatList
          data={this.state.eventsArray}
          numColumns={1}
          renderItem={this.renderListCellItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          horizontal={this.state.showMap ? true : false}
          onEndReachedThreshold={0}
          onEndReached={this.paginationMethod}
        />
      </View>)
    } else {
      return <View style={{height: '90%',justifyContent: 'center', alignItems: 'center'}}>
        <Text style={eventStyles.commonTxtStyle}> No Event Found!!</Text>
      </View>
    }
  }
  renderListCellItem = ({ item, index }) => {
    var title = '';
    var rattingAvg = '';
    var price = '';
    var time = '';
    if(item['title']){
      title = item['title'];
      rattingAvg =item['rating_data']['rating_average']
      price =item['list_price']['formatted']
      time = getTimeFormat(item['start_at']) + ` to ` +  getTimeFormat(item['end_at']) 
    }
    var photo = item['images'] ? item['images'] : [];

    return <TouchableOpacity style={styles.variantCellViewStyle} onPress={() => this.didSelectEventList(item, index)}>
    <View style={{ flexDirection: 'row' }}>
      <FastImage style={{ width: 110, height: 130, borderRadius: 5 }} source={photo.length == 0 ? sample : { uri: photo[0] }} />
      <View style={{ margin: 5 }}>
        <View style={{ margin: 5, flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{ width: 15, height: 15 }} resizeMode='center' source={timeIcon} />
          <View style={{ width: 5 }} />
          <Text style={eventStyles.titleStyle}>{time}</Text>
        </View>
        <View style={{ margin: 5}}>
          <Text style={{ fontSize: 14, fontWeight: '400', color: colors.AppGray }}>{title}</Text>
        </View>
        <View style={{ margin: 5, flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{ width: 15, height: 15 }} source={starIcon} />
          <View style={{ width: 5 }} />
          <Text style={eventStyles.subTitleStyle}>{`${rattingAvg} | 0 rating`}</Text>
        </View>
        <View style={{ margin: 5, marginTop: 15}}>
        <Text style={eventStyles.titleStyle}>{price}</Text>
        </View>
      </View>
      <View>
        </View>
    </View>
    <View style={{ alignContent: 'center', padding: 10}}>
      <Image style={{width: 40, height: 40, marginTop: 5}} resizeMode='center' source={heartIcon} />
    </View>
  </TouchableOpacity>
  }
  renderHeaderView = () => {
    return (<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <TouchableOpacity style={styles.headerViewStyle} onPress={() => this.sortBtnAction()}>
        <Image style={commonStyles.backBtnStyle} resizeMode={'contain'} source={sortIcon} />
        <Text style={{ color: colors.AppGray, marginLeft: 10 }}>Sort</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerViewStyle} onPress={() => this.filterBtnAction()}>
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
    return (<TouchableOpacity style={{position: 'relative',flexDirection: 'row-reverse', padding: 10, marginTop:this.state.showMap ? -20 : -70, zIndex: 100}}
       onPress={() => this.setState({showMap: !this.state.showMap})}>
      <View style={styles.viewOnMapBtnStyle}>
      <Image style={{ width: 20, height: 20 }} resizeMode={'contain'} source={viewMapIcon} />
      <View style={{width: 5}}/>
      <Text style={{fontWeight: '500', fontSize: 14, color:colors.AppTheme}}>{this.state.showMap ? 'View List' : 'View Map'}</Text>
      </View>
  </TouchableOpacity>)
  }
   renderMarker = () => {
     var markerView = [];
    for (let objc of this.state.eventsArray) {
      // let objc = this.state.eventsArray[0];
      let coordinate = objc['coordinates'];
      // console.log('objc', objc['coordinates'])
      // let coordinate =  {
      //   "latitude": 30.6892,
      //   "longitude":76.6907,
      // }
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
      return (<View style={{height: windowHeight/1.25,width: windowWidth}}>
        <View style={styles.containerMapStyle}>
          <MapView
            // provider={PROVIDER_GOOGLE}
            style={styles.mapStyle}
            initialRegion={{
              latitude: 30.68825,
              longitude: 76.6924,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          >
            {this.renderMarker()}
          </MapView>
        </View>
        <View style={{marginTop: - 200, flex: 1, zIndex: 12} }>
          {this.renderViewMaBtnView()}
          {this.renderListView()}
        </View>
      </View>)
    } else {
      return (<View style={{ height: '100%'}}>
        <View>
          {this.renderHeaderView()}
          {this.renderDateListView()}
        </View>
        <View style={{height: windowHeight/1.32}}>
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
        <View style={{ height: '100%', backgroundColor: colors.AppWhite }}>
          <View style={{zIndex: 5, position: 'absolute'}}>
            <this.renderMainView />
          </View>
          <View style={{zIndex:20, backgroundColor: colors.blackTransparent, height:this.state.showSortView ? '100%' : 0}}>
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
  variantCellViewStyle: {
    flexDirection: 'row',
    margin: 5,
    justifyContent: 'space-between',
    alignContent: 'center',
    borderRadius: 5,
    // overflow: 'hidden',
    height: 130,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    backgroundColor: colors.AppWhite,
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


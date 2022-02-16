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
import filterGrayIcon from '../../assets/filterGrayIcon.png';
import sortIcon from '../../assets/sortIcon.png';
import APPURL from '../../Constants/URLConstants';
import networkService from '../../NetworkManager/NetworkManager';
import appConstant from '../../Constants/AppConstants';
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import radio from '../../assets/radio.svg';
import selectedradio from '../../assets/radioChecked.svg';
import {changeDateFormat,getDatesArray,getNextDate} from '../../HelperClasses/SingleTon'
import ExploreListItem from '../../Component/ExploreListItem'
import constantArrays from '../../Constants/ConstantArrays';
import SvgUri from 'react-native-svg-uri';

const windowHeight = Dimensions.get('window').height;


export default class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateUI: false,
      showSortView: false,
      showDropDown: false,
      categoryID: -1,
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
    this.state.datesArray = getDatesArray();
    this.state.selectedDate = this.state.datesArray[0];
    if (this.props.route.params) {
      let {categoryID} = this.props.route.params;
      if (categoryID != undefined){
        this.state.selectedDate = changeDateFormat(this.state.datesArray[0], 'YYYY-MM-DD');
        let strtD = `${this.state.selectedDate}T00:00:00Z`;
        this.state.params = '&category_id=' + categoryID + `&start_at=${strtD}`;
        this.callApi(this.state.params);
      }else {
        this.initApi()
      }
    }
  }
  initApi() {
    this.state.selectedDate = changeDateFormat(this.state.datesArray[0], 'YYYY-MM-DD');
    let strtD = `${this.state.selectedDate}T00:00:00Z`;
    this.state.params = `&start_at=${strtD}`;
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
    var path = `&per_page=30&type=events` + param;
    let {favourite} = this.props.route.params;
    if (favourite != undefined){
      path = `/likes?page=${this.state.pageNo}&per_page=30`
    } else {
      path = `?page=${this.state.pageNo}${path}`
    }
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.listings}${path}`,
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
      getFilterData :this.getFilterData,
    });
  }
  sortBtnAction(done) {
    this.props.navigation.setParams({tabBarVisible: false});
    this.setState({showSortView: !this.state.showSortView})
    if (done){
      if (this.state.sortSelectedIndex != -1) {
        let sortKey  = ['nearest_distance','price_high_to_low', 'price_low_to_high', 'relevance'];
        this.state.params = `${this.state.params}&sort=${sortKey[this.state.sortSelectedIndex]}`
        console.log('this.state.params', this.state.params)
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
      // this.state.params = ``;
      // this.callApi(this.state.params);
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
        }        let rObjc = objc['rating']
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
          queryParams = queryParams + `&attribute_value_id=${dObjc.join(',')}` + strtD;
      }
    }
    this.state.filterArray = data
    this.state.params = queryParams;
    if (this.state.filterArray == 0) {
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
    return (
      <TouchableOpacity onPress={() => this.setState({sortSelectedIndex:index})}>
        <View style={eventStyles.listViewStyle}>
          <Text style={{ textAlign: 'left', fontSize: 16, color: colors.AppGray }}> {item} </Text>
          <View style={commonStyles.nextIconStyle}>
            <SvgUri width={20} height={20} source={check ? selectedradio : radio} fill={check ? colors.AppTheme : colors.Lightgray} />
          </View>
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
      return (<View style={{ margin: 5, height: '90%' }}>
        <FlatList
          data={this.state.eventsArray}
          numColumns={1}
          initialNumToRender={7}
          renderItem={this.renderListCellItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index + 3245}
          key={'L'}
          horizontal={this.state.showMap ? true : false}
          onEndReachedThreshold={0}
          onEndReached={this.paginationMethod}
        />
      </View>)
    } else {
      return <View style={{height: '90%',justifyContent: 'center', alignItems: 'center', backgroundColor: colors.LightBlueColor}}>
        <Text style={eventStyles.commonTxtStyle}> No Event Found!!</Text>
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
  renderMainView = () => {
    return (<View style={{ height: '100%' }}>
      <View>
        {this.renderHeaderView()}
        {this.renderDateListView()}
      </View>
      <View style={{ height: windowHeight - 160 }}>
        {this.renderListView()}
      </View>
    </View>)
  }

  render() {
    var title = 'Favourite';
    let {categoryName} = this.props.route.params;
    if (categoryName != undefined) {
      title = categoryName;
    }
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={categoryName} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} />
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
});


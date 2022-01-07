import React, { Component,useCallback } from 'react';
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
import constantArrays from '../../../Constants/ConstantArrays';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import eventStyles from '../../../StyleSheet/EventStyleSheet';
import radio from '../../../assets/radio.png';
import selectedradio from '../../../assets/radioChecked.png';
import Slider from '@react-native-community/slider';
// import {Slider} from '@miblanchard/react-native-slider';
import cancelIcon from '../../../assets/cancel.png';

import starIcon from '../../../assets/star.png';
import APPURL from '../../../Constants/URLConstants';
import networkService from '../../../NetworkManager/NetworkManager';
import appConstant from '../../../Constants/AppConstants';
import Spinner from 'react-native-loading-spinner-overlay';
// import RangeSlider from '@jesster2k10/react-native-range-slider';
// import RangeSlider from 'rn-range-slider';
// import MultiSlider from '@ptomasroos/react-native-multi-slider';
// import { MaterialSlider } from 'react-multi-thumb-slider';
import Slider2 from "react-native-sliders";


import LangifyKeys from '../../../Constants/LangifyKeys';
import tradlyDb from '../../../TradlyDB/TradlyDB';



const windowHeight = Dimensions.get('window').height;
const titleAry = ['Any Time', 'Past year', 'Past Month', 'Past Week', 'Past 24 Hour']; 
export default class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryArray: [],
      isVisible:true,
      updateUI: false,
      showFilterView:false,
      selectedFilterIndex: -1,
      timeValue: [0,24.0],
      timeApplied: false,
      distanceValue: 0,
      priceValue: [0, 300],
      selectedDatePostedIndex: -1,
      selectedRatingIndex: -1,
      selectedCategoryIndex: -1,
      filterValueArray: [],
      attributesArray: [],
      selectedAttributeArray: [],
      selectAttributeIds:[],
      selectedAtriValueIds: [],
      showTimeBool:false,
      translationDic:{},
      dataLoad: false,
    }
    this.onChangeTimeSlider =  this.onChangeTimeSlider.bind(this);

  }

  componentDidMount() {
    this.langifyAPI();
    for (let obc of constantArrays.filterArray){
      this.state.attributesArray.push(obc)
    }
    this.loadCategoryApi()
    this.loadAttributeApi()
    this.state.filterArray =  [];
    let {filtersArray} = this.props.route.params;
    if (filtersArray) {
      this.state.filterValueArray = filtersArray;
      for (let objc of filtersArray) {
        // if (objc['time']) {
        //   this.state.timeApplied = true;
        //   let timeD = objc['time'];
        //   this.state.timeValue[0] = Number(`${timeD['start']}.0`);
        //   this.state.timeValue[1] = Number(`${timeD['end']}.0`);
        // }
        if (objc['date']) {
          let dData = objc['date'];
          this.state.selectedDatePostedIndex = dData['index'];
        } 
        if (objc['rating']) {
          let rObjc = objc['rating']
          this.state.selectedRatingIndex = 5 - rObjc['rating'];
        }
        if (objc['distance']) {
          let dObjc = objc['distance']
          this.state.distanceValue = Number(`${dObjc['distance']}.0`);
        }
        if (objc['price']) {
          let dObjc = objc['price']
          this.state.priceValue[0] = Number(`${dObjc['from']}`);
          this.state.priceValue[1] = Number(`${dObjc['to']}`);
        }
        if (objc['category']) {
          let dObjc = objc['category'];
          this.state.selectedCategoryIndex = dObjc['index'];
        }
        if (objc['attribute']) {
          let aObjc = objc['attribute'];
          this.state.selectedAtriValueIds = aObjc['values'];
          this.state.selectAttributeIds = aObjc['category'];
        }
      }
    }
  }
  langifyAPI = async () => {
    let searchD = await tradlyDb.getDataFromDB(LangifyKeys.filter);
    if (searchD != undefined) {
      this.searchTranslationData(searchD);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.filter}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${appConstant.appLanguage}${group}`, 'get', '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(LangifyKeys.filter, objc)
      this.searchTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  searchTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('filter.distance' == obj['key']) {
        constantArrays.filterArray[1] = obj['value'];
      }
      if ('filter.rating' == obj['key']) {
        constantArrays.filterArray[0] = obj['value'];
      }  
      if ('filter.category' == obj['key']) {
        constantArrays.filterArray[2] = obj['value'];
      }  
      if ('filter.title' == obj['key']) {
        this.state.translationDic['title'] = obj['value'];
      }
      if ('filter.clear' == obj['key']) {
        this.state.translationDic['clear'] = obj['value'];
      }
      if ('filter.apply' == obj['key']) {
        this.state.translationDic['apply'] = obj['value'];
      }
    }
    this.setState({dataLoad: true})
  }


  loadCategoryApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(APPURL.URLPaths.category + 'listings', 'get', '', appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      let cData = responseJson['data']['categories'];
      this.state.categoryArray = cData;
      this.setState({updateUI: !this.state.updateUI})
    } else {
      this.setState({ isVisible: false })
    }
  }
  loadAttributeApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(APPURL.URLPaths.getAttribute, 'get', '', appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      let aData = responseJson['data']['attributes'];
      for (let a = 0; a < aData.length; a++) {
        let objc = aData[a];
        if (objc['field_type'] == 1 || objc['field_type'] == 2) {
          this.state.attributesArray.push(objc);
        }
      }
      this.setState({updateUI: !this.state.updateUI,isVisible: false})
    } else {
      this.setState({ isVisible: false })
    }
  }
  /*  Buttons   */
  didSelect = (item,index) => {
    this.state.selectedFilterIndex = index;
    if (item['name']) {
      this.state.selectAttributeIds.push(item['id']);
      this.state.selectedAttributeArray = item['values'];
    }
    if (index == 8838938830) {
      this.setState({showTimeBool: true})
    }else {
      this.setState({showFilterView: !this.state.showFilterView})
    }
  }
  doneBtnAction () {
    this.setState({showFilterView: false, showTimeBool: false})
    console.log(this.state.selectedRatingIndex,'this.state.selectedFilterIndex', this.state.selectedFilterIndex)
    if (this.state.selectedFilterIndex == 0){
      let ratingDict = {
        'rating': 5 - this.state.selectedRatingIndex,
      }
      let dic = {rating: ratingDict}
      var aIndx = -1
      for (let a = 0; a <this.state.filterValueArray.length; a++){
        if (this.state.filterValueArray[a]['rating']) {
          aIndx = a
        }
      }
      console.log(dic,'aIndx',aIndx)
      this.addValueInArray(aIndx,dic)
    } else if (this.state.selectedFilterIndex == 1){
      let dDict = {
        'distance': this.state.distanceValue.toFixed(0),
      }
      let dic = {distance: dDict}
      var aIndx = -1
      for (let a = 0; a <this.state.filterValueArray.length; a++){
        if (this.state.filterValueArray[a]['distance']) {
          aIndx = a
        }
      }
      this.addValueInArray(aIndx,dic)
    } else if (this.state.selectedFilterIndex == 9383){
      let fromPrice = this.state.priceValue[0].toFixed(0);
      let toPrice = this.state.priceValue[1].toFixed(0);
      let pDict = {
        'from': fromPrice,
        'to': toPrice,
      }
      let dic = {price: pDict}
      var aIndx = -1
      for (let a = 0; a <this.state.filterValueArray.length; a++){
        if (this.state.filterValueArray[a]['price']) {
          aIndx = a
        }
      }
      this.addValueInArray(aIndx,dic)
    } else if (this.state.selectedFilterIndex == 2){
      let id = this.state.categoryArray[this.state.selectedCategoryIndex]['id'];
      let cDict = {
        'id': id,
        'index':this.state.selectedCategoryIndex,
      }
      let dic = {category: cDict}
      var aIndx = -1
      for (let a = 0; a <this.state.filterValueArray.length; a++){
        if (this.state.filterValueArray[a]['category']) {
          aIndx = a
        }
      }
      this.addValueInArray(aIndx,dic)
    }
    if (this.state.selectedAtriValueIds.length != 0) {
      let cDict = {
        'values': this.state.selectedAtriValueIds,
        'category':this.state.selectAttributeIds,
      }
      var aIndx = -1
      for (let a = 0; a <this.state.filterValueArray.length; a++){
        if (this.state.filterValueArray[a]['attribute']) {
          aIndx = a
        }
      }
      this.addValueInArray(aIndx,{attribute: cDict})
    }
  }
  addValueInArray(index , objc) {
    if (index != -1) {
      this.state.filterValueArray[index] = objc
    } else {
      this.state.filterValueArray.push(objc)
    }
  }
  applyBtnAction () {
    this.props.route.params.getFilterData(this.state.filterValueArray);
    this.props.navigation.goBack();
  }
  clearBtnAction () {
    this.state.timeApplied = false;
    this.state.filterValueArray = [];
    this.state.selectedAtriValueIds = [];
    this.state.selectAttributeIds = [];
    this.props.route.params.getFilterData(this.state.filterValueArray);
    this.props.navigation.goBack();
    this.setState({updateUI: !this.state.updateUI})
  }
  backBtnAction () {
    this.state.timeApplied = false;
    this.state.filterValueArray = [];
    this.props.navigation.goBack();
    this.setState({updateUI: !this.state.updateUI})
  }
  didSelectDatePosted(index) {
    this.setState({selectedDatePostedIndex: index})
  }
  didSelectAttributes(item) {
    var index = this.state.selectedAtriValueIds.indexOf(item['id']);
    if (index !== -1) {
      this.state.selectedAtriValueIds.splice(index, 1);
    }else {
      this.state.selectedAtriValueIds.push(item['id'])
    }
    this.setState({updateUI: !this.state.updateUI})
  }
  /*  UI   */
  convert12HoursFormat(time) {
    var ampm = time >= 12 ? 'PM' : 'AM';
    var timeString = `${time.length == 1 ? `0${time}`:time}:00 ${ampm}`;
    return timeString
  }
  renderListView = () => {
    return (<View style={{margin: 5, height: '84%'}}>
      <FlatList
        data={this.state.attributesArray}
        renderItem={this.renderListViewCellItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
      />
    </View>)
  }
  renderListViewCellItem = ({item, index}) => {
    var views = [];
    if (index == 98383292920) {
      if (this.state.timeApplied) {
        let stTime = this.convert12HoursFormat(this.state.timeValue[0].toFixed(0));
        let edTime = this.convert12HoursFormat(this.state.timeValue[1].toFixed(0));
        views.push(<View>
          <Text style={styles.textValueStyle}> {`${stTime} - ${edTime}`} </Text>
        </View>)
      }
    }
    else if (index == -211) {
      if (this.state.selectedDatePostedIndex != -1) {
        let value = titleAry[this.state.selectedDatePostedIndex];
        views.push(<View>
          <Text style={styles.textValueStyle}> {`${value}`} </Text>
        </View>)
      }
    }
    else if (index == 0) {
      if (this.state.selectedRatingIndex != -1) {
        var startView = []
        for (let a = 0; a < 5 - this.state.selectedRatingIndex; a++) {
          startView.push(<View style={{ flexDirection: 'row', margin: 5 }}>
            <Image source={starIcon} style={{ height: 15, width: 15 }} />
          </View>)
        }
        views.push(<View>
          <View style={{flexDirection: 'row', }}>
            {startView}
          </View>
        </View>)
      }
    }
    else if (index == 1) {
      if (this.state.distanceValue != 0) {
        let value = this.state.distanceValue.toFixed(0)
        views.push(<View>
          <Text style={styles.textValueStyle}> {`${value} KM`} </Text>
        </View>)
      }
    }
    else if (index == -24) {
      if (this.state.priceValue[0] != 0) {
        let from = this.state.priceValue[0].toFixed(0);
        let to = this.state.priceValue[1].toFixed(0)
        views.push(<View>
          <Text style={styles.textValueStyle}> {`${from} - ${to}`} </Text>
        </View>)
      }
    }
    else if (index == 2) {
      if (this.state.selectedCategoryIndex != -1) {
        var value = '';
        if (this.state.categoryArray[this.state.selectedCategoryIndex]) {
          value = this.state.categoryArray[this.state.selectedCategoryIndex]['name'];
        }
        views.push(<View>
          <Text style={styles.textValueStyle}> {`${value}`} </Text>
        </View>)
      }
    } else{
      if (this.state.selectedAtriValueId != -1) {
        var value = '';
        var indx = this.state.selectAttributeIds.indexOf(item['id']); // 1
        if (indx != -1) {
          let ida = this.state.selectAttributeIds[indx]
          let iA = this.state.attributesArray.findIndex(x => x['id'] == ida)
          if (iA != -1) {
            let obj = this.state.attributesArray[iA]['values'];
            for (let dic of this.state.selectedAtriValueIds) {
              let idx = obj.findIndex(x => x['id'] == dic)
              if (idx != -1) {
                value = obj[idx]['name'];
                views.push(<View>
                  <Text style={styles.textValueStyle}> {`${value}`} </Text>
                </View>)
              }
            }
          }
        }
      }
    }
    var title = "";
    if (item['name']) {
      title = item['name'];
    } else {
      title = item;
    }
    return (
      <TouchableOpacity onPress={() => this.didSelect(item,index)}>
        <View style={styles.listViewStyle}>
          <Text style={{ textAlign: 'left', fontSize: 16, color: colors.AppGray }}> {title} </Text>
          {views}
        </View>
      </TouchableOpacity>
    )
  }
  renderButtonView = () => {
    return (<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16}}>
      <TouchableOpacity style={styles.bottomBtnViewStyle} onPress={() =>  this.clearBtnAction()}>
        <View style={eventStyles.clearBtnViewStyle}>
          <Text style={{ color: colors.AppTheme,fontWeight: '600'}}>{this.state.translationDic['clear'] ?? 'Clear'}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomBtnViewStyle} onPress={() => this.applyBtnAction()}>
        <View style={eventStyles.applyBtnViewStyle}>
          <Text style={{ color: colors.AppWhite,fontWeight: '600' }}>{this.state.translationDic['apply'] ?? 'Apply'}</Text>
        </View>
      </TouchableOpacity>
    </View>)
  }
  onChangeTimeSlider(min, max){
    this.state.timeValue[0]=min;
    this.state.timeValue[1]=max;
    // this.setState({updateUI: !this.state.updateUI})
  }

  renderTimeView = () => {
    var strt = '';
    return (<View style={{ backgroundColor: colors.AppWhite }}>
      <View style={{ padding: 20 }}>
        <Text style={eventStyles.commonTxtStyle}>12:00 AM - 12:00 PM</Text>
      </View>
      <Slider2
        value={this.state.timeValue}
        style={{ width: '90%', marginLeft: 20 }}
        minimumValue={0}
        maximumValue={24}
        onValueChange={value => this.setState({ timeValue: value })}
        trackStyle={styles.track}
        thumbStyle={styles.thumb}
        minimumTrackTintColor={colors.AppTheme}
      />
      <View style={{ padding: 20, paddingTop: 0, justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text style={eventStyles.commonTxtStyle}>{this.state.timeValue[0].toFixed(0)}</Text>
        <Text style={eventStyles.commonTxtStyle}>{this.state.timeValue[1].toFixed(0)}</Text>
      </View>
    </View>)
  }
  renderDatePostedView = () => {
    var views = [];
    for (let a = 0; a < titleAry.length; a++) {
      if (this.state.selectedDatePostedIndex == a) {
        views.push(<View style={{margin: 5,marginLeft: 0}}>
          <TouchableOpacity style={eventStyles.selectedBntViewStyle} onPress={() => this.didSelectDatePosted(a)}>
            <Text style={eventStyles.selectedBtnTxtStyle}>{titleAry[a]}</Text>
          </TouchableOpacity>
        </View>
        )
      }else {
        views.push(<View style={{margin: 5,marginLeft: 0}}>
          <TouchableOpacity style={eventStyles.addBntViewStyle} onPress={() => this.didSelectDatePosted(a)}>
            <Text style={eventStyles.btnTxtStyle}>{titleAry[a]}</Text>
          </TouchableOpacity>
        </View>
        )
      }
    }
    return (<View style={{flexWrap: 'wrap' , width: '90%',margin:10, flexDirection: 'row', padding: 10}}>
      {views}
    </View>)
  }
  renderRatingView = () => {
    return(<View style={{marginTop: 10, marginBottom: 10}}>
      <FlatList
        data={[5,4,3,2,1]}
        numColumns={1}
        renderItem={this.renderRatingItemCell}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
        scrollEnabled={false}
      />
    </View>)
  }
  renderRatingItemCell = ({ item, index }) => {
    let check = index == this.state.selectedRatingIndex ? true : false
    var startView = []
    for (let a = 0; a < item; a++) {
      startView.push(<View style={{ flexDirection: 'row', margin: 5 }}>
        <Image source={starIcon} style={{ height: 15, width: 15 }} />
      </View>)
    }
    return (
      <TouchableOpacity onPress={() => this.setState({ selectedRatingIndex: index })}>
        <View style={styles.startViewCellStyle}>
          <View style={{ width: 200, flexDirection: 'row', }}>
            {startView}
          </View>
          <View style={commonStyles.nextIconStyle}>
          <Image style={{width:20,height:20,tintColor:check ? colors.AppTheme : colors.Lightgray}} source={check ? selectedradio : radio}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  renderDistanceView = () => {
    return (<View style={{ backgroundColor: colors.AppWhite }}>
      <View style={{ padding: 20 }}>
        <Text style={eventStyles.commonTxtStyle}>10 KM Surrounding</Text>
      </View>
      <Slider
        value={this.state.distanceValue}
        style={{ width: '90%', marginLeft: 20,height: 40}}
        minimumValue={0}
        maximumValue={10}
        onSlidingComplete={value => this.setState({ distanceValue: value })}
        trackStyle={styles.track}
        thumbStyle={styles.thumb}
        minimumTrackTintColor={colors.AppTheme}
        minimumValue={0}
      />
      <View style={{ padding: 20, paddingTop: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text style={eventStyles.commonTxtStyle}>{0}</Text>
        <Text style={eventStyles.commonTxtStyle}>{this.state.distanceValue.toFixed(0) + ` KM` }</Text>
      </View>
    </View>)
  }
  renderPriceView = () => {
    return (<View style={{ backgroundColor: colors.AppWhite }}>
      <View style={{ padding: 20 }}>
        <Text style={eventStyles.commonTxtStyle}>{appConstant.defaultCurrency}</Text>
      </View>
      <Slider
        value={this.state.priceValue}
        style={{ width: '90%', marginLeft: 20 }}
        minimumValue={0}
        maximumValue={300}
        onValueChange={value => this.setState({ priceValue: value })}
        trackStyle={styles.track}
        thumbStyle={styles.thumb}
        minimumTrackTintColor={colors.AppTheme}
      />
      <View style={{ padding: 20, justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text style={eventStyles.commonTxtStyle}>{this.state.priceValue[0].toFixed(0)}</Text>
        <Text style={eventStyles.commonTxtStyle}>{this.state.priceValue[1].toFixed(0)}</Text>
      </View>
    </View>)
  }
  renderCategoryView = () => {
    return(<View style={{marginTop: 10, marginBottom: 10}}>
      <FlatList
        data={this.state.categoryArray}
        numColumns={1}
        renderItem={this.renderCategoryItemCell}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
      />
    </View>)
  }
  renderCategoryItemCell = ({ item, index }) => {
    let check = index == this.state.selectedCategoryIndex ? true : false
    return (
      <TouchableOpacity onPress={() => this.setState({ selectedCategoryIndex: index })}>
        <View style={styles.startViewCellStyle}>
          <Text style={{ textAlign: 'left', fontSize: 16, color: colors.AppGray }}> {item['name']} </Text>
          <View style={commonStyles.nextIconStyle}>
          <Image style={{width:20,height:20,tintColor:check ? colors.AppTheme : colors.Lightgray}} source={check ? selectedradio : radio}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  renderAttriView = () => {
    return(<View style={{marginTop: 10, marginBottom: 10}}>
      <FlatList
        style={{height:'100%',position:'relative'}}
        data={this.state.selectedAttributeArray}
        numColumns={1}
        renderItem={this.renderAttributeItemCell}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
      />
    </View>)
  }
  renderAttributeItemCell = ({ item, index }) => {
    var indx = this.state.selectedAtriValueIds.indexOf(item['id']); // 1
    let check = indx == -1 ? false : true
    return (
      <TouchableOpacity onPress={() => this.didSelectAttributes(item)}>
        <View style={styles.startViewCellStyle}>
          <Text style={{ textAlign: 'left', fontSize: 16, color: colors.AppGray, width: '85%' }}> {item['name']} </Text>
          <View style={commonStyles.nextIconStyle}>
          <Image style={{width:20,height:20,tintColor:check ? colors.AppTheme : colors.Lightgray}} source={check ? selectedradio : radio}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  renderSelectedType = () => {
    if (this.state.selectedFilterIndex == -120) {
      return (<View>
        {this.renderTimeView()}
      </View>)
    } else if (this.state.selectedFilterIndex == -11) {
      return (<View>
        {this.renderDatePostedView()}
      </View>)
    } else if (this.state.selectedFilterIndex == 0) {
      return (<View>
        {this.renderRatingView()}
      </View>)
    } else if (this.state.selectedFilterIndex == 1) {
      return (<View>
        {this.renderDistanceView()}
      </View>)
    } else if (this.state.selectedFilterIndex == -213) {
      return (<View>
        {this.renderPriceView()}
      </View>)
    } else if (this.state.selectedFilterIndex == 2) {
      return (<View>
        {this.renderCategoryView()}
      </View>)
    } else{
      return (<View>
        {this.renderAttriView()}
      </View>)
    }
  }
  // 95 96 71 93 96
  renderSelectFilterView = () => {
    var snapPoint = '50%';
    let maxHeight = '100%'
    var viewHeight = windowHeight/ 2.5;
    // if (this.state.selectedFilterIndex == 1) {
    //   snapPoint = '40%'
    //   viewHeight = windowHeight/ 2;
    // }else if (this.state.selectedFilterIndex == 3) {
    //   snapPoint = '30%'
    //   viewHeight = windowHeight/ 1.5;
    // }
    if (this.state.showTimeBool) {
      return (<View style={{marginTop:'100%', backgroundColor: colors.AppWhite,height:windowHeight/ 2}}>
        {this.renderSliderTimeView()}
      </View>)
    }
    else if (this.state.showFilterView) {
      var title  = ''
      if (this.state.attributesArray[this.state.selectedFilterIndex]['name']) {
        title = this.state.attributesArray[this.state.selectedFilterIndex]['name']
      } else {
        title = this.state.attributesArray[this.state.selectedFilterIndex]
      }
    
      return (<View style={{flex:1}}>
        {/* <ScrollBottomSheet
          componentType="ScrollView"
          snapPoints={[snapPoint, snapPoint, maxHeight]}
          initialSnapIndex={1}
          scrollEnabled={false}
          animationType={'timing'}
          renderHandle={() => ( */}
            <View style={{ backgroundColor: colors.AppWhite, height:windowHeight/ 2, width: '100%', marginTop:viewHeight }}>
            <View style={styles.header}>
              <View style={styles.panelHandle} />
              <View style={{ backgroundColor: colors.AppWhite, height: viewHeight, width: '100%', marginTop: 10 }}>
                <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                  <Text style={{fontSize: 16, fontWeight: '600', paddingLeft: 20}}>{title}</Text>
                    <TouchableOpacity onPress={() => this.setState({ showFilterView: false })}>
                      <Image resizeMode={'center'} style={{ height: 20, width: 20, marginRight: 20 }} source={cancelIcon} />
                    </TouchableOpacity>
                  </View>
                <View style={{height: '70%', marginTop: 10}}>
                  {this.renderSelectedType()}
                </View>
                <View style={{paddingLeft: 16, paddingRight: 16,marginTop:10 }}>
                  <TouchableOpacity style={eventStyles.bottomBtnViewStyle} onPress={()=> this.doneBtnAction()}>
                    <View style={eventStyles.applyBtnViewStyle}>
                      <Text style={{ color: colors.AppWhite, fontWeight: '600' }}>{appConstant.doneTitle ?? 'Done'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            </View>
          {/* )} topInset={false}
          contentContainerStyle={styles.contentContainerStyle}
          onSettle={index => { if (index == 2) { this.setState({showFilterView: false}) }}}
        /> */}
      </View>)
    } else {
      return <View />
    }
  }
  renderSliderTimeView = () => {
    var viewHeight = windowHeight/ 3;
    return (<View>
      <View style={styles.header}>
        <View style={styles.panelHandle} />
        <View style={{ backgroundColor: colors.AppWhite, height: viewHeight, width: '100%', marginTop: 15 }}>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', paddingLeft: 20 }}>{'Time'}</Text>
            <TouchableOpacity onPress={() => this.setState({ showTimeBool: false})}>
              <Image resizeMode={'center'} style={{ height: 20, width: 20, marginRight: 20 }} source={cancelIcon} />
            </TouchableOpacity>
          </View>
          <View style={{ height: '58%', marginTop: 10 }}>
            {this.renderSelectedType()}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, marginTop: -10 }}>
            <TouchableOpacity style={eventStyles.bottomBtnViewStyle} onPress={() => this.doneBtnAction()}>
              <View style={eventStyles.applyBtnViewStyle}>
                <Text style={{ color: colors.AppWhite, fontWeight: '600' }}>Done</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>)
  }
  render() {
    if (this.state.dataLoad) {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={this.state.translationDic['title'] ?? 'Filters'} backBtnIcon={'cross'} showBackBtn={true} backBtnAction={() => this.backBtnAction()} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{height: '97%', backgroundColor: colors.AppWhite }}>
          <View style={{zIndex: 5, position: 'absolute', height: '96%'}}>
            <this.renderListView />
            <this.renderButtonView />
            {/* <View style={{height: 20,backgroundColor: 'red', width: 200}} /> */}
          </View>
          <View style={{zIndex:20, backgroundColor: colors.blackTransparent, height: this.state.showTimeBool || this.state.showFilterView ? '100%' : 0}}>
            <this.renderSelectFilterView />
          </View>
        </View>
      </SafeAreaView>
    );
    } else {
      return <SafeAreaView style={styles.Container}>
                <HeaderView title={''} backBtnIcon={'cross'} showBackBtn={true} backBtnAction={() => this.backBtnAction()} />
        <View style={{ height: '100%', backgroundColor: colors.AppWhite }} />
      </SafeAreaView>
    }
  }
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.AppTheme
  },
  listViewStyle: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: colors.BorderColor,
    padding: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  bottomBtnViewStyle: {
    width: '45%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
    shadowRadius: 2,
    borderRadius: 20,
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
  track: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.LightUltraGray,
  },
  thumb: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: colors.AppTheme,
  },
  startViewCellStyle: {
    justifyContent: 'space-between',
    width: "97%",
    margin: 5,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderColor: colors.BorderColor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    paddingBottom: 10,
  },
  textValueStyle: {
    textAlign: 'left',
    fontSize: 14,
    color: colors.Lightgray,
    marginTop: 5,
  }

});


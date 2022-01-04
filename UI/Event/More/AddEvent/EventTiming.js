import React, { Component } from 'react';
import {
  Platform,
  Text,
  Alert,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import HeaderView from '../../../../Component/Header'
import colors from '../../../../CommonClasses/AppColor';
import CalendarPicker from 'react-native-calendar-picker';
import eventStyles from '../../../../StyleSheet/EventStyleSheet';
import commonStyles from '../../../../StyleSheet/UserStyleSheet';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {changeDateFormat} from '../../../../HelperClasses/SingleTon'
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import ConstantArrays from '../../../../Constants/ConstantArrays';
import radio from '../../../../assets/radio.png';
import selectedradio from '../../../../assets/radioChecked.png';

import APPURL from '../../../../Constants/URLConstants';
import networkService from '../../../../NetworkManager/NetworkManager';
import LangifyKeys from '../../../../Constants/LangifyKeys';
import {AppAlert } from '../../../../HelperClasses/SingleTon';
import tradlyDb from '../../../../TradlyDB/TradlyDB';
import AppConstants from '../../../../Constants/AppConstants';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default class EventTiming extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateUI: false,
      showTimePicker: false,
      selectStartTime:'',
      selectEndTime:'',
      timeIndex: 0,
      selectedDate: '',
      initialDate: Date(),
      showRepeatView:  false,
      repeatSelectedIndex:-1,
      repeatValue: {},
      showCustomView: false,
      selectedWeekDay: [],
      weekDayValue: '',
      id:-1,
      translationDic:{}
    }
  }
  componentDidMount() {
    this.langifyAPI();
    let {eventDateTime,id} = this.props.route.params;
    if (eventDateTime != undefined) {
      this.state.id = id;
      this.state.selectedDate = eventDateTime['date'];
      let dsds = changeDateFormat(eventDateTime['date'],'yyyy-MM-DD')
      this.state.initialDate = new Date(dsds);
      this.state.selectStartTime = eventDateTime['startTime'];
      this.state.selectEndTime = eventDateTime['endTime'];
      if (eventDateTime['repeatClass']) {
        this.state.repeatValue = eventDateTime['repeatClass'] || '';
        if (this.state.repeatValue['repeatIndex']) {
          this.state.repeatSelectedIndex = this.state.repeatValue['repeatIndex'];
        }
      }
    }else {
      this.state.selectedDate = changeDateFormat(Date(),'ddd, D MMM yy');
    }
    this.setState({updateUI: !this.state.updateUI})
  }
  langifyAPI = async () => {
    let searchD = await tradlyDb.getDataFromDB(LangifyKeys.producttime);
    if (searchD != undefined) {
      this.timingTranslationData(searchD);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.producttime}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${AppConstants.appLanguage}${group}`, 'get', '', AppConstants.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      console.log('objc', objc)
      tradlyDb.saveDataInDB(LangifyKeys.producttime, objc)
      this.timingTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  timingTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('storedetail.title' == obj['key']) {
        this.state.translationDic['title'] = obj['value'];
      }  
      if ('storedetail.start_time' == obj['key']) {
        this.state.translationDic['startTime'] = obj['value'];
      }  
      if ('storedetail.end_time' == obj['key']) {
        this.state.translationDic['endTime'] = obj['value'];
      }
      if ('storedetail.select_time' == obj['key']) {
        this.state.translationDic['selectTime'] = obj['value'];
      }
      if ('storedetail.repeat' == obj['key']) {
        this.state.translationDic['repeat'] = obj['value'];
      }
      if ('storedetail.select_repeat' == obj['key']) {
        this.state.translationDic['selectRepeat'] = obj['value'];
      }
      if ('storedetail.daily' == obj['key']) {
        this.state.translationDic['daily'] = obj['value'];
      }
      if ('storedetail.weekdays' == obj['key']) {
        this.state.translationDic['weekdays'] = obj['value'];
      }
      if ('storedetail.weekend' == obj['key']) {
        this.state.translationDic['weekend'] = obj['value'];
      }
      if ('storedetail.custom' == obj['key']) {
        this.state.translationDic['custom'] = obj['value'];
      }
      if ('storedetail.set' == obj['key']) {
        this.state.translationDic['set'] = obj['value'];
      }
      if ('storedetail.set_days' == obj['key']) {
        this.state.translationDic['setDays'] = obj['value'];
      }
      if ('storedetail.sun' == obj['key']) {
        this.state.translationDic['sun'] = obj['value'];
      }
      if ('storedetail.mon' == obj['key']) {
        this.state.translationDic['mon'] = obj['value'];
      }
      if ('storedetail.tue' == obj['key']) {
        this.state.translationDic['tue'] = obj['value'];
      }
      if ('storedetail.wed' == obj['key']) {
        this.state.translationDic['wed'] = obj['value'];
      }
      if ('storedetail.thu' == obj['key']) {
        this.state.translationDic['thu'] = obj['value'];
      }
      if ('storedetail.fri' == obj['key']) {
        this.state.translationDic['fri'] = obj['value'];
      }
      if ('storedetail.sat' == obj['key']) {
        this.state.translationDic['sat'] = obj['value'];
      }
      if ('storedetail.done' == obj['key']) {
        this.state.translationDic['done'] = obj['value'];
      }
      if ('storedetail.end_time_greater_start_error' == obj['key']) {
        this.state.translationDic['endTimeGreater'] = obj['value'];
      }
      if ('storedetail.select_start_time' == obj['key']) {
        this.state.translationDic['selectStartTime'] = obj['value'];
      }
      if ('storedetail.select_end_time' == obj['key']) {
        this.state.translationDic['selectEndTime'] = obj['value'];
      }
      if ('storedetail.select_date' == obj['key']) {
        this.state.translationDic['selectSate'] = obj['value'];
      }
    }
  }
  /*  Buttons   */
  doneBtnAction() {
    if (this.state.selectedDate.length == 0) {
      AppAlert(this.state.translationDic['selectSate'] ?? 'Please select date', AppConstants.okTitle)
    } else if (this.state.selectStartTime.length == 0) {
      AppAlert(this.state.translationDic['selectStartTime'] ?? 'Please select start time', AppConstants.okTitle)
    } else if (this.state.selectEndTime.length == 0) {
      AppAlert(this.state.translationDic['selectEndTime'] ?? 'Please select end time', AppConstants.okTitle)
    } else {
      let dict = {
        date: this.state.selectedDate,
        startTime: this.state.selectStartTime,
        endTime: this.state.selectEndTime,
        repeatClass: this.state.repeatValue,
        repeatIndex:this.state.repeatSelectedIndex,
        id:this.state.id,
      }
      this.props.route.params.getDateTime(dict);
      this.props.navigation.goBack();
    }
  }
  showTimePicker(id) {
    this.state.timeIndex = id
    this.setState({showTimePicker: true})
  }
  onDateChange(date) {
    this.state.selectedDate = changeDateFormat(date,'ddd, D MMM yy')
    // console.log('this.state.selectedDate ',this.state.selectedDate );
    this.setState({updateUI: !this.state.updateUI})
  }
  handleConfirmTime(time){
    var event = new Date(time);
    let eTime = event.toLocaleTimeString('en-US',{hour12: true, hour: "numeric",minute: "numeric"});
    if (this.state.timeIndex == 2) {
      let srttime = Date.parse(`1/1/1999 ${this.state.selectStartTime}`);
      let edTime = Date.parse(`1/1/1999 ${eTime}`) ;
      if (this.state.selectStartTime.length != 0) {
        if (edTime > srttime) {
          this.state.selectEndTime = eTime
        }else {
          AppAlert(this.state.translationDic['endTimeGreater'] ?? 'End time must be greater then start time', AppConstants.okTitle)
        }
      } else {
        AppAlert(this.state.translationDic['selectStartTime'] ?? 'Please select start time', AppConstants.okTitle)
      }
    } else {
      this.state.selectStartTime = eTime
    }

    this.setState({showTimePicker: false})
  };
  setBtnAction() {
    if (this.state.repeatSelectedIndex == 3) {
      if (this.state.showCustomView) {
        var vv = [];
        var ids = [];
        for (let obj of this.state.selectedWeekDay) {
          vv.push(obj['name']);
          ids.push(obj['id']);
        }
        let dic = {
          'name':vv.toString(),
          'id':ids.toString(),
          'repeatIndex':this.state.repeatSelectedIndex,
        }
        this.state.repeatValue = dic;
        this.setState({showCustomView: false, showRepeatView: false});
      }else {
        this.setState({showCustomView: true});
      }
    } else {
      var rptValue = ConstantArrays.repeatArray[this.state.repeatSelectedIndex];
      rptValue['repeatIndex'] = this.state.repeatSelectedIndex;
      this.state.repeatValue = rptValue;
      this.setState({showRepeatView: false});
    }
  }
  didSelectCustomViewCell(item) {
    let ind = this.state.selectedWeekDay.findIndex(x => x.id == item.id)
    if (ind == -1) {
      this.state.selectedWeekDay.push(item);
    } else {
      this.state.selectedWeekDay.splice(ind, 1)
    }
    this.setState({updateUI: !this.state.updateUI})
  }

  /*  UI   */
  renderCalendarView = () => {
    return (<View style={{flex:1}}>
      <CalendarPicker
        minDate={Date()}
        initialDate={this.state.initialDate}
        selectedStartDate={this.state.initialDate}
        onDateChange={date => this.onDateChange(date)}
        selectedDayColor={colors.AppTheme}
        />
    </View>)
  }
  renderDatePicker = (id) => { 
    var value = this.state.translationDic['selectTime'] ?? 'Select Time';
    var label = id['id'] == 1 ? this.state.translationDic['startTime'] ?? 'Start Time' : this.state.translationDic['endTime']  ?? 'End Time';
    if (id['id'] == 1) {
      if (this.state.selectStartTime.length != 0) {
        value = this.state.selectStartTime;
      }
    } else {
      if (this.state.selectEndTime.length != 0) {
        value = this.state.selectEndTime;
      }
    }
    return (<View style={styles.timeViewStyle}>
      <Text style={eventStyles.titleStyle}>{label}</Text>
      <View>
        <TouchableOpacity style={eventStyles.addBntViewStyle} onPress={() => this.showTimePicker(id['id'])}>
          <Text style={{fontSize: 12, fontWeight: '500', color: colors.AppTheme}}>{value}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={this.state.showTimePicker}
          mode="time"
          locale="en"
          onConfirm={time => this.handleConfirmTime(time)}
          onCancel={() => this.setState({showTimePicker: false})}
        />
      </View>
    </View>)

  }
  renderRepeatView = () => {
    let msg = (Object.keys(this.state.repeatValue).length == 0) ? this.state.translationDic['selectRepeat']  ?? 'Select Repeat' : this.state.repeatValue['name'];
    return (<View style={styles.timeViewStyle}>
      <Text style={eventStyles.titleStyle}>{this.state.translationDic['repeat'] ?? 'Repeat'}</Text>
      <View>
        <TouchableOpacity style={eventStyles.addBntViewStyle} onPress={() => this.setState({showRepeatView: true})}>
          <Text style={{fontSize: 12, fontWeight: '500', color: colors.AppTheme}}>{msg}</Text>
        </TouchableOpacity>
      </View>
    </View>)
  }
  renderCustomView = () => {
    return (<View style={{padding: 20}}>
        <Text style={{fontSize: 14, fontWeight: '400'}}>{this.state.translationDic['setDays']  ?? 'Set Days'}</Text>
        <View style={{marginTop: 20}}>
          <FlatList
            data={ConstantArrays.weekDays}
            horizontal={true}
            numColumns={1}
            renderItem={this.renderCustomItemCell}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index}
            showsHorizontalScrollIndicator={false}
          />
        </View>
    </View>)
  }
  renderCustomItemCell = ({item, index }) => {
    let ind = this.state.selectedWeekDay.findIndex(x => x.id == index + 1) 
    let check = ind != -1 ? true : false
    return <TouchableOpacity onPress={() => this.didSelectCustomViewCell(item)}>
    <View style={check ? styles.selectedCustomViewCellStyle : styles.customViewCellStyle}>
      <Text style={{fontSize: 14, color: check ? colors.AppTheme : colors.Lightgray }}> {item['name']} </Text>
    </View>
  </TouchableOpacity>
  }
  renderRepeatAlertView = () => {
    let maxHeight = '100%'
    if (this.state.showRepeatView) {
      var views = [];
      let cHeight = this.state.showCustomView ? '50%' : '40%';
      if (this.state.showCustomView) {
        views.push(<View style={{ height: '40%', marginTop: 16 }}>
          {this.renderCustomView()}
        </View>)
      } else {
        views.push(<View style={{ height: '60%', marginTop: 16 }}>
          {this.renderRepeatListView()}
        </View>)
      }
      return (<View style={{flex:1}}>
        <ScrollBottomSheet
          componentType="ScrollView"
          snapPoints={[cHeight, cHeight , maxHeight]}
          initialSnapIndex={1}
          scrollEnabled={true}
          animationType={'timing'}
          renderHandle={() => (
            <View style={eventStyles.header}>
              <View style={eventStyles.panelHandle} />
              <View style={{backgroundColor: colors.AppWhite, height: windowHeight/2, width: '100%', marginTop: 15 }}>
                <View style={{justifyContent: 'center' }}>
                  <Text style={{fontSize: 16, fontWeight: '600', paddingLeft: 20}}>{this.state.showCustomView ? this.state.translationDic['custom'] ?? `Custom` : this.state.translationDic['repeat'] ?? `Repeat`}</Text>
                </View>
                {views}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, marginTop:-20}}>
                  <TouchableOpacity style={eventStyles.bottomBtnViewStyle} onPress={() => this.setBtnAction()}>
                    <View style={eventStyles.applyBtnViewStyle}>
                      <Text style={{color: colors.AppWhite, fontWeight: '600'}}>{this.state.translationDic['set'] ?? 'Set'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )} topInset={false}
          contentContainerStyle={eventStyles.contentContainerStyle}
          onSettle={index => { if (index == 2) {  this.setState({showRepeatView: false, showCustomView: false}) }}}
        />
      </View>)
    } else {
      return <View />
    }
  }
  renderRepeatListView = () => {
    return (<View >
      <FlatList
        data={ConstantArrays.repeatArray}
        numColumns={1}
        renderItem={this.renderRepeatItemCell}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
      />
    </View>)
  }
  renderRepeatItemCell = ({item, index }) => {
    let check = index == this.state.repeatSelectedIndex ? true : false
    var views = [];
    views.push(<View style={commonStyles.nextIconStyle}> 
        <Image style={{width:20,height:20,tintColor:check ? colors.AppTheme : colors.Lightgray}} source={check ? selectedradio : radio}/>
    </View>)
    return (
      <TouchableOpacity onPress={() => this.setState({repeatSelectedIndex:index})}>
        <View style={eventStyles.listViewStyle}>
          <Text style={{ textAlign: 'left', fontSize: 16, color: colors.AppGray }}> {item['name']} </Text>
          {views}
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={this.state.translationDic['title'] ?? 'Timing'}
          showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}
          showDoneBtn={true} doneBtnAction={() => this.doneBtnAction()}/>
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor}}>
          <View style={{ zIndex: 1, flex:1 }} >
            <View style={{ zIndex: 2, position: 'absolute', flex:1}}>
              <this.renderCalendarView />
              <this.renderDatePicker id={1} />
              <this.renderDatePicker id={2} />
              <this.renderRepeatView />
            </View>
            <View style={{ zIndex: 20,backgroundColor: colors.blackTransparent, height: this.state.showRepeatView ? '100%' : 0  }}>
              <this.renderRepeatAlertView />
            </View>
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
  timeViewStyle: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    backgroundColor:colors.AppWhite,
    height: 60,
    padding: 16,
    alignItems: 'center',
    borderWidth:1,
    borderColor: colors.BorderColor,
  },
  customViewCellStyle:{
    height: 40,
    width: 40,
    borderRadius:5,
    borderWidth: 1,
    borderColor: colors.Lightgray,
    backgroundColor:  colors.AppWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  selectedCustomViewCellStyle:{
    height: 40,
    width: 40,
    borderRadius:5,
    borderWidth: 1,
    borderColor: colors.AppTheme,
    backgroundColor:  colors.LightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  }
});


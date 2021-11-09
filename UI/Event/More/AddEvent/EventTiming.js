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
import radio from '../../../../assets/radio.svg';
import selectedradio from '../../../../assets/radioChecked.svg';
import SvgUri from 'react-native-svg-uri';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const weekDays = [
  {'name':'Sun','id':1},
  {'name':'Mon','id':2},
  {'name':'Tue','id':3},
  {'name':'Wed','id':4},
  {'name':'Thu','id':5},
  {'name':'Fri','id':6},
  {'name':'Sat','id':7}]
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
    }
  }
  componentDidMount() {
    let {eventDateTime} = this.props.route.params;
    if (eventDateTime != undefined) {
      this.state.selectedDate = eventDateTime['date'];
      let dsds = changeDateFormat(eventDateTime['date'],'yyyy-MM-DD')
      this.state.initialDate = new Date(dsds);
      this.state.selectStartTime = eventDateTime['startTime'];
      this.state.selectEndTime = eventDateTime['endTime'];
      this.state.repeatValue = eventDateTime['repeatClass'] || '';
    }
    this.setState({updateUI: !this.state.updateUI})
  }
  /*  Buttons   */
  doneBtnAction() {
    if (this.state.selectedDate.length == 0) {
      Alert.alert('Please select Date time')
    } else if (this.state.selectStartTime.length == 0) {
      Alert.alert('Please select Start time')
    } else if (this.state.selectEndTime.length == 0) {
      Alert.alert('Please select End time')
    } else {
      let dict = {
        date: this.state.selectedDate,
        startTime: this.state.selectStartTime,
        endTime: this.state.selectEndTime,
        repeatClass: this.state.repeatValue
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
          Alert.alert('End time must be greater then start time')
        }
      } else {
        Alert.alert('Please select start time')

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
          'id':ids.toString()
        }
        this.state.repeatValue = dic;
        this.setState({showCustomView: false, showRepeatView: false});
      }else {
        this.setState({showCustomView: true});
      }
    } else {
      this.state.repeatValue = ConstantArrays.repeatArray[this.state.repeatSelectedIndex];
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
    return (<View>
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
    var value = 'Select Time';
    var label = id['id'] == 1 ? 'Start Time' : 'End Time';
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
    let msg = (Object.keys(this.state.repeatValue).length == 0) ? 'Select Repeat' : this.state.repeatValue['name'];
    return (<View style={styles.timeViewStyle}>
      <Text style={eventStyles.titleStyle}>{'Repeat'}</Text>
      <View>
        <TouchableOpacity style={eventStyles.addBntViewStyle} onPress={() => this.setState({showRepeatView: true})}>
          <Text style={{fontSize: 12, fontWeight: '500', color: colors.AppTheme}}>{msg}</Text>
        </TouchableOpacity>
      </View>
    </View>)
  }
  renderCustomView = () => {
    return (<View style={{padding: 20}}>
        <Text style={{fontSize: 14, fontWeight: '400'}}>Set Days</Text>
        <View style={{marginTop: 20}}>
          <FlatList
            data={weekDays}
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
      return (<View>
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
                  <Text style={{fontSize: 16, fontWeight: '600', paddingLeft: 20}}>{this.state.showCustomView ? `Custom` : `Repeat`}</Text>
                </View>
                {views}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, marginTop:-20}}>
                  <TouchableOpacity style={eventStyles.bottomBtnViewStyle} onPress={() => this.setBtnAction()}>
                    <View style={eventStyles.applyBtnViewStyle}>
                      <Text style={{color: colors.AppWhite, fontWeight: '600'}}>Set</Text>
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
        <SvgUri width={20} height={20} source={check ? selectedradio : radio} fill={check ? colors.AppTheme : colors.Lightgray} />
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
        <HeaderView title={'Event Timing'}
          showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}
          showDoneBtn={true} doneBtnAction={() => this.doneBtnAction()}/>
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor }}>
          <View style={{ zIndex: 1}} >
            <View style={{ zIndex: 2, position: 'absolute'}}>
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


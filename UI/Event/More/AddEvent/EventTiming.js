import React, { Component } from 'react';
import {
  Platform,
  TextInput,
  Text,
  Alert,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import NavigationRoots from '../../../../Constants/NavigationRoots';
import HeaderView from '../../../../Component/Header'
import colors from '../../../../CommonClasses/AppColor';
import forwardIcon from '../../../../assets/forward.png';
import CalendarPicker from 'react-native-calendar-picker';
import eventStyles from '../../../../StyleSheet/EventStyleSheet';
import commonStyles from '../../../../StyleSheet/UserStyleSheet';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {changeDateFormat} from '../../../../HelperClasses/SingleTon'


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
    }
    this.setState({updateUI: !this.state.updateUI})
  }
  /*  Buttons   */
  didSelect = (item) => {
    this.state.selectedCurrency = [];
    this.state.selectedCurrency.push(item);
    this.setState({ updateUI: !this.state.updateUI })
  }
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
    console.log('date', date);
    this.state.selectedDate = changeDateFormat(date,'ddd, D MMM yy')
    console.log('', this.state.selectedDate)
    this.setState({updateUI: !this.state.updateUI})
  }
  handleConfirmTime(time){
    console.log('time', time);
    var event = new Date(time);
    let sTime = event.toLocaleTimeString('en-US',{hour12: true, hour: "numeric",minute: "numeric"});
    if (this.state.timeIndex == 2) {
      if (this.state.selectStartTime.length != 0) {
        if (sTime > this.state.selectStartTime) {
          this.state.selectEndTime = sTime
        }else {
          Alert.alert('End time must be greater then start time')
        }
      } else {
        Alert.alert('Please select start time')

      }
    } else {
      this.state.selectStartTime = sTime
    }

    this.setState({showTimePicker: false})
 };
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

  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Event Timing'}
          showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}
          showDoneBtn={true} doneBtnAction={() => this.doneBtnAction()}/>
        <View style={{height: '100%', backgroundColor: colors.LightBlueColor}}>
          <this.renderCalendarView />
          <this.renderDatePicker id={1}/>
          <this.renderDatePicker id={2}/>
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
  }
});


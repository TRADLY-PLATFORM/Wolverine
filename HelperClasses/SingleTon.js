import moment from 'moment';
var React = require('react-native');

var { Dimensions, Platform, PixelRatio, Alert, Linking } = React;
const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;

export function photosPermissionAlert() {
  Alert.alert(
    'Please Allow Photos Permission', "",
    [
      {
        text: "OK", onPress: () => { Linking.openURL('app-settings://') }
      }
    ],
  );
}

export function normalize(size) {
  const newSize = size * scale
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}
export function dateConversionFromTimeStamp(bDate) {
  var ctime = new Date(bDate * 1000);
  let frmt = 'DD-MM-YYYY HH:mm';
  var formatted = moment(ctime).format(frmt);
  return formatted;
}
export function getTimeDifference(sTime, etime) {
  var mm = moment.utc(moment(etime, "HH:mm").diff(moment(sTime, "HH:mm")))
  var d = moment.duration(mm);
  let min = d.asMinutes();
  return min;
}
export function changeDateFormat(bDate, format) {
  var ctime = new Date(bDate);
  var formatted = moment(ctime).format(format);
  return formatted;
}
export function changeUTCFormat(bDate) {
  var ctime = new Date(bDate);
  var formatted = moment(ctime, "YYYY-MM-DDTHH:mm").utc();
  return formatted;
}
export function getTimeFormat(bDate) {
  var st = new Date(bDate * 1000);
  let sTime = st.toLocaleTimeString('en-US', { hour12: true, hour: "numeric", minute: "numeric" });
  return sTime;
}
export function getDatesArray() {
  let startDate = new Date();
  var stopDate = new Date();
  stopDate.setDate(stopDate.getDate() + 30);
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}
export function getNextDate(startDate) {
  let nxtDt = new Date(startDate);;
  nxtDt.setDate(nxtDt.getDate() + 1);
  return nxtDt
}
export function convertTimeinto24Hrs(time) {
  const number = moment(time, ["h:mm A"]).format("HH:mm");
  return number
}
Date.prototype.addDays = function (days) {
  var dat = new Date(this.valueOf())
  dat.setDate(dat.getDate() + days);
  return dat;
}

export function timeAgo(prevDate,translationDic) {
  var ctime = new Date(prevDate);
  var formattedDate = moment(ctime).format("DD MMM YY HH:mm");
  const diff = Number(new Date()) - prevDate;
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;
  const yesterday = 3600 * 24 * 2;
  // console.log('diff= >>>>', diff);
  switch (true) {
    case diff < minute:
      const seconds = Math.round(diff / 1000);
      // return `${seconds > 1 ? `${seconds} secs ago` : ` ${translationDic['just_now'] ?? ''}` ?? 'just now'}`
      return `${translationDic['just_now'] ?? 'just now'}`
    case diff < hour:
      return Math.round(diff / minute) + ` ${translationDic['minutes_ago'] ?? ''}`;
    case diff < day:
      return Math.round(diff / hour) + ` ${translationDic['hours_ago'] ?? ''}`;
    case diff < yesterday: 
      return translationDic['yesterday'] ?? 'yesterday';
    // case diff < month:
    //   return Math.round(diff / day) + ' days ago';
    case diff < year:
      return formattedDate;
    case diff > year:
      return formattedDate;
    default:
      return "";
  }
}
export function validateEmail(emailField) {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(emailField) === false) {
    return false;
  }
  return true;
}
export function AppAlert(title,button) {
  Alert.alert(title, '',
    [
      { text: button ?? 'OK' },
    ],
    { cancelable: false }
  )
}
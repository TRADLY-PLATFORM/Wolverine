import React, {Component} from 'react';
import moment from 'moment';

export function dateConversionFromTimeStamp(bDate) {
  var ctime = new Date(bDate * 1000);
  let frmt = 'DD-MM-YYYY HH:mm';
  var formatted = moment(ctime).format(frmt);
  return formatted;
}
export function changeDateFormat(bDate, format) {
  var ctime = new Date(bDate);
  var formatted = moment(ctime).format(format);
  return formatted;
}
export function getTimeFormat(bDate) {
  var st = new Date(bDate * 1000);
  let sTime = st.toLocaleTimeString('en-US',{hour12: true, hour: "numeric",minute: "numeric"});
  return sTime;
}
export function getDatesArray() {
  var dates = [];
  var startDate = new Date();
  var stopDate = new Date();
  let lm = new Date(stopDate.setMonth(stopDate.getMonth() - 1));
  var currDate = moment(startDate).startOf('day');
  var lastDate = moment(lm).startOf('day');
  while(lastDate.add(1, 'days').diff(currDate) < 0) {
    let fd = lastDate.clone().toDate();
    dates.push(changeDateFormat(fd,'YYYY-MM-DD'));
  }
  dates.push(changeDateFormat(currDate,'YYYY-MM-DD'));

  return dates.reverse()
}

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
  var d = new Date();
  for (let a = 0; a <30; a++ ){
    console.log('a', a);
    let nxtD = d.getDate() + a
    console.log('nxtD',nxtD);
    dates.push(changeDateFormat(nxtD,'YYYY-MM-DD'));
  }
  return dates;
}
export function timeAgo(prevDate){
  const diff = Number(new Date()) - prevDate;
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;
  switch (true) {
      case diff < minute:
          const seconds = Math.round(diff / 1000);
           return `${seconds > 1 ? `${seconds} secs ago` : 'just now'}`
      case diff < hour:
          return Math.round(diff / minute) + ' mins ago';
      case diff < day:
          return Math.round(diff / hour) + ' hrs ago';
      case diff < month:
          return Math.round(diff / day) + ' days ago';
      case diff < year:
          return Math.round(diff / month) + ' mnths ago';
      case diff > year:
          return Math.round(diff / year) + ' years ago';
      default:
          return "";
  }
}
  
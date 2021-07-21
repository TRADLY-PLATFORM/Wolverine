import React, {Component} from 'react';
import Moment from 'moment';

export function dateConversionFromTimeStamp(bDate) {
  var ctime = new Date(bDate * 1000);
  let frmt = 'DD-MM-YYYY HH:mm';
  var formatted = Moment(ctime).format(frmt);
  return formatted;
}
export function changeDateFormat(bDate, format) {
  var ctime = new Date(bDate);
  var formatted = Moment(ctime).format(format);
  return formatted;
}

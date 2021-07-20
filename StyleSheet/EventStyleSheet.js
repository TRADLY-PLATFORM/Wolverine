
'use strict';
var React = require('react-native');
var { StyleSheet, } = React;
import colors from '../CommonClasses/AppColor';


module.exports = StyleSheet.create({
  followContainerStyle: {
    backgroundColor: colors.AppTheme,
    width: 75,
    height: 25,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    color: colors.AppGray,
    fontSize: 14,
    fontWeight: '700'
  },
  subTitleStyle: {
    color: colors.Lightgray,
    fontSize: 12,
    fontWeight: '400',
  },
  clickAbleFieldStyle: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    borderBottomColor: colors.BorderColor,
    borderBottomWidth: 1,
  },
  dottedViewStyle: {
    marginTop: 10,
    borderRadius: 10,
    height: 80,
    borderColor: colors.AppTheme,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
  },
});


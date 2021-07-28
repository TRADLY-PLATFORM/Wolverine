
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
    color: colors.AppBlack,
    fontSize: 14,
    fontWeight: '700'
  },
  subTitleStyle: {
    color: colors.Lightgray,
    fontSize: 12,
    fontWeight: '400',
  },
  commonTxtStyle:{
    fontSize: 14, 
    fontWeight: '500', 
    color: colors.AppGray
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
  addBntViewStyle: {
    backgroundColor: colors.AppWhite,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.AppTheme,
    borderWidth: 1,
    paddingLeft:16,
    paddingRight: 16,
  },
  selectedBntViewStyle: {
    backgroundColor: colors.AppTheme,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft:16,
    paddingRight: 16,
  },
  bottomBtnViewStyle: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 2,
    borderRadius: 20,
  },
  applyBtnViewStyle: {
    borderRadius: 4,
    margin: 5,
    width: '100%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AppTheme,
  },
  selectedBtnTxtStyle:{ 
    fontSize: 12, 
    fontWeight: '500', 
    color: colors.AppWhite
  },
  btnTxtStyle:{ 
    fontSize: 12, 
    fontWeight: '500', 
    color: colors.AppGray
  },
  clearBtnViewStyle : {
    borderRadius: 4,
    borderColor: colors.AppTheme,
    borderWidth: 1,
    margin: 5,
    width: '100%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AppWhite,
  }
});


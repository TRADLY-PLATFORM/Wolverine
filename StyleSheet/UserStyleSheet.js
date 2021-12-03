
'use strict';
var React = require('react-native');
var { StyleSheet,Dimensions,Platform, PixelRatio  } = React;
import colors from '../CommonClasses/AppColor';
import appConstant from '../Constants/AppConstants';

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
  const newSize = size * scale
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) 
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}
module.exports = StyleSheet.create({
  logoImageViewStyle:{
    width: 100,
    height: 100,
    marginTop: 20,
    alignSelf: 'center',
  },
  closeBtnStyle:{height: 20, alignItems: 'flex-end', padding: 20},
  titleStyle: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: '500',
    alignSelf: 'center',
    color: colors.AppWhite,
    textAlign: 'center',
  },
  subTitleStyle:{
    marginTop: 40,
    fontSize: 16,
    alignSelf: 'center',
    color: colors.AppWhite,
    textAlign: 'center',
  },
  roundView: {
    marginTop: 30,
    backgroundColor: colors.lightTransparent,
    marginLeft: "8%",
    marginRight: "8%",
    height: 50,
    borderRadius: 25,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.AppWhite,
    alignItems: 'center'
  },
  txtFieldStyle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.AppWhite,
    textAlign: "left",
    paddingLeft: 10,
    width: "95%",
    marginLeft: 5,
    height: '80%'
  },
  loginBtnStyle: {
    backgroundColor: colors.AppWhite,
    marginLeft: "8%",
    marginRight: "8%",
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTitleStyle: {
    fontSize: 16,
    alignSelf: 'center',
    color: colors.AppTheme,
    textAlign: 'center',
  },
  forgotBtntitleStyle: {
    marginTop: 30,
    fontSize: 18,
    alignSelf: 'center',
    color: colors.AppWhite,
    textAlign: 'center',
  },
  backBtnStyle: {
    height: 20,
    width: 20,
  },
  headerViewStyle: {
    backgroundColor: appConstant.AppTheme,
    justifyContent: 'space-between',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleStyle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.AppWhite,
  },
  gridTitleStyle: {
    fontSize: 12,
    textAlign: 'center'
  },
  themeBtnStyle: {
    backgroundColor: colors.AppTheme,
    marginLeft: "8%",
    marginRight: "8%",
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeTitleStyle: {
    fontSize: 16,
    alignSelf: 'center',
    color: colors.AppWhite,
    textAlign: 'center',
  },
  disableThemeBtnStyle: {
    backgroundColor: colors.Lightgray,
    marginLeft: "8%",
    marginRight: "8%",
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLabelStyle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.Lightgray,
  },
  addTxtFieldStyle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.AppGray,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: colors.BorderColor,
    marginTop: 16,
  },
  txtFieldWithImageStyle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.AppGray,
    paddingBottom: 5,
    // borderBottomWidth: 1,
    borderColor: colors.BorderColor,
    marginTop: 16,
    width: '85%',
  },
  txtViewStyle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.AppGray,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: colors.LightUltraGray,
    marginTop: 16,
    // height: 60,
  },
  selectedViewStyle: {
    borderRadius: 20,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: colors.AppWhite,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.BorderColor,
    borderWidth: 1,
  },
  unSelectedViewStyle: {
    backgroundColor: colors.AppTheme,
    borderRadius: 20,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.BorderColor,
    borderWidth: 1,
  },
  spinnerTextStyle: {
    color: colors.AppTheme,
  },
  upArraowIconStyle: {
    width: 15,
    height: 15,
    alignSelf: 'center',
    transform: [{rotate: '180deg'}],
    marginRight: 10,
    marginTop: 2,
  },
  downArraowIconStyle: {
    width: 15,
    height: 15,
    alignSelf: 'center',
    marginRight: 10,
  },
  nextIconStyle: {
    width: 20,
    height: 20,
    marginRight: 10,
    marginTop: 2,
  },
});


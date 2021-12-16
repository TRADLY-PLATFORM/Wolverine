
'use strict';
var React = require('react-native');
var { StyleSheet, Dimensions} = React;
import colors from '../CommonClasses/AppColor';
const windowWidth = Dimensions.get('window').width;

let customWidth = windowWidth > 720 ? 220 : windowWidth/2.25

module.exports = StyleSheet.create({
  horizontalCellItemStyle: {
    width: customWidth,
    margin: 10,
    backgroundColor: colors.AppWhite,
    borderRadius: 10,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    elevation: 10,
  },
  selectedImageStyle: {
    height: customWidth,
    width: customWidth,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  followContainerStyle: {
    backgroundColor: colors.AppTheme,
    paddingLeft: 10,
    paddingRight: 10,
    height: 25,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    color: colors.AppBlack,
    fontSize: 16,
    fontWeight: '600'
  },
  subTitleStyle: {
    color: colors.Lightgray,
    fontSize: 14,
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
    elevation: 10,
  },
  applyBtnViewStyle: {
    borderRadius: 4,
    margin: 5,
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AppTheme,
  },
  disableApplyBtnViewStyle: {
    borderRadius: 4,
    margin: 5,
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.Lightgray,
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
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AppWhite,
  },
  variantCellViewStyle: {
    flexDirection: 'row',
    margin: 5,
    justifyContent: 'space-between',
    alignContent: 'center',
    borderRadius: 5,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    elevation: 10,
    backgroundColor: colors.AppWhite,
  },
  headerViewStyle: {
    width: '50%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.BorderColor,
  },
  contentContainerStyle: {
    padding: 16,
    backgroundColor: colors.AppWhite,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.AppWhite,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  panelHandle: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4
  },
  listViewStyle: {
    flex:1,
    margin: 5,
    marginLeft: 16,
    marginRight: 16,
    borderBottomWidth: 1,
    borderColor: colors.BorderColor,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  viewOnMapBtnStyle: {
    height: 40,
    backgroundColor: colors.AppWhite,
    flexDirection: 'row',
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    borderRadius: 20,
    elevation: 10,
  
  },
  containerMapStyle: {
    margin:0,
    height: "100%",
    width: "100%",
  },
  mapStyle: {
    position: 'absolute',
    marginTop: 0,
    height: "100%",
    ...StyleSheet.absoluteFillObject,
    borderRadius: 5,
    flex:1
  },
  variantListViewStyle: {
    backgroundColor: colors.AppWhite,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.BorderColor,
  },
  selectedSegmentViewStyle: {
    flex: 1,
    height: 50,
    borderBottomWidth: 3,
    borderBottomColor: colors.AppTheme,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentViewStyle: {
    flex: 1,
    height: 50,
    borderBottomWidth: 3,
    borderBottomColor: colors.BorderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainerViewStyle: {
    padding: 16,
    backgroundColor: colors.AppWhite,
    borderWidth: 1,
    borderColor: colors.LightUltraGray,
  },
});


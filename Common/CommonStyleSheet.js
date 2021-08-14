
'use strict';
var React = require('react-native');

var { StyleSheet, } = React;
import AppColors from './AppColors';
import colors from './AppColors';


module.exports = StyleSheet.create({
  navigationBarContainer: {
    height: 65,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.Appgreen,
    width: '100%'
  },
  navigationBarheaderItemViewStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    height: 120,
    backgroundColor: colors.Appgreen,
    width: '100%',
  },
  backBtnStyle: {
    height: 20,
    width: 20,
  },
  iconsStyle: {
    marginTop: 5,
    height: 25,
    width: 25,
  },
  usersHeader1: {
    marginTop: "10%",
    fontSize: 26,
    fontWeight: '500',
    color: 'white',
    textAlign: "center",
  },
  usersHeader2: {
    marginTop: "4%",
    fontSize: 18,
    fontWeight: '400',
    color: 'white',
    textAlign: "center",
    marginLeft: 20,
    marginRight: 20,
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
    borderColor: 'white',
    alignItems: 'center'
  },
  backBtnStyle: {
    height: 30,
    width: 30,
  },
  textFieldStyle: {
    fontSize: 18,
    fontWeight: '400',
    color: 'white',
    textAlign: "left",
    marginLeft: "6%",
    width: '88%',
    marginRight: '6%'
  },
  mobileTxtFieldStyle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: "left",
    paddingLeft: 5,
    width: "66%"
  },
  countryCodeStyle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 20,
    marginTop: -2,
    color: 'white'
  },
  loginBtnStyle: {
    marginTop: 40,
    backgroundColor: 'white',
    marginLeft: "8%",
    marginRight: "8%",
    height: 50,
    flexDirection: "row-reverse",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPasswordBtnStyle: {
    marginTop: 30,
    color: 'white',
    justifyContent: "center",
    alignItems: "center",
    marginLeft: '10%',
    marginRight: '10%',
    marginBottom: 30,

  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  headerTitle: {
    marginTop: "4%",
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: "center",
    marginLeft: 10,
    marginRight: 10,
    width: '100%',
  },
  headerSubTitle: {
    marginTop: "4%",
    fontSize: 14,
    fontWeight: '400',
    color: 'white',
    textAlign: "center",
    marginLeft: 40,
    marginRight: 40,
  },
  progressViewStyle:
  {
    height: 5,
    width: '100%',
    backgroundColor: colors.Lightgray,
  },
  submitBtnStyle: {
    marginTop: 30,
    backgroundColor: colors.Appgreen,
    marginLeft: "8%",
    marginRight: "8%",
    height: 45,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    marginBottom: 20,
  },
  scrollContainer: {
    backgroundColor: colors.backGroundBlueColor,
    width: '100%',
  },

});


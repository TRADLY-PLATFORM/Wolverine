import React, { Component } from 'react';
import {
  FlatList,
  TextInput,
  Text,
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import NavigationRoots from '../../../Constants/NavigationRoots';
import HeaderView from '../../../Component/Header'
import colors from '../../../CommonClasses/AppColor';
import commonStyles from '../../../StyleSheet/UserStyleSheet';
import sample from '../../../assets/dummy.png';
import eventStyles from '../../../StyleSheet/EventStyleSheet';
import timeIcon from '../../../assets/timeIcon.png';
import starIcon from '../../../assets/star.png';
import heartIcon from '../../../assets/heartIcon.png';
import filterGrayIcon from '../../../assets/filterGrayIcon.png';
import sortIcon from '../../../assets/sortIcon.png';
import viewMapIcon from '../../../assets/viewMapIcon.png';
import APPURL from '../../../Constants/URLConstants';
import networkService from '../../../NetworkManager/NetworkManager';
import appConstant from '../../../Constants/AppConstants';
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import radio from '../../../assets/radio.png';
import selectedradio from '../../../assets/selectedradio.png';
import {getTimeFormat,changeDateFormat,getDatesArray} from '../../../HelperClasses/SingleTon'
import constantArrays from '../../../Constants/ConstantArrays';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: 0,
      photo: null,
      updateUI: false,
    }
  }
  componentDidMount() {
    console.log('appConstant.token', appConstant.firebaseToken)
    auth()
    .signInWithCustomToken(appConstant.firebaseToken)
    .then(() => {
      console.log('User signed in anonymously');
      this.getChatThread()
    })
    .catch(error => {
      if (error.code === 'auth/operation-not-allowed') {
        console.log('Enable anonymous in your firebase console.');
      }
      console.error('auth error==> ',error);
    });
  }
  getChatThread() {
    console.log('calling chat api');
    database().ref('tradly_dev/').once('value').then(snapshot => {
      console.log('User data: ', snapshot.val());
    });
  }
 
  /*  UI   */


  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Chat'} showBackBtn={false} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '100%', backgroundColor: colors.AppWhite }}>
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
});


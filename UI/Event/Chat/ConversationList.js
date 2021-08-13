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
import {timeAgo,changeDateFormat} from '../../../HelperClasses/SingleTon'
import constantArrays from '../../../Constants/ConstantArrays';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


export default class ConversationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: 0,
      photo: null,
      updateUI: false,
      loadData: false,
      conversationArray: [],
      isVisible: false,
    }
  }
  componentDidMount() {
    this.getChatThread();
  }
  getChatThread() {
    console.log('calling chat api', appConstant.userId);
    var UID = appConstant.userId == '22800ba8-49eb-4a4b-be63-ec366fb25e9c' ? '3f8e07a9-e509-4f2a-a1d3-0d4f9f524d54' : '692ee113-310b-4e66-b5b5-33796f9616e3';
    this.state.conversationArray =  []; 
    database().ref(`${appConstant.firebaseChatPath}users/${UID}/chatrooms`).once('value').then(snapshot => {
      console.log('get User data: ', snapshot.val());
      if (snapshot.val() != null){
        let object = Object.keys(snapshot.val())
        let dataObj = Object.values(snapshot.val())
        dataObj[0]['chatrooms'] = object[0];
        this.state.conversationArray.push(dataObj[0]);
      }
      this.setState({updateUI: !this.state.updateUI, loadData: true, isVisible: false})
    });
  }
  /*  Buttons   */
  chatBtnAction() {
    this.props.navigation.navigate(NavigationRoots.ChatScreen);
  }
  
  
  /*  UI   */

  renderConversationListView = () => {
    if (this.state.conversationArray.length != 0){
    return (
      <View style={{ width: '100%', height: '100%'}}>
        <FlatList
          data={this.state.conversationArray}
          renderItem={this.renderListViewCellItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          ref={(ref) => (this.FlatListRef = ref)}
        />
      </View>
    )
  }else {
      return (<View style={{ height: '90%', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.AppWhite }}>
        <Text style={eventStyles.commonTxtStyle}> No conversation yet</Text>
      </View>)
  }
  }
  renderListViewCellItem = ({ item, index }) => {
    console.log('dateFr',timeAgo(new Date(item['lastUpdated']).getTime()))
    let time = timeAgo(new Date(item['lastUpdated']).getTime());
    return (<TouchableOpacity style={{ padding: 16, flexDirection: 'row',justifyContent: 'space-between' }} onPress={() => this.chatBtnAction()}>
      <View style={{flexDirection: 'row'}}>
        <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={sample} />
        <View style={{ marginLeft: 10, justifyContent: 'center' }}>
          <Text style={eventStyles.titleStyle}>{item['receiver']}</Text>
          <View style={{ height: 5 }} />
          <Text style={eventStyles.commonTxtStyle}>{item['lastMessage']}</Text>
        </View>
      </View>
      <View style={{alignItems: 'flex-end',}}>
        <Text style={{fontSize: 14, color: colors.Lightgray}}>{time}</Text>
      </View>
    </TouchableOpacity>)
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Conversation'} showBackBtn={false} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '93%', backgroundColor: colors.AppWhite }}>
          <this.renderConversationListView />
          <View style={{height: 10}}/>
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


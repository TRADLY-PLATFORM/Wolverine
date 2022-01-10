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
import appConstant from '../../../Constants/AppConstants';
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
import {timeAgo} from '../../../HelperClasses/SingleTon'
import database from '@react-native-firebase/database';

import APPURL from '../../../Constants/URLConstants';
import networkService from '../../../NetworkManager/NetworkManager';
import AppMessages from '../../../Constants/AppMessages';
import LangifyKeys from '../../../Constants/LangifyKeys';
import {AppAlert } from '../../../HelperClasses/SingleTon';
import tradlyDb from '../../../TradlyDB/TradlyDB';

export default class ConversationList extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: 0,
      photo: null,
      updateUI: false,
      loadData: false,
      conversationArray: [],
      isVisible: false,
      translationDic: {},
    }
  }
  componentDidMount() {
    this.langifyAPI();
    this.props.navigation.addListener('focus', () => {
      console.log('focus')
      this._isMounted = true;
      if (appConstant.loggedIn) {
        this.getConvesationThread();
      } 
    })
  }
  componentWillUnmount() {
    this._isMounted = false;
    this.setState({updateUI: !this.state.updateUI});
  }
  langifyAPI = async () => {
    let productD = await tradlyDb.getDataFromDB(LangifyKeys.chat);
    if (productD != undefined) {
      this.chatTranslationData(productD);
      this.setState({ updateUI: true})
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.chat}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${appConstant.appLanguage}${group}`, 'get', '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(LangifyKeys.chat, objc)
      this.chatTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  chatTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('chat.header_title' == obj['key']) {
        this.state.translationDic['title'] = obj['value'];
      }  
      if ('chat.no_messages' == obj['key']) {
        this.state.translationDic['no_messages'] = obj['value'];
      }
      if ('chat.hours_ago' == obj['key']) {
        this.state.translationDic['hours_ago'] = obj['value'];
      }
      if ('chat.just_now' == obj['key']) {
        this.state.translationDic['just_now'] = obj['value'];
      }
      if ('chat.minute_ago' == obj['key']) {
        this.state.translationDic['minute_ago'] = obj['value'];
      }
      if ('chat.minutes_ago' == obj['key']) {
        this.state.translationDic['minutes_ago'] = obj['value'];
      }
      // product.clear_cart
    }
  }
  getConvesationThread() {
    var UID = appConstant.userId // = '692ee113-310b-4e66-b5b5-33796f9616e3' ? 'e4f5103d-5d33-4c61-ab8e-e561d6a3e991' : '692ee113-310b-4e66-b5b5-33796f9616e3';
    this.state.conversationArray = [];
    database().ref(`${appConstant.firebaseChatPath}users/${UID}/chatrooms`).once('value').then(snapshot => {
      // console.log('snapshot.val() ', snapshot.val() )
      if (snapshot.val() != null) {
        let object = Object.keys(snapshot.val())
        let dataObj = Object.values(snapshot.val())
        for (let o = 0; o < dataObj.length; o++) {
          var dic = dataObj[o];
          dic['chatRoomId'] = object[o];
          if (dataObj[o]['lastMessage']) {
            if (dataObj[o]['lastMessage'].length != 0) {
              this.state.conversationArray.push(dic);
            }
          }
        }
      }
      this.setState({ updateUI: !this.state.updateUI, loadData: true, isVisible: false })
    }).catch(error => {
      console.log('error', error)
      this.setState({ updateUI: !this.state.updateUI, loadData: true, isVisible: false })
    })
  }
  /*  Buttons   */
  chatBtnAction(item) {
    let chatRoomId = item['chatRoomId'];
    this.props.navigation.navigate(NavigationRoots.ChatScreen, {
      chatRoomId: chatRoomId,
      name: item['receiver'],
      receiverId:item['receiverId'],
    });
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
        <Text style={eventStyles.commonTxtStyle}> {this.state.translationDic['no_messages'] ?? 'No conversation yet'}</Text>
      </View>)
  }
  }
  renderListViewCellItem = ({ item, index }) => {
    let photo  = item['profilePic'] ?? ''
    let profilePic = photo.length == 0 ? sample : {uri:photo}
    let time = timeAgo(new Date(item['lastUpdated']).getTime(),this.state.translationDic);
    return (<TouchableOpacity style={{ padding: 16, flexDirection: 'row',justifyContent: 'space-between' }} onPress={() => this.chatBtnAction(item)}>
      <View style={{flexDirection: 'row',flex:1,}}>
        <FastImage style={{ height: 50, width: 50, borderRadius: 25 }} source={profilePic} />
        <View style={{ marginLeft: 10, justifyContent: 'center',width:'84%'}}>
          <View style={{flexDirection: 'row',justifyContent: 'space-between',width: '100%'}}>
            <View style={{flex:1}}>
              <Text style={eventStyles.titleStyle}>{item['receiver']}</Text>
            </View>
            <Text style={{ fontSize: 14, color: colors.Lightgray, textAlign: 'right' }}>{time}</Text>
          </View>
          <View style={{ height: 2 }} />
          <Text style={eventStyles.commonTxtStyle} numberOfLines={2}>{item['lastMessage']}</Text>
        </View>
      </View>
    
    </TouchableOpacity>)
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={this.state.translationDic['title']?? 'Chats'} showBackBtn={false} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ flex:1, backgroundColor: colors.AppWhite }}>
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



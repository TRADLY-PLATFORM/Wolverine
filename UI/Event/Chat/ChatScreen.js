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
  KeyboardAvoidingView,
  Dimensions,
  Platform,
} from 'react-native';
import HeaderView from '../../../Component/Header'
import colors from '../../../CommonClasses/AppColor';
import commonStyles from '../../../StyleSheet/UserStyleSheet';
import sample from '../../../assets/dummy.png';
import attachIcon from '../../../assets/attachIcon.png';
import sendIcon from '../../../assets/sendIcon.png';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image'
import appConstant from '../../../Constants/AppConstants';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-crop-picker';
import {timeAgo} from '../../../HelperClasses/SingleTon'
import {sendMessage,createChat} from '../../../Firebase/ChatSetup';
import database from '@react-native-firebase/database';


import APPURL from '../../../Constants/URLConstants';
import networkService from '../../../NetworkManager/NetworkManager';
import LangifyKeys from '../../../Constants/LangifyKeys';
import tradlyDb from '../../../TradlyDB/TradlyDB';

const keyboardVerticalOffset = Platform.OS === 'ios' ? 50 : 0


export default class ChatScreen extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: 0,
      photo: null,
      updateUI: false,
      chatArray: [],
      message: '',
      chatRoomId: '',
      receiverId:'',
      titleName: '',
      translationDic:{},
    }
    this.getChatThread = this.getChatThread.bind(this);
  }
  componentDidMount() {
    this.setupChat() 
    this.langifyAPI()
  }

  componentWillUnmount(){
    this.state.chatArray = [];
    this.setState({updateUI: !this.state.updateUI})
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
      if ('chat.write_here' == obj['key']) {
        this.state.translationDic['write_here'] = obj['value'];
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
      if ('chat.yesterday' == obj['key']) {
        this.state.translationDic['yesterday'] = obj['value'];
      }
      // 
      // product.clear_cart
    }
  }

  setupChat = async () => {
    let {receiverData} = this.props.route.params;
    if (receiverData != undefined) {
      let name = `${receiverData['first_name']} ${receiverData['last_name']}`;
      this.state.titleName = name;
      let profile = `${receiverData['profile_pic']}`;
      var UID = receiverData['id'] 
      this.state.receiverId = UID;
      console.log('UID',UID)
      createChat(UID, name, profile, chatRoomId => {
        this.state.chatRoomId = chatRoomId
        this.getChatThread(chatRoomId);
      })
    } else {
      let { chatRoomId,name,receiverId } = this.props.route.params;
      this.state.chatRoomId = chatRoomId
      this.state.titleName = name;
      this.state.receiverId = receiverId;
      this.getChatThread(chatRoomId);
    }
    this.setState({updateUI: !this.state.updateUI})
  }
  getChatThread = (chatRoomId) => {
    this.state.chatArray = [];
    database().ref(`${appConstant.firebaseChatPath}chats/${chatRoomId}/messages`).on('child_added', snapshot => {
        if (snapshot.val() != null){
          this.state.chatArray.push(snapshot.val());
          setTimeout(() => {
            if (this.state.chatArray != 0) {
              if(this._scrollView != null){
                this.scrollView.scrollToEnd();
               }
              // this.FlatListRef.scrollToEnd();
            }
          }, 500);
        }
      // this.setState({updateUI: !this.state.updateUI})
    });
    setTimeout(() => {
      if (this.state.chatArray != 0) {
        this.scrollView.scrollToEnd();
      }
    }, 500);
  }
  /*  Buttons   */

  sendBtnAction = () => {
    let chatRoomId = this.state.chatRoomId;
    let receiverId = this.state.receiverId;
    let sMsg = {
      "message":this.state.message,
      "timeStamp": Date.now(),
       "username":appConstant.userName,
       "userId":appConstant.userId,
       "mimeType":'text',
       "fileName":''
    }
    sendMessage(this.state.message,sMsg,chatRoomId,receiverId,'text')
    this.state.message = '';
    this.setState({updateUI: !this.state.updateUI})
    setTimeout(() => {
      if (this.state.chatArray != 0) {
        // this.FlatListRef.scrollToEnd();
        this.scrollView.scrollToEnd();
      }
    }, 500);
  }

  /*  UI   */
  imagePicker() {
    ImagePicker.openPicker({
      height: 1000,
      width: 1000,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      this.state.photo = image;
      this.setState({ updateUI: !this.state.updateUI })
    });
  }
  renderChatView = () => {
    // return (
    //   <View style={{ width: '100%', height: '100%',padding:5}}>
    //     <FlatList
    //       initialNumToRender={10}
    //       ref={ref => this.FlatListRef = ref}
    //       onContentSizeChange={() => this.FlatListRef.scrollToEnd()}
    //       onLayout={() => this.FlatListRef.scrollToEnd({animated: true})}
    //       removeClippedSubviews={false}
    //       data={this.state.chatArray}
    //       renderItem={this.renderChatViewCellItem}
    //       showsVerticalScrollIndicator={false}
    //       keyExtractor={(item, index) => index}
    //     />
    //   </View>
    // )

    var chatView = [];
    for (let a = 0; a < this.state.chatArray.length; a++) {
      let item = this.state.chatArray[a];
      chatView.push(<View>
        {this.renderChatViewCellItem({ item: item, index: a })}
      </View>)
    }
    return chatView
  }
  renderChatViewCellItem = ({item, index}) => {
    if (item['userId'] == appConstant.userId) {
      return (<View style={{padding:2}}> 
        {this.renderRightView(item)} 
      </View>)
    } else {
      return (<View style={{padding:4}}> 
        {this.renderLeftView(item)} 
      </View>)
    }
  }
  renderLeftView = (item) => {
    // console.log('item === ',item);
    let time = timeAgo(new Date(item['timeStamp']).getTime(),this.state.translationDic);
    // console.log('time',time);
    // if (index == 3) {
    //   return (<View style={styles.leftViewStyle}>
    //     <Image style={styles.photoViewStyle}  source={sample} />
    //     <Text style={styles.timeViewStyle}>07:22 PM</Text>
    //   </View>)
    // } else {
      return (<View style={styles.leftViewStyle}>
        <Text style={styles.msgTextStyle}>{item['message']}</Text>
        <Text style={styles.timeViewStyle}>{time}</Text>
      </View>)
    // }
  }
  renderRightView = (item) => {
    let time = timeAgo(new Date(item['timeStamp']).getTime(),this.state.translationDic);
    // if (index == 18) {
    //   return (<View style={styles.rightViewStyle}>
    //     <FastImage style={styles.photoViewStyle} source={this.state.photo == null ? sample : {uri: this.state.photo['path']}} />
    //     <Text style={styles.timeViewStyle}>07:22 PM</Text>
    //   </View>)
    // } else {
    return (<View style={styles.rightViewStyle}>
        <Text style={styles.msgTextStyle}>{item['message']}</Text>
        <Text style={styles.timeViewStyle}>{time}</Text>
    </View>)
    // }
  }

  renderSendMsgView = () => {
    return (<View style={{flexDirection: 'row', alignItems: 'center',margin: 10}}>
      <View style={styles.bottomViewStyle}>
        <View style={{ width: '87%', justifyContent: 'center',paddingLeft:10,paddingRight:10}}>
          <TextInput
            value={this.state.message}
            onChangeText={txt => this.setState({message: txt})}
            style={styles.msgTextStyle}
            placeholder={`${this.state.translationDic['write_here']}...`}/>
        </View>
        {/* <TouchableOpacity style={styles.attachmentViewStyle} onPress={() => this.imagePicker()}>
          <Image style={{ height: 20, width: 20 }} source={attachIcon} />
        </TouchableOpacity> */}
      </View>
      <View>
        <LinearGradient style={styles.enableSendBtnViewStyle}
          colors={this.state.message.length == 0 ? [colors.Lightgray, colors.AppGray] : [colors.GradientTop, colors.GradientBottom]}>
          <TouchableOpacity disabled={this.state.message.length == 0 ? true : false} onPress={() => this.sendBtnAction()}>
            <Image style={{ height: 25, width: 25, top: 2, right: 2 }} source={sendIcon} />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>)
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={this.state.titleName} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}/>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '98%', backgroundColor: colors.LightBlueColor}}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} keyboardVerticalOffset={keyboardVerticalOffset}>
            <View style={{ height: '100%', justifyContent: 'space-between' }}>
              <ScrollView  ref={(view) => {this.scrollView = view}}>
                {/* <View style={{ flex: 1, marginBottom: 5 }}> */}
                  <this.renderChatView />
                {/* </View> */}
              </ScrollView>
              <View>
                <this.renderSendMsgView />
                <View style={{ height: 45 }} />
              </View>
            </View>
          </KeyboardAvoidingView>
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
  leftViewStyle: {
    margin: 10,
    marginTop: 10,
    marginBottom: 0,
    padding: 10, 
    borderRadius: 10, 
    borderTopLeftRadius: 0,
    paddingBottom: 10,
    backgroundColor:colors.LightGreen,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 5 },
    shadowRadius: 2,
    elevation: 10,
    alignSelf: 'flex-start',
  },
  timeViewStyle: {
    color: colors.Lightgray,
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    fontSize: 12,
    marginBottom: -5,
    marginTop: 2
  },
  rightViewStyle: {
    margin: 10,
    marginTop: 10,
    marginBottom: 0,
    padding: 10, 
    borderRadius: 10, 
    borderBottomRightRadius: 0,
    paddingBottom: 10,
    backgroundColor:colors.AppWhite,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 5 },
    shadowRadius: 2,
    elevation: 10,
    alignSelf: 'flex-end',
  },
  bottomViewStyle: {
    height: 50, 
    borderRadius: 25,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    backgroundColor: colors.AppWhite,
    margin: 5,
    elevation: 10,
    flexDirection: 'row',
    width: '80%',
  },
  attachmentViewStyle: {
    alignItems: 'center', justifyContent: 'center',
  },
  enableSendBtnViewStyle: {
    height: 50, 
    width:  50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    elevation: 10,
    backgroundColor: colors.AppTheme,
    marginLeft: 10,
   },
   msgTextStyle:{
     fontSize: 16,
     color: colors.AppGray,
     paddingLeft: 5,
   },
   photoViewStyle: {
    width:180, height: 200, marginBottom: 5 
   }
});


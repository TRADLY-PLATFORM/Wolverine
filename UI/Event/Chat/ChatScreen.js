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
import NavigationRoots from '../../../Constants/NavigationRoots';
import HeaderView from '../../../Component/Header'
import colors from '../../../CommonClasses/AppColor';
import commonStyles from '../../../StyleSheet/UserStyleSheet';
import sample from '../../../assets/dummy.png';
import eventStyles from '../../../StyleSheet/EventStyleSheet';
import attachIcon from '../../../assets/attachIcon.png';
import sendIcon from '../../../assets/sendIcon.png';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image'

import APPURL from '../../../Constants/URLConstants';
import networkService from '../../../NetworkManager/NetworkManager';
import appConstant from '../../../Constants/AppConstants';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-crop-picker';
import {getTimeFormat,changeDateFormat,getDatesArray} from '../../../HelperClasses/SingleTon'
import constantArrays from '../../../Constants/ConstantArrays';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const keyboardVerticalOffset = Platform.OS === 'ios' ? 50 : 0


export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: 0,
      photo: null,
      updateUI: false,
      chatArray: [],
      message: '',

    }
  }
  componentDidMount() {
    this.getChatThread();
    setTimeout(() => {
      this.FlatListRef.scrollToEnd();
    }, 1500);
  }
  getChatThread() {
    console.log('calling chat api',`${appConstant.firebaseChatPath}chats/1623653953344/messages`);
    var UID = appConstant.userId == '22800ba8-49eb-4a4b-be63-ec366fb25e9c' ? '3f8e07a9-e509-4f2a-a1d3-0d4f9f524d54' : '692ee113-310b-4e66-b5b5-33796f9616e3';

    let daa = database().ref(`${appConstant.firebaseChatPath}chats/1623653953344/messages`).on('child_added', snapshot => {
      console.log('A new node has been added', snapshot.val());
    });
  }
  /*  UI   */
  imagePicker() {
    ImagePicker.openPicker({
      height: 300,
      width: 200,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      this.state.photo = image;
      this.setState({ updateUI: !this.state.updateUI })
    });
  }
  renderChatView = () => {
    return (
      <View style={{ width: '100%'}}>
        <FlatList
          data={[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}
          renderItem={this.renderChatViewCellItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          ref={(ref) => (this.FlatListRef = ref)}
        />
      </View>
    )
  }
  renderChatViewCellItem = ({item, index}) => {
    if (index%2 == 0) {
      return (<View >
        {this.renderRightView(index)}
      </View>)
    } else {
      return(
        <View>
          {this.renderLeftView(index)}
        </View>
      )
    }
  }
  renderLeftView = (index) => {
    if (index == 3) {
      return (<View style={styles.leftViewStyle}>
        <Image style={styles.photoViewStyle}  source={sample} />
        <Text style={styles.timeViewStyle}>07:22 PM</Text>
      </View>)
    } else {
      return (<View style={styles.leftViewStyle}>
        <Text style={styles.msgTextStyle}> I wanted to  figure out how many lines a text has and to figure the width of the lines </Text>
        <Text style={styles.timeViewStyle}>07:22 PM</Text>
      </View>)
    }
  }
  renderRightView = (index) => {
    if (index == 18) {
      return (<View style={styles.rightViewStyle}>
        <FastImage style={styles.photoViewStyle} source={this.state.photo == null ? sample : {uri: this.state.photo['path']}} />
        <Text style={styles.timeViewStyle}>07:22 PM</Text>
      </View>)
    } else {
    return (<View style={styles.rightViewStyle}>
      <Text style={styles.msgTextStyle}>{`${index}`} we the</Text>
      <Text style={styles.timeViewStyle}>07:22 PM</Text>
    </View>)
    }
  }

  renderSendMsgView = () => {
    return (<View style={{flexDirection: 'row', alignItems: 'center',margin: 10}}>
      <View style={styles.bottomViewStyle}>
        <View style={{ width: '87%', justifyContent: 'center',padding: 10}}>
          <TextInput
            onChangeText={txt => this.setState({message: txt})}
            style={styles.msgTextStyle}
            placeholder={'Write here ...'}/>
        </View>
        <TouchableOpacity style={styles.attachmentViewStyle} onPress={() => this.imagePicker()}>
          <Image style={{ height: 20, width: 20 }} source={attachIcon} />
        </TouchableOpacity>
      </View>
      <View>
        <LinearGradient style={styles.enableSendBtnViewStyle}
          colors={this.state.message.length == 0 ? [colors.Lightgray, colors.AppGray] : [colors.GradientTop, colors.GradientBottom]}>
          <TouchableOpacity disabled={this.state.message.length == 0 ? true : false} >
            <Image style={{ height: 25, width: 25, top: 2, right: 2 }} source={sendIcon} />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>)
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Chat'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}/>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '97%', backgroundColor: colors.LightBlueColor}}>
          <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset}>
            <View style={{height: '97%', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <this.renderChatView />
            </View>
            <View>
              <this.renderSendMsgView />
              {/* <View style={{ height: 0 }} /> */}
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


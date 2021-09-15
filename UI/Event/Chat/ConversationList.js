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
      isVisible: true,
    }
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
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
  getConvesationThread() {
    var UID = appConstant.userId // = '692ee113-310b-4e66-b5b5-33796f9616e3' ? 'e4f5103d-5d33-4c61-ab8e-e561d6a3e991' : '692ee113-310b-4e66-b5b5-33796f9616e3';
    this.state.conversationArray = [];
    database().ref(`${appConstant.firebaseChatPath}users/${UID}/chatrooms`).once('value').then(snapshot => {
      // console.log('snapshot.val() ', snapshot.val() )
      if (snapshot.val() != null) {
        let object = Object.keys(snapshot.val())
        let dataObj = Object.values(snapshot.val())
        for (let o = 0; o <dataObj.length; o++) {
          var dic = dataObj[o];
          dic['chatRoomId'] = object[o];
          if (dataObj[o]['lastMessage'].length != 0) {
            this.state.conversationArray.push(dic);
          }
        }
       
      }
      this.setState({ updateUI: !this.state.updateUI, loadData: true, isVisible: false })
    });
  }
  /*  Buttons   */
  chatBtnAction(item) {
    let chatRoomId = item['chatRoomId'];
    this.props.navigation.navigate(NavigationRoots.ChatScreen, {
      chatRoomId: chatRoomId,
      name: item['receiver'],
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
        <Text style={eventStyles.commonTxtStyle}> No conversation yet</Text>
      </View>)
  }
  }
  renderListViewCellItem = ({ item, index }) => {
    let time = timeAgo(new Date(item['lastUpdated']).getTime());
    return (<TouchableOpacity style={{ padding: 16, flexDirection: 'row',justifyContent: 'space-between' }} onPress={() => this.chatBtnAction(item)}>
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
        <HeaderView title={'Chats'} showBackBtn={false} />
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


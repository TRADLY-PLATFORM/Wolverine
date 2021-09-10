
import React, { Component } from 'react';
import {
  FlatList, Alert, Linking, Text, Image, View,
  StyleSheet, SafeAreaView, TouchableOpacity, ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../CommonClasses/AppColor';
import NavigationRoots from '../../../Constants/NavigationRoots';
import sample from '../../../assets/dummy.png';
import editIcon from '../../../assets/editIcon.png';
import appConstant from '../../../Constants/AppConstants';
import APPURL from '../../../Constants/URLConstants';
import networkService from '../../../NetworkManager/NetworkManager';
import DefaultPreference from 'react-native-default-preference';
import Spinner from 'react-native-loading-spinner-overlay';
import commonStyles from '../../../StyleSheet/UserStyleSheet';
import appMsg from '../../../Constants/AppMessages';

import constantArrays from '../../../Constants/ConstantArrays';
import FastImage from 'react-native-fast-image';

export default class More extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      accountId: 0,
      updateUI: false,
      email: '',
      name: '',
      profilePic: '',
      loadData: false,
      userDetailData: {},
    }
  }
  componentDidMount() {
    // this.getUserDetailApi();
    // this.getMyStoreApi();
    this.props.navigation.addListener('focus', () => {
      if (appConstant.loggedIn) {
          console.log('calling');
          this.setState({ isVisible: true })
          this.state.loadData = true
          this.getUserDetailApi();
          this.getMyStoreApi();
          // this.setState({updateUI: !this.state.updateUI})
      }
    });
  }
  getUserDetailApi = async () => {
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.users}${appConstant.userId}`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let uData = responseJson['data']['user'];
      this.state.userDetailData = uData;
      this.state.email = uData['email'];
      this.state.profilePic = uData['profile_pic']
      this.state.name = `${uData['first_name']} ${uData['last_name']}`;
      this.setState({updateUI: !this.state.updateUI, loadData: true})
    }else {
      this.setState({ isVisible: false })
    }
  }
  getMyStoreApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.accounts}?user_id=${appConstant.userId}&page=1&type=accounts`, 'get', '', appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      let acctData = responseJson['data']['accounts'];
      if (acctData.length != 0) {
        this.setState({ accountId: acctData[0]['id'] })
      }
      this.setState({ updateUI: !this.state.updateUI, isVisible: false})
    } else {
      this.setState({ isVisible: false })
    }
  }
  /*  Buttons   */
  settingBtnAction() {
    this.props.navigation.navigate(NavigationRoots.Profile)
  }
  editBtnAction() {
    this.props.navigation.navigate(NavigationRoots.Profile, {
      userData:this.state.userDetailData,
    })
  }
  logoutBtnAction() {
    Alert.alert(
      appMsg.logoutMsg, "",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "OK", onPress: () => {
            DefaultPreference.set('loggedIn', 'false').then( () => { 
              appConstant.loggedIn = false;
              this.setState({ updateUI: !this.state.updateUI})
              this.props.navigation.navigate(NavigationRoots.SignIn)
            });  
          }
        }
      ],
    );
  }
  didSelectList = ({ index }) => {
    if (index == 4) {
      Linking.openURL(appConstant.termCondition);
    }
    else if (index == 5) {
      Linking.openURL(appConstant.privacyURL);
    }
    else if (index == 6) {
      this.props.navigation.navigate(NavigationRoots.InviteFriend);
    } else {
      if (appConstant.loggedIn) {
        if (index == constantArrays.menuArray.length - 1) {
          this.logoutBtnAction()
        } else if (index == 0) {
          if (this.state.accountId != 0) {
            this.props.navigation.navigate(NavigationRoots.MyStore, { accId: this.state.accountId });
          } else {
            this.props.navigation.navigate(NavigationRoots.CreateStore);
          }
        } else if (index == 1) {
          if (this.state.accountId == 0) {
            this.props.navigation.navigate(NavigationRoots.CreateStore);
          } else {
            this.props.navigation.navigate(NavigationRoots.PaymentScreen);
          }
        } else if (index == 2) {
          this.props.navigation.navigate(NavigationRoots.MyOrders);
        } else if (index == 3) {
          if (this.state.accountId != 0) {
            this.props.navigation.navigate(NavigationRoots.MySale);
          } else {
            this.props.navigation.navigate(NavigationRoots.CreateStore);
          }
        }else if (index == 42) {
          if (this.state.accountId != 0) {
            this.props.navigation.navigate(NavigationRoots.MyOrders,{
              title:constantArrays.menuArray[index]
            });
          } else {
            this.props.navigation.navigate(NavigationRoots.CreateStore);
          }
        }
      } else {
        this.props.navigation.navigate(NavigationRoots.SignIn)
      }
    }
  }
  /*  UI   */
  renderListView = () => {
    let  mArray = constantArrays.menuArray;
    if (!appConstant.loggedIn) {
      mArray = mArray.slice(0,-1)
     }
    return (
      <View style={{ width: '100%' }}>
        <FlatList
          style={{ margin: 10 }}
          data={mArray}
          renderItem={this.renderListCellItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          ItemSeparatorComponent={() => <View style={{alignSelf: 'center', width: "100%", height: 1, marginTop: 12, backgroundColor: colors.LightUltraGray }} />}
        />
      </View>
    )
  }
  renderListCellItem = ({ item, index }) => {
    return <TouchableOpacity style={{marginBottom: 10, top: 13}} onPress={() => this.didSelectList({ index: index })} >
      <Text style={{fontSize: 12, fontWeight: '500', color: index != (constantArrays.menuArray.length - 1) ? colors.AppGray : colors.AppTheme }}>{item}</Text>
    </TouchableOpacity>
  }
  renderUserInfo = () => {
    console.log(appConstant.loggedIn);
    if(appConstant.loggedIn) {
      return (<View style={{ flexDirection: 'row',flex: 1, justifyContent: 'space-between' }}>
        <View style={{ marginLeft: 10}}>
          <Text style={styles.titleStyle}>{this.state.email}</Text>
          <Text style={styles.subTitleStyle}>{this.state.name}</Text>
        </View>
        <TouchableOpacity onPress={() => this.editBtnAction()}>
          <Image source={editIcon} style={{height: 30, width: 30}} />
        </TouchableOpacity>
      </View>)
    }else {
      return (<View>
        <TouchableOpacity style={{ marginLeft: 10}} onPress={() =>  this.props.navigation.navigate(NavigationRoots.SignIn)}>
          <Text style={styles.titleStyle}>Sign in/Sign up</Text>
        </TouchableOpacity>
      </View>)
    }
  }
  render() {
    return (
        // <LinearGradient style={styles.Container} colors={[colors.GradientTop, colors.GradientBottom]} >
          <SafeAreaView style={styles.Container}>
          <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
          <View style={{ position: 'relative', flexDirection: 'column' }}>
            <View style={{ height: 200 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', margin: 20, }}>
                <FastImage source={this.state.profilePic.length == 0 ? sample : { uri:this.state.profilePic}} 
                   style={{height: 60, width: 60, borderRadius: 30 }} />
                <this.renderUserInfo />
              </View>
            </View>
            <View style={{ backgroundColor: colors.AppWhite, height: '80%', }}>
              <View style={styles.listContainerView} >
                <this.renderListView />
              </View>
            </View>
          </View>
          </SafeAreaView>
        // </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.AppTheme,
  },
  titleStyle: {
    color: colors.AppWhite,
    fontSize: 18,
    fontWeight: '700'
  },
  subTitleStyle: {
    marginTop: 5,
    color: colors.AppWhite,
    fontSize: 12,
    fontWeight: '500'
  },
  listContainerView: {
    height: '150%',
    marginTop: -100,
    backgroundColor: colors.AppWhite,
    margin: 20,
    shadowColor: 'gray',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    flexDirection: 'row',
    borderRadius: 10,
  }
});
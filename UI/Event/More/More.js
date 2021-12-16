
import React, { Component } from 'react';
import {
  FlatList, Alert, Linking, Text, Image, View,
  StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,Dimensions, Platform,
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
import DeviceInfo from 'react-native-device-info';
import eventStyles from '../../../StyleSheet/EventStyleSheet';
import SvgUri from 'react-native-svg-uri';

import constantArrays from '../../../Constants/ConstantArrays';
import FastImage from 'react-native-fast-image';
const windowHeight = Dimensions.get('window').height;

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
      segmentIndex: 0,
    }
  }
  componentDidMount() {
    // this.getUserDetailApi();
    // this.getMyStoreApi();
    this.props.navigation.addListener('focus', () => {
      if (appConstant.loggedIn) {
          this.setState({ isVisible: true })
          this.state.loadData = true
          this.getUserDetailApi();
          this.getMyStoreApi();
          // this.setState({updateUI: !this.state.updateUI})
      }else {
        this.state.profilePic = ''
        this.setState({updateUI: !this.state.updateUI})
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
      // console.log('coming here or not');
      let acctData = responseJson['data']['accounts'];
      if (acctData.length != 0) {
        appConstant.accountID = acctData[0]['id'];
        this.setState({accountId: acctData[0]['id']})
      }else {
        this.state.accountId = '';
        appConstant.accountID = '';
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
  rateAppBtnAction() {
    let link = Platform.OS =='ios' ? appConstant.appStoreLink : appConstant.playStoreLink;
    Linking.canOpenURL(link).then(supported => {
      supported && Linking.openURL(link);
    }, (err) => console.log(err));
  }
  didSelectList = ({ index }) => {
    if (this.state.segmentIndex == 0) {
      this.customerCellDidSelect(index)
    } else {
      if (index == 4) {
        Linking.openURL(appConstant.termCondition);
      }
      else if (index == 5) {
        Linking.openURL(appConstant.privacyURL);
      }
      else if (index == 6) {
        this.props.navigation.navigate(NavigationRoots.InviteFriend);
      } else if (index == 7) {
        this.rateAppBtnAction()
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
          } else if (index == 3) {
            if (this.state.accountId == 0) {
              this.props.navigation.navigate(NavigationRoots.CreateStore);
            } else {
              this.props.navigation.navigate(NavigationRoots.PaymentScreen);
            }
          } else if (index == 2) {
            if (this.state.accountId != 0) {
              this.props.navigation.navigate(NavigationRoots.MySale);
            } else {
              this.props.navigation.navigate(NavigationRoots.CreateStore);
            }
          } else if (index == 1) {
            if (this.state.accountId != 0) {
              this.props.navigation.navigate(NavigationRoots.MyOrders, {
                title: constantArrays.menuArray[index]
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
  }
  customerCellDidSelect(index) {
    let  mArray = this.state.segmentIndex == 1 ? constantArrays.menuArray : constantArrays.customerMenuArray;
    if (!appConstant.loggedIn) {
      mArray = mArray.slice(0,-1)
     } 
    if (index == 2) {
      Linking.openURL(appConstant.termCondition);
    }
    else if (index == 3) {
      Linking.openURL(appConstant.privacyURL);
    }
    else if (index == 4) {
      this.props.navigation.navigate(NavigationRoots.InviteFriend);
    } else if (index == 5) {
      this.rateAppBtnAction()
    } else {
      if (appConstant.loggedIn) {
        if (index == mArray.length - 1) {
          this.logoutBtnAction()
        } else if (index == 0) {
          this.props.navigation.navigate(NavigationRoots.MyOrders);
        } else if (index == 1) {
          this.props.navigation.navigate(NavigationRoots.MyCart);
        }
      } else {
        this.props.navigation.navigate(NavigationRoots.SignIn)
      }
    }
  }
  /*  UI   */
  renderSegmentBar = () => {
    return (<View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
      <TouchableOpacity onPress={() => this.setState({ segmentIndex: 0 })}
        style={this.state.segmentIndex == 0 ? eventStyles.selectedSegmentViewStyle : eventStyles.segmentViewStyle}>
        <View style={{ height: 5 }} />
        <Text style={{ fontSize: 14, fontWeight: '500', color: this.state.segmentIndex == 0 ? colors.AppTheme : colors.Lightgray }}>
          Customer
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.setState({ segmentIndex: 1 })}
        style={this.state.segmentIndex == 1 ? eventStyles.selectedSegmentViewStyle : eventStyles.segmentViewStyle}>
        <View style={{ height: 5 }} />
        <Text style={{ fontSize: 14, fontWeight: '500', color: this.state.segmentIndex == 1 ? colors.AppTheme : colors.Lightgray }}>
          Business
        </Text>
      </TouchableOpacity>
    </View>)
  }
  renderListView = () => {
    let  mArray = this.state.segmentIndex == 1 ? constantArrays.menuArray : constantArrays.customerMenuArray;
    if (!appConstant.loggedIn) {
      mArray = mArray.slice(0,-1)
     }
    return (
      <View style={{ width: '100%' }}>
        <View>
          {this.renderSegmentBar()}
        </View>
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
      <Text style={{height: 16,fontSize: 12, fontWeight: '500', color: index != (constantArrays.menuArray.length - 1) ? colors.AppGray : colors.AppTheme }}>{item}</Text>
    </TouchableOpacity>
  }
  renderUserInfo = () => {
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
      <SafeAreaView style={styles.Container}>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{position: 'relative', flexDirection: 'column', height: '100%'}}>
          <View style={{ height: '30%'}}>
            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 20}}>
              <FastImage source={this.state.profilePic.length == 0 ? sample : { uri: this.state.profilePic }}
                style={{ height: 60, width: 60, borderRadius: 30 }} />
              <this.renderUserInfo />
            </View>
          </View>
          <View style={{ backgroundColor: colors.LightBlueColor,justifyContent: 'space-between', height: '75%'}}>
            <View style={styles.listContainerView} >
              <this.renderListView />
            </View>
            <View style={{ height: 70, alignItems: 'center' }}>
              <Text>{`${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
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
    height: '95%',
    marginTop: '-20%',
    backgroundColor: colors.AppWhite,
    margin: 20,
    shadowColor: 'gray',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 10,
    flexDirection: 'row',
    borderRadius: 10,
  }
});
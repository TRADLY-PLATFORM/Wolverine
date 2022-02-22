
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
import DeviceInfo, {getUniqueId} from 'react-native-device-info';
import eventStyles from '../../../StyleSheet/EventStyleSheet';

import constantArrays from '../../../Constants/ConstantArrays';
import FastImage from 'react-native-fast-image';
import LangifyKeys from '../../../Constants/LangifyKeys';
import tradlyDb from '../../../TradlyDB/TradlyDB';



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
      translationDic:{},
    }
  }
  componentDidMount() {
    this.getUserDetailApi();
    this.getMyStoreApi();
    this.langifyAPI()
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
  langifyAPI = async () => {
    let moreD = await tradlyDb.getDataFromDB(LangifyKeys.more);
    if (moreD != undefined) {
      this.moreTranslationData(moreD);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.more}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${appConstant.appLanguage}${group}`, 'get', '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(LangifyKeys.more, objc)
      this.moreTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  moreTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('more.signin_signup' == obj['key']) {
        this.state.translationDic['title'] = obj['value'];
      }
      if ('more.customer' == obj['key']) {
        this.state.translationDic['customer'] = obj['value'];
      }
      if ('more.tenant_exit_confirm_title' == obj['key']) {
        this.state.translationDic['titleLogout'] = obj['value'];
      }
      if ('more.business' == obj['key']) {
        this.state.translationDic['business'] = obj['value'];
      }
      if ('more.my_orders' == obj['key']) {
        constantArrays.customerMenuArray[0] = obj['value'];
      }
      if ('more.my_store' == obj['key']) {
        constantArrays.menuArray[0] = obj['value'];
      }
      if ('more.my_cart' == obj['key']) {
        constantArrays.customerMenuArray[1] = obj['value'];
      }
      if ('more.my_store_orders' == obj['key']) {
        constantArrays.menuArray[1] = obj['value'];
      }
      if ('more.my_sales' == obj['key']) {
        constantArrays.menuArray[2] = obj['value'];
      }
      if ('more.payments' == obj['key']) {
        constantArrays.menuArray[3] = obj['value'];
      }
      if ('more.language' == obj['key']) {
        constantArrays.customerMenuArray[2] = obj['value'];
        constantArrays.menuArray[4] = obj['value'];
      }
      if ('more_stores_i_follow' == obj['key']) {
        constantArrays.menuArray[5] = obj['value'];
      }
      if ('more.terms_condition' == obj['key']) {
        constantArrays.customerMenuArray[3] = obj['value'];
        constantArrays.menuArray[6] = obj['value'];
      }
      if ('more.privacy_policy' == obj['key']) {
        constantArrays.customerMenuArray[4] = obj['value'];
        constantArrays.menuArray[7] = obj['value'];
      }
      if ('more.tell_a_friend' == obj['key']) {
        constantArrays.customerMenuArray[5] = obj['value'];
        constantArrays.menuArray[8] = obj['value'];
      }
      if ('more.rate_app' == obj['key']) {
        constantArrays.customerMenuArray[6] = obj['value'];
        constantArrays.menuArray[9] = obj['value'];
      }
      if ('more.logging_out' == obj['key']) {
        constantArrays.customerMenuArray[7] = obj['value'];
        constantArrays.menuArray[10] = obj['value'];
        this.state.translationDic['logout'] = obj['value'];
      }
    }
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
  logoutApi = async () => {
    this.setState({ isVisible: true })
    var dict = {
      'uuid': getUniqueId(),
    }
    const responseJson = await networkService.networkCall(APPURL.URLPaths.logout, 'POST', JSON.stringify(dict), appConstant.bToken, appConstant.authKey)
    this.setState({ isVisible: false })
    if (responseJson) {
      DefaultPreference.set('loggedIn', 'false').then( () => { 
        appConstant.loggedIn = false;
        appConstant.authKey = '';
        this.setState({ updateUI: !this.state.updateUI})
        this.props.navigation.navigate(NavigationRoots.SignIn)
      }); 
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
      this.state.translationDic['titleLogout'] ?? 'are you sure ', "",
      [
        {
          text: appConstant.cancelTitle ?? 'cancel',
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: this.state.translationDic['logout'] ?? 'Logout', onPress: () => {
            this.logoutApi()
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
        this.props.navigation.navigate(NavigationRoots.Language,{changeLanguage:true});
      }
      else if (index == 6) {
        Linking.openURL(appConstant.termCondition);
      }
      else if (index == 7) {
        Linking.openURL(appConstant.privacyURL);
      }
      else if (index == 8) {
        this.props.navigation.navigate(NavigationRoots.InviteFriend);
      } else if (index == 9) {
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
              if (appConstant.payoutMethod == 'stripe') {
                this.props.navigation.navigate(NavigationRoots.PaymentScreen);
              }else {
                this.props.navigation.navigate(NavigationRoots.MangoPaySetup);
              }
            }
          } else if (index == 2) {
            if (this.state.accountId != 0) {
              this.props.navigation.navigate(NavigationRoots.MySale);
            } else {
              this.props.navigation.navigate(NavigationRoots.CreateStore);
            }
          } else  if (index == 5) {
            if (this.state.accountId == 0) {
              this.props.navigation.navigate(NavigationRoots.CreateStore);
            } else {
              this.props.navigation.navigate(NavigationRoots.StoreList,{title: constantArrays.menuArray[5]});
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
      this.props.navigation.navigate(NavigationRoots.Language,{changeLanguage:true});
    }
    else if (index == 3) {
      Linking.openURL(appConstant.termCondition);
    }
    else if (index == 4) {
      Linking.openURL(appConstant.privacyURL);
    }
    else if (index == 5) {
      this.props.navigation.navigate(NavigationRoots.InviteFriend);
    } else if (index == 6) {
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
          { this.state.translationDic['customer'] ?? 'Customer'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.setState({ segmentIndex: 1 })}
        style={this.state.segmentIndex == 1 ? eventStyles.selectedSegmentViewStyle : eventStyles.segmentViewStyle}>
        <View style={{ height: 5 }} />
        <Text style={{ fontSize: 14, fontWeight: '500', color: this.state.segmentIndex == 1 ? colors.AppTheme : colors.Lightgray }}>
          {this.state.translationDic['business'] ?? 'Business'}
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
    return <TouchableOpacity style={{justifyContent: 'center',padding:10}} onPress={() => this.didSelectList({ index: index })} >
      <Text style={{fontSize: 12, fontWeight: '500', color: index != (constantArrays.menuArray.length - 1) ? colors.AppGray : colors.AppTheme }}>{item}</Text>
    </TouchableOpacity>
  }
  renderUserInfo = () => {
    if(appConstant.loggedIn) {
      return (<View  style={{ flexDirection: 'row', alignItems: 'center', margin: 20}}>
        <FastImage source={this.state.profilePic.length == 0 ? sample : { uri: this.state.profilePic }}
                style={{ height: 60, width: 60, borderRadius: 30 }} />
        <View style={{ flexDirection: 'row',flex: 1, justifyContent: 'space-between' }}>
        <View style={{ marginLeft: 10}}>
          <Text style={styles.titleStyle}>{this.state.name}</Text>
          <Text style={styles.subTitleStyle}>{this.state.email}</Text>
        </View>
        <TouchableOpacity onPress={() => this.editBtnAction()}>
          <Image source={editIcon} style={{height: 24, width: 24, tintColor:colors.AppWhite}} />
        </TouchableOpacity>
      </View>
      </View>)
    }else {
      return (<View  style={{ flexDirection: 'row', alignItems: 'center', margin: 20}}>
          <FastImage source={sample} style={{ height: 60, width: 60, borderRadius: 30 }} />
        <TouchableOpacity style={{ marginLeft: 10}} onPress={() =>  this.props.navigation.navigate(NavigationRoots.SignIn)}>
          <Text style={styles.titleStyle}>{this.state.translationDic['title'] ?? 'Sign in/Sign up'}</Text>
        </TouchableOpacity>
      </View>)
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{flexDirection: 'column', height: '100%', backgroundColor: colors.LightBlueColor}}>
          <View style={{ height: '30%', zIndex: 1, backgroundColor: colors.AppTheme}}>
            <View>
              <this.renderUserInfo />
            </View>
          </View>
          <View style={{marginTop: '-28%', backgroundColor: colors.lightTransparent,justifyContent: 'space-between', height: '75%', zIndex: 10,position: 'relative'}}>
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
    // marginTop: '-20%',
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
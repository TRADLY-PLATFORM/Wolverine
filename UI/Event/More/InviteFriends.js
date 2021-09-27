
import React, { Component } from 'react';
import {
  Dimensions,
  Text,
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import HeaderView from '../../../Component/Header'
import colors from '../../../CommonClasses/AppColor';
import Spinner from 'react-native-loading-spinner-overlay';
import commonStyles from '../../../StyleSheet/UserStyleSheet'
import appConstant from '../../../Constants/AppConstants';
import APPURL from '../../../Constants/URLConstants';
import networkService from '../../../NetworkManager/NetworkManager';

const windowWidth = Dimensions.get('window').width;

export default class AddRecycleItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible:true,
      title:'',
      description:'',
      name:''
    }
  }
  componentDidMount() {
    this.configListApi()
  }
  configListApi = async()  => {
    const responseJson = await networkService.networkCall(APPURL.URLPaths.configList + 'general', 'get','',appConstant.bToken,'')
    if (responseJson['status'] == true) {
      let into = responseJson['data']['configs'];
      
      this.state.title = into['invite_friends_collection_title'] || '';
      this.state.description = into['invite_friends_collection_description'] || '';
      this.state.name = into['app_title_home'] || '';
    }
    this.setState({isVisible: false })
  }
  onShareBtnAction = async () => {
    try {
      const result = await Share.share({
        message: appConstant.appSharePath,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }
  /*  UI   */

  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Invite People'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '90%', backgroundColor: colors.LightBlueColor, width: '90%', alignSelf: 'center', borderRadius: 10 }}>
          <ScrollView>
            <View style={{ alignItems: 'center', height: '100%', marginTop: 20 }}>
              <Image style={{ width: '80%', height: windowWidth - 80, alignSelf: 'center' }} resizeMode="contain" source={require('../../../assets/referEarnIcon.png')} />
              <Text style={styles.titleTxt}>{this.state.title}</Text>
              <Text style={styles.subTitleTxt}>{this.state.description}</Text>
              {/* <Text style={styles.inviteStyle}>Tap on invitation code to copy</Text>
              <View style={styles.dottedViewStyle}>
                <Text style={{ fontWeight: '500', color: colors.AppTheme, fontSize: 18 }}>{this.state.name}</Text>
              </View> */}
              <View style={{ alignItems: 'center', marginTop: '30%', marginBottom: 20 }}>
                <Text style={styles.inviteStyle}>or invite using</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                  <TouchableOpacity style={{ width: 50, height: 50, margin: 5 }} onPress={() => this.onShareBtnAction()}>
                    <Image style={{ width: 50, height: 50, alignSelf: 'center' }} resizeMode="contain" source={require('../../../assets/shareWhatsapp.png')} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: 50, height: 50, margin: 5 }} onPress={() => this.onShareBtnAction()}>
                    <Image style={{ width: 50, height: 50, alignSelf: 'center' }} resizeMode="contain" source={require('../../../assets/facebook.png')} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: 50, height: 50, margin: 5 }} onPress={() => this.onShareBtnAction()}>
                    <Image style={{ width: 50, height: 50, alignSelf: 'center' }} resizeMode="contain" source={require('../../../assets/instagram.png')} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: 50, height: 50, margin: 5 }} onPress={() => this.onShareBtnAction()}>
                    <Image style={{ width: 50, height: 50, alignSelf: 'center' }} resizeMode="contain" source={require('../../../assets/googleplus.png')} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
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
  titleTxt: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    textAlign: "center",
  },
  subTitleTxt: {
    marginTop: 12,
    fontSize: 14,
    color: 'gray',
    textAlign: "center",
    marginLeft: 40,
    marginRight: 40,
    fontWeight: '400',
  },
  inviteStyle: {
    fontWeight: '700',
    marginTop: 20,
    fontSize: 14
  },
  dottedViewStyle: {
    marginTop: 20,
    backgroundColor: colors.LightBlueColor,
    borderRadius: 25,
    height: 50,
    width: 200,
    borderColor: colors.AppTheme,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
  }
});
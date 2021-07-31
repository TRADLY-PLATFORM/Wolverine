
import React, { Component } from 'react';
import {
  FlatList, Alert, TextInput, Text, Image, View,
  StyleSheet, SafeAreaView, TouchableOpacity, ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../CommonClasses/AppColor';
import NavigationRoots from '../../../Constants/NavigationRoots';
import sample from '../../../assets/dummy.png';
import settingIcon from '../../../assets/settingIcon.png';
import appConstant from '../../../Constants/AppConstants';
import APPURL from '../../../Constants/URLConstants';
import networkService from '../../../NetworkManager/NetworkManager';

import constantArrays from '../../../Constants/ConstantArrays';

export default class More extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      accountId: 0,
      updateUI: false
    }
  }
  componentDidMount() {
    this.getMyStoreApi();
    this.props.navigation.addListener('focus', () => {
      this.getMyStoreApi();
    });
  }
  getMyStoreApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.accounts}?user_id=${appConstant.userId}&page=1&type=accounts`, 'get', '', appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      let acctData = responseJson['data']['accounts'];
      if (acctData.length != 0) {
        this.setState({ accountId: acctData[0]['id'] })
      }
      this.setState({ updateUI: !this.state.updateUI, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  /*  Buttons   */
  settingBtnAction() {
    this.props.navigation.navigate(NavigationRoots.Profile)
  }
  logoutBtnAction() {
    Alert.alert(
      "Are you sure you want to logout?", "",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "OK", onPress: () => {
            this.props.navigation.replace(NavigationRoots.SignIn)
          }
        }
      ],
    );
  }
  didSelectList = ({ index }) => {
    if (index == constantArrays.menuArray.length - 1) {
      this.logoutBtnAction()
    } else if (index == 0) {
      if (this.state.accountId != 0) {
        this.props.navigation.navigate(NavigationRoots.MyStore, { accId: this.state.accountId });
      } else {
        this.props.navigation.navigate(NavigationRoots.CreateStore);
      }
    }
  }
  /*  UI   */
  renderListView = () => {
    return (
      <View style={{ width: '100%' }}>
        <FlatList
          style={{ margin: 10 }}
          data={constantArrays.menuArray}
          renderItem={this.renderListCellItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          ItemSeparatorComponent={() => <View style={{ alignSelf: 'center', width: "100%", height: 1, marginTop: 10, backgroundColor: colors.LightUltraGray }} />}
        />
      </View>
    )
  }
  renderListCellItem = ({ item, index }) => {
    return <TouchableOpacity style={{ marginBottom: 10, top: 10 }} onPress={() => this.didSelectList({ index: index })} >
      <Text style={{ fontSize: 12, fontWeight: '500', color: index != (constantArrays.menuArray.length - 1) ? 'black' : colors.AppTheme }}>{item}</Text>
    </TouchableOpacity>
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <LinearGradient style={styles.Container} colors={[colors.GradientTop, colors.GradientBottom]} >
          <View style={{ position: 'relative', flexDirection: 'column' }}>
            <View style={{ backgroundColor: colors.AppTheme, height: '32%' }}>
              <View style={{ flexDirection: 'row', margin: 20, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={sample} style={{ height: 60, width: 60, borderRadius: 30 }} />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.titleStyle}>Developer</Text>
                    <Text style={styles.subTitleStyle}>eventdev@gmail.com</Text>
                  </View>
                </View>
                {/* <TouchableOpacity onPress={() => this.settingBtnAction()}>
                  <Image source={settingIcon} style={{ width: 20, height: 20 }} />
                </TouchableOpacity> */}
              </View>
            </View>
            <View style={{ backgroundColor: colors.AppWhite, height: '70%', }}>
              <View style={styles.listContainerView} >
                <this.renderListView />
              </View>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.AppTheme
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
    height: '120%',
    marginTop: '-32%',
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
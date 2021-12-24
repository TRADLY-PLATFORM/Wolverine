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
import HeaderView from '../../Component/Header'
import colors from '../../CommonClasses/AppColor';
import commonStyles from '../../StyleSheet/UserStyleSheet';
import eventStyles from '../../StyleSheet/EventStyleSheet';
import radio from '../../assets/radio.png';
import selectedradio from '../../assets/radioChecked.png';
import DefaultPreference from 'react-native-default-preference';
import NavigationRoots from '../../Constants/NavigationRoots';

import APPURL from '../../Constants/URLConstants';
import networkService from '../../NetworkManager/NetworkManager';
import appConstant from '../../Constants/AppConstants';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Language extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible:true,
      updateUI: false,
      selectedLangaugeIndex: 0,
      languageArray: [],
    }
  }

  componentDidMount() {
    this.loadLanguageApi()
  }
 
  loadLanguageApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(APPURL.URLPaths.language, 'get', '', appConstant.bToken,'')
    this.setState({ isVisible: false })
    if (responseJson['status'] == true) {
      let cData = responseJson['data']['languages'];
      console.log('cData', cData);
      this.state.languageArray = cData;
      this.setState({updateUI: !this.state.updateUI})
    } else {
      this.setState({ isVisible: false })
    }
  }
  /*  Buttons   */
  didSelect = (item,index) => {
    this.state.selectedLangaugeIndex = index;
    this.setState({updateUI: !this.state.updateUI})
  }
  doneBtnAction () {
    let lang = this.state.languageArray[this.state.selectedLangaugeIndex]['code'];
    appConstant.appLanguage = lang
    DefaultPreference.set('appLanguage', lang).then(function () { console.log('saved') });
    if (this.props.route.params) {
      this.props.navigation.pop();
    }
    else {
      this.props.navigation.navigate(NavigationRoots.OnBoardings);
    }
  }
  /*  UI   */
  renderListView = () => {
    return (<View style={{margin: 5, height: '82%'}}>
      <FlatList
        data={this.state.languageArray}
        renderItem={this.renderListViewCellItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
      />
    </View>)
  }
  renderListViewCellItem = ({ item, index }) => {
    let check = index == this.state.selectedLangaugeIndex ? true : false
    return (
      <TouchableOpacity onPress={() => this.setState({ selectedLangaugeIndex: index })}>
        <View style={styles.startViewCellStyle}>
          <Text style={{ textAlign: 'left', fontSize: 16, color: colors.AppGray }}> {item['name']} </Text>
          <View style={commonStyles.nextIconStyle}>
            <Image style={{width:20,height:20,tintColor:check ? colors.AppTheme : colors.Lightgray}} source={check ? selectedradio : radio}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  renderButtonView = () => {
    return (<View style={{alignSelf: 'center'}}>
      <TouchableOpacity style={styles.bottomBtnViewStyle} onPress={() => this.doneBtnAction()}>
        <View style={eventStyles.applyBtnViewStyle}>
          <Text style={{ color: colors.AppWhite,fontWeight: '600', fontSize: 16 }}>Next</Text>
        </View>
      </TouchableOpacity>
    </View>)
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Language'} showBackBtn={false} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{height: '97%', backgroundColor: colors.AppWhite }}>
          <View style={{height: '100%',width: '100%'}}>
            <this.renderListView />
            <this.renderButtonView />
          </View>
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
  listViewStyle: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: colors.BorderColor,
    padding: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: 'pink',
  },
  bottomBtnViewStyle: {
    width: '70%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
    shadowRadius: 2,
    borderRadius: 20,
  },
  contentContainerStyle: {
    padding: 16,
    backgroundColor: colors.AppWhite,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.AppWhite,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  panelHandle: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4
  },
  track: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.LightUltraGray,
  },
  thumb: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: colors.AppTheme,
  },
  startViewCellStyle: {
    justifyContent: 'space-between',
    width: "97%",
    margin: 5,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderColor: colors.BorderColor,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  textValueStyle: {
    textAlign: 'left',
    fontSize: 14,
    color: colors.Lightgray,
    marginTop: 5,
  }
});



// 9417465060
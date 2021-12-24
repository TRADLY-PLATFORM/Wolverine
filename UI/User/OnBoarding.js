
import React, { Component } from 'react';
import {Text, Image, View, StyleSheet, TouchableOpacity,ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../CommonClasses/AppColor';
import NavigationRoots from '../../Constants/NavigationRoots';
import AppIntroSlider from 'react-native-app-intro-slider';
import eventStyles from '../../StyleSheet/EventStyleSheet';
import appConstant from '../../Constants/AppConstants';
import LangifyKeys from '../../Constants/LangifyKeys';
import tradlyDb from '../../TradlyDB/TradlyDB';
import networkService from '../../NetworkManager/NetworkManager';
import APPURL from '../../Constants/URLConstants';
import DefaultPreference from 'react-native-default-preference';

export default class OnBoardings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      slider: AppIntroSlider | undefined,
      index: 0,
      slides: [],
      translationDic:{},
      loading: true,
    }
  }
  componentDidMount() {
    var index = 0 ;
    this.langifyAPI()
    this.langifyHomeAPI()
    for (let obj of appConstant.intoScreen) {
      index = index + 1
      let dic = {
        key: index,
        title: obj['text'],
        text: '',
        image: {uri:obj['image']},
      }
      this.state.slides.push(dic)
    }
  }
  langifyAPI = async () => {
    let forgotD = await tradlyDb.getDataFromDB(LangifyKeys.intro);
    if (forgotD != undefined) {
      this.introTranslationData(forgotD);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.intro}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}en${group}`, 'get',
      '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(LangifyKeys.intro, objc)
      this.introTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  introTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('intro.getstarted' == obj['key']) {
        this.state.translationDic['start'] = obj['value'];
      }
      if ('intro.next' == obj['key']) {
        this.state.translationDic['next'] = obj['value'];
      }
    }
  }
  langifyHomeAPI = async () => {
    let homeData = await tradlyDb.getDataFromDB(LangifyKeys.home);
    if (homeData != undefined) {
      this.bottomTarTranslationData(homeData);
    } 
    let group = `&group=${LangifyKeys.home}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${appConstant.appLanguage}${group}`, 'get', '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(LangifyKeys.home, objc)
      this.bottomTarTranslationData(objc);
      this.setState({ isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  bottomTarTranslationData(object) {
    for (let obj of object) {
      if ('home.Home' == obj['key']) {
        appConstant.bottomTabBarDic['home'] = obj['value'];
      }
      if ('home.chats' == obj['key']) {
        appConstant.bottomTabBarDic['chats'] = obj['value'];
      }
      if ('home.more' == obj['key']) {
        appConstant.bottomTabBarDic['more'] = obj['value'];
      }
      if ('home.sell' == obj['key']) {
        appConstant.bottomTabBarDic['sell'] = obj['value'];
      }
      if ('home.social_feed' == obj['key']) {
        appConstant.bottomTabBarDic['socialFeed'] = obj['value'];
      }
      if ('home.search' == obj['key']) {
        appConstant.bottomTabBarDic['search'] = obj['value'];
      }
    }
  }
  /*  Buttons   */
  _onDone = () => {  
    DefaultPreference.set('installed', 'true').then(function () { console.log('installed') });
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: NavigationRoots.BottomTabbar }],
    });
  }
  _nextBtnAction(){
    this.state.index = this.state.index + 1;
    this.slider.goToSlide(this.state.index,true)
    this.setState({loading:false});
  }
  /*  UI   */
  _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageViewStyle}>
          <Image source={item.image} style={styles.image} resizeMode={'contain'} onLoadEnd={() => this.setState({loading: false})}/>
          <ActivityIndicator  size="small" color="#a7a7a7"  style={styles.activityIndicator}  animating={this.state.loading}/>
        <View style={{marginTop: '-40%'}}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
        </View>
      </View>
    );
  }
  renderNextBtn = () => {
    return (<View style={styles.buttonCircle}>
      <TouchableOpacity onPress={() => this._nextBtnAction()}>
        <View style={eventStyles.applyBtnViewStyle}>
          <Text style={{ color: colors.AppWhite, fontWeight: '600' }}>{this.state.translationDic['next'] ?? 'Next'} </Text>
        </View>
      </TouchableOpacity>
    </View>)
  }
  renderDoneBtn = () => {
    return (<View style={styles.buttonCircle}>
      <TouchableOpacity  onPress ={() => this._onDone()}>
        <View style={eventStyles.applyBtnViewStyle}>
          <Text style={{ color: colors.AppWhite, fontWeight: '600' }}>
          {this.state.translationDic['next'] ?? 'Next'}</Text>
        </View>
      </TouchableOpacity>
    </View>)
  }
  renderIntro = () => {
    return <AppIntroSlider 
      dotStyle={{backgroundColor: colors.LightGreen}}
      activeDotStyle={{backgroundColor: colors.AppTheme}}
      renderItem={this._renderItem}
      data={this.state.slides} 
      renderNextButton={this.renderNextBtn}
      renderDoneButton={this.renderDoneBtn}
      onSlideChange={i => this.setState({index: i})}
      ref={ref => this.slider = ref}
      />;
  }
  render() {
    return (
      <LinearGradient style={styles.Container} colors={[colors.AppWhite, colors.AppWhite]} >
        <View style={{ flex: 1, flexDirection: 'column'}} >
          <View style={{backgroundColor:colors.AppTheme, height: '50%', width: '100%'}}>
          </View>
          <View style={{height: '100%', width: '100%',position: 'absolute'}}>
            <View style={{height: '100%'}}>
              <this.renderIntro />
            </View>
              <View style={styles.skipBtnViewStyle}> 
                <TouchableOpacity onPress ={() => this._onDone()}>
                  <Text style={{color: colors.AppWhite, fontSize: 20, fontWeight: '500'}}>
                    {this.state.translationDic['start'] ?? 'Skip'}</Text>
                </TouchableOpacity>
              </View>
          </View>
        </View>
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.AppTheme
  },
  titleStyle: {
    color: 'black'
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageViewStyle: {
    margin: 20,
    marginTop: -20,
    padding:20,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    marginTop: 5,
    color: colors.AppWhite,
    textAlign: 'center',
  },
  title: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: '500',
    color: 'pink',
    textAlign: 'center',
  },
  skipBtnViewStyle: {
    width: '100%',
    marginTop: 20 ,
    position: 'absolute',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 20,
  },
  buttonCircle: {
    width: 80,
    height: 40,
    backgroundColor: colors.AppTheme,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 2,
    elevation: 10,
    borderRadius: 20,
  },
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }
});

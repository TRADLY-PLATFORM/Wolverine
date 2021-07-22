
import React, { Component } from 'react';
import {
  Alert,
  StatusBar,
  FlatList,
  Text,Image,View,
  StyleSheet, SafeAreaView,
  TouchableOpacity,ScrollView,Dimensions
} from 'react-native';
import 'react-native-gesture-handler';
import colors from '../../CommonClasses/AppColor';
import commonStyle from './../../StyleSheet/UserStyleSheet'
import DefaultPreference from 'react-native-default-preference';
import dummy from './../../assets/dummy.png';
import appConstant from './../../Constants/AppConstants';
import APPURL from './../../Constants/URLConstants';
import networkService from './../../NetworkManager/NetworkManager';

const windowWidth = Dimensions.get('window').width;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    }
  }
  componentDidMount() {
    DefaultPreference.get('token').then(function (value) {
      appConstant.bToken = value;
      DefaultPreference.get('authKey').then(function (authKey) {
        appConstant.authKey = authKey;
        DefaultPreference.get('refreshKey').then(function (refreshKey) {
          appConstant.refreshKey = refreshKey;
        }.bind(this))
        DefaultPreference.get('userId').then(function (userId) {
          appConstant.userId = userId;
          this.getMyStoreApi()
        }.bind(this))
      }.bind(this))
    }.bind(this))
  }

  getMyStoreApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.accounts}?user_id=${appConstant.userId}&page=1&type=accounts`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let acctData = responseJson['data']['accounts'];
      if (acctData.length != 0) {
        appConstant.accountID = acctData[0]['id'];
      }
    }else {
      this.setState({ isVisible: false })
    }
  }
  /*  Buttons   */

  /*  UI   */
  renderHeaderView = () => {
    return <View style={commonStyle.headerViewStyle}>
      <StatusBar barStyle="light-content" />
      <Text style={commonStyle.headerTitleStyle}>{this.props.title}</Text>
      <TouchableOpacity onPress={() => this.props.notificationBtnAction()}>
        {/* <Image source={notificationIcon} style={commonStyle.backBtnStyle} /> */}
      </TouchableOpacity>
    </View>
  }
  renderRecyleValue = () => {
    return (<View>
       <FlatList
          data={Items}
          renderItem={({item}) => (
            <View style={styles.gridViewStyle}>
              <Image style={styles.imageThumbnail} source={item.image} resizeMode={'contain'}/>
              <View style={{height: 5}}/>
              <Text style={{textAlign: 'center', fontSize: 12}}>{`${item.name}`}</Text>
            </View>
          )}
          numColumns={4}
          keyExtractor={(item, index) => index}
        />
    </View>)
  }
  renderGridView = () => {
    return (<View style={{backgroundColor:colors.AppWhite}}>
        <FlatList
          data={Items}
          renderItem={({item}) => (
            <View style={styles.gridViewStyle}>
              <Image style={styles.imageThumbnail} source={item.image} resizeMode={'contain'}/>
              <View style={{height: 5}}/>
              <Text style={{textAlign: 'center', fontSize: 12}}>{`${item.name}`}</Text>
            </View>
          )}
          numColumns={4}
          keyExtractor={(item, index) => index}
        />
      </View>)
  }
  renderPromoView = () => {
    return <View style={{ backgroundColor: colors.lightTransparent}}>
      <FlatList
        data={[1,1,1,1,1,1,1,1,1,1,1,1,1]}
        horizontal={true}
        renderItem={this.renderPromoCellItem}
        extraData={this.state}
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
      />
    </View>
  }
  renderPromoCellItem = ({item, index}) => {
    return (<View style={styles.promoCellStyle}>
      {/* <View style={{backgroundColor: colors.AppWhite, flex: 1,borderTopLeftRadius: 10, borderBottomLeftRadius: 10,alignItems: 'center' ,justifyContent: 'center'}}>
        <Text style={{fontSize: 14, fontWeight: '400'}}>Fitness for women</Text>
        <View style={{}}> </View>
      </View> */}
      <View style={{backgroundColor: colors.AppYellow, flex: 1, borderRadius: 10}}/>
       </View>)
   }
  renderEventView = () => {
    return <View style={{backgroundColor: colors.AppRed, margin: 0}}>
      <FlatList
        data={[1,1,1,1,1,1,1,1,1]}
        horizontal={false}
        renderItem={this.renderEventItemCell}
        extraData={this.state}
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
      />
    </View>
  }
  renderEventItemCell = () => {
    return (<View style={{ backgroundColor: colors.AppWhite }}>
      <View style={styles.eventCellItemStyle}>
        <Text style={{fontSize: 14, fontWeight: '700', color: colors.AppWhite, marginTop: 5}}>Events in Chennai</Text>
          <View style={styles.viewAllViewContainerStyle}>
            <Text style={{fontSize: 12, fontWeight: '500', color: colors.AppTheme,}}>View All</Text>
          </View>
      </View>
      <View style={{ backgroundColor: colors.AppWhite, height: 160, width: windowWidth}}>
        <View style={{marginTop: -120}}>
          {this.renderHorizontalList()}
        </View>
      </View>
    </View>)
  }
  renderHorizontalList = () => {
    return <View style={{ backgroundColor: colors.lightTransparent }}>
      <FlatList
        data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
        horizontal={true}
        renderItem={this.renderHorizontalCellItem}
        extraData={this.state}
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
      />
    </View>
  }
  renderHorizontalCellItem = ({ item, index }) => {
    return (<View style={styles.horizontalCellItemStyle}>
      <Image style={styles.selectedImageStyle} source={dummy} />
      <Text style={{ fontWeight: '600', fontSize: 12, padding: 5 }}>Yoga Something course </Text>
      <Text style={{ fontWeight: '500', fontSize: 14, padding: 5 }}>50$</Text>
      <View style={{ padding: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row'}}>
          <Image style={{ height: 25, width: 25, borderRadius: 12.5 }} source={dummy} />
          <Text style={{ color: colors.Lightgray, fontSize: 10, padding: 5 }}>Yoga Club</Text>
        </View>
        <View>
          <View style={styles.followContainerStyle}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.AppWhite, }}>Follow</Text>
          </View>
        </View>
      </View>
    </View>)
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <this.renderHeaderView />
        <ScrollView>
          <View style={{backgroundColor: colors.LightBlueColor, height: '100%'}}>
            <View style={{ height: 10,backgroundColor: 'white'}} />
            <this.renderGridView />
            <View style={{height: 10}} />
            <this.renderPromoView />
            <this.renderEventView />
          </View>
        </ScrollView>
        {/* <View style={{ flex: 1, backgroundColor:colors.AppWhite}}>
          <HeaderView
            title={'Tradly'}
            notificationBtnAction={() => this.props.navigation.navigate(NavigationRoots.Notifications)}/>
          <ScrollView>
            <View>
              <View style={{ flex: 2, backgroundColor: colors.AppWhite }}>
                <Image source={logo} style={styles.profileImageViewStyle} />
                <Text style={styles.subTitleStyle}>
                  Hello<Text style={styles.titleStyle}>{`, Recyclers`}</Text>
                </Text>
                <this.renderRecyleValue />
                <View style={{ margin: 20 }}>
                  <View style={styles.progressBackgroundStyle}>
                    <View style={styles.progressSelectedStyle} />
                  </View>
                </View>
                <Text style={styles.valueSubTitleStyle}>
                  15 items left to achive your target
              </Text>
              </View>
              <View style={{ backgroundColor: colors.LightBlueColor, marginTop: 40 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: -20 }}>
                  <TouchableOpacity 
                    style={styles.recycleGuideBtnStyle} 
                    onPress={() => this.props.navigation.navigate(NavigationRoots.RecycleGuide)}>
                    <Text style={{ color: colors.AppTheme, fontSize: 14, fontWeight: '500' }}>
                      Recycling guide
                  </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.seeTargetBtnStyle}
                    onPress={() => this.props.navigation.navigate(NavigationRoots.Target)}>
                    <Text style={{ color: colors.AppWhite, fontSize: 14, fontWeight: '500' }}>See Target</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ height: 20 }} />
                <TouchableOpacity onPress={() => this.props.navigation.navigate(NavigationRoots.AddRecycleItem)}>
                  <Text style={styles.recyleItemTxtStyle}>Recycle your item</Text>
                </TouchableOpacity>
                <View style={{ height: 20 }} />
                <this.renderGridView />
              </View>
            </View>
          </ScrollView>
        </View> */}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.AppTheme
  },
  imageThumbnail : {
    width: 30,
    height: 30,
  },
  gridViewStyle:{
    flexDirection: 'column', 
    padding: 10,
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.BorderColor
  },
  promoCellStyle: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: colors.AppWhite,
    height: 120,
    width: windowWidth - 50,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    flexDirection: 'row',
  },
  horizontalCellItemStyle: {
    height: 250,
    width: 200,
    margin: 10,
    backgroundColor: colors.AppWhite,
    borderRadius: 10,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
  },
  selectedImageStyle: {
    height: 150,
    width: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  eventCellItemStyle: {
    backgroundColor: colors.AppTheme,
    height: 160,
    width: windowWidth,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewAllViewContainerStyle: {
    backgroundColor: colors.AppWhite,
    width: 75,
    height: 25,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  followContainerStyle: {
    backgroundColor: colors.AppTheme,
    width: 75,
    height: 25,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

import bag from './../../assets/handbag.png';
import dress from './../../assets/dress.png';
import books from './../../assets/books.png';
import paper from './../../assets/book.png';
import tenis from './../../assets/tabletennis.png';
import game from './../../assets/game.png';
import notebookmousecursor from './../../assets/notebook.png';

var Items = [
  {name:'Bags',image: bag},
  {name:'Clothes',image: dress},
  {name:'Books',image: books},
  {name:'Other Papers',image: paper},
  {name:'Sports Equipments',image: tenis},
  {name:'Electronics',image: notebookmousecursor},
  {name:'Game & Toys',image: game},
  {name:'More',image: bag},
]

import React, { Component } from 'react';
import {
  Alert,
  FlatList,
  Text,Image,View,
  StyleSheet, SafeAreaView,
  TouchableOpacity,ScrollView,Dimensions
} from 'react-native';
import 'react-native-gesture-handler';
import colors from '../../CommonClasses/AppColor';
import commonStyles from './../../StyleSheet/UserStyleSheet'
import DefaultPreference from 'react-native-default-preference';
import dummy from './../../assets/dummy.png';
import appConstant from './../../Constants/AppConstants';
import APPURL from './../../Constants/URLConstants';
import networkService from './../../NetworkManager/NetworkManager';
import HeaderView from '../../Component/Header'
import FastImage from 'react-native-fast-image'
import moreIcon from './../../assets/more.png';
import Spinner from 'react-native-loading-spinner-overlay';
import NavigationRoots from '../../Constants/NavigationRoots';
import EventView from '../../Component/EventView';

const windowWidth = Dimensions.get('window').width;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      updateUI: false,
      promoBannerArray: [],
      categoryArray: [],
      categoryArray: [],
      collectionsArray: [],
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
          this.getHomeDataApi()
        }.bind(this))
      }.bind(this))
    }.bind(this))
  }

  getMyStoreApi = async () => {
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
  getHomeDataApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.home}`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let hData = responseJson['data'];
      this.state.promoBannerArray = hData['promo_banners'];
      this.state.categoryArray = hData['categories'];
      this.state.collectionsArray = hData['collections'];
      this.setState({ updateUI: !this.state.updateUI, isVisible: false })
    }else {
      this.setState({ isVisible: false })
    }
  }
  /*  Buttons   */
  didSelectCategory(item,index) {
    if (index == 7) {
      this.props.navigation.navigate(NavigationRoots.Category,{
        categoryList: this.state.categoryArray,
      });
    } else {
      // console.log('item', item['id'])
      this.props.navigation.navigate(NavigationRoots.EventList,{
        categoryID:item['id'],
        categoryName: item['name'],
      });
    }
  }
  didSelectEvent(item,index) {
    this.props.navigation.navigate(NavigationRoots.EventDetail, {
      id :item['id'],
    });
  }
  didSelectAccount(item,index) {
    this.props.navigation.navigate(NavigationRoots.MyStore, {
      accId :item['id'],
    });
  }
  /*  UI   */
  renderGridView = () => {
    return (<View style={{backgroundColor:colors.AppWhite}}>
        <FlatList
          data={[1,1,1,1,1,1,1,1]}
          renderItem={this.renderGridViewCellItem}
          numColumns={4}
          keyExtractor={(item, index) =>  'C' + index}
        />
      </View>)
  }
  renderGridViewCellItem = ({item, index}) => {
    if (index < 8) {
      if (this.state.categoryArray[index]){
        let dic = this.state.categoryArray[index];
        return (<TouchableOpacity style={styles.gridViewStyle} onPress={() => this.didSelectCategory(dic,index)}>
          <Image style={styles.imageThumbnail} source={ index == 7 ? moreIcon : {url: dic['image_path']}} resizeMode={'contain'}/>
          <View style={{height: 5}}/>
          <Text style={{textAlign: 'center', fontSize: 12}}>{ index == 7 ? 'More' : `${dic['name']}`}</Text>
        </TouchableOpacity>)
      } else {
        return <View />
      }
    } else {
      return <View />
    }
  }
  renderPromoView = () => {
    if (this.state.promoBannerArray != 0) {
    return <View style={{ backgroundColor: colors.LightBlueColor, marginBottom: -10}}>
      <FlatList
        data={this.state.promoBannerArray}
        horizontal={true}
        renderItem={this.renderPromoCellItem}
        extraData={this.state}
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
        style={{aspectRatio: 16/9}}
      />
    </View>
    } else {
      return <View />
    }
  }
  renderPromoCellItem = ({item, index}) => {
    var photo = item['image_path']
    return (<View style={styles.promoCellStyle}>
      <FastImage style={{ aspectRatio: 16/9, borderRadius: 5 }} source={photo.length == 0 ? dummy : {uri: photo}} />
      </View>)
   }
  renderEventView = () => {
    if (this.state.collectionsArray != 0) {
      return <View>
        {/* <View style={{height: 10}} /> */}
        <FlatList
          data={this.state.collectionsArray}
          horizontal={false}
          initialNumToRender={7}
          renderItem={this.renderEventItemCell}
          extraData={this.state}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
        />
      </View>
    } else {
      return <View />
    }
  }
  renderEventItemCell = ({item, index}) => {
    if (item['scope_type'] == 1 || item['scope_type'] == 4) {
      return (<View style={{ backgroundColor: colors.AppWhite }}>
        <View style={styles.eventCellItemStyle}>
          <Text style={{fontSize: 18, fontWeight: '700', color: colors.AppWhite, marginTop: 5}}>{item['title']}</Text>
        </View>
        <View style={{ backgroundColor: colors.AppWhite, width: windowWidth}}>
          <View style={{marginTop: -120}}>
            {this.renderHorizontalList(item)}
          </View>
        </View>
      </View>)
    } else {
      return <View />
    }
  }
  renderHorizontalList = (item) => {
    var listAry = []
    if (item['scope_type'] == 1) {
      listAry=  item['accounts'];
    } 
    if (item['scope_type'] == 4) {
      listAry=  item['listings'];
    }
    if (listAry.length != 0) {
      return <View style={{ backgroundColor: colors.lightTransparent }}>
        <FlatList
          data={listAry}
          horizontal={true}
          renderItem={this.renderHorizontalCellItem}
          extraData={this.state}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
        />
      </View>
    } else {
    return  <View />
    }
  }
  renderHorizontalCellItem = ({ item, index }) => {
    var photo = item['images'] ? item['images'] : [];

    if(item['user']) {
      return (<TouchableOpacity style={styles.horizontalCellItemStyle} onPress={() => this.didSelectAccount(item, index)}>
        <Image style={styles.selectedImageStyle} source={photo.length == 0 ? dummy : { uri: photo[0] }}/>
        <View style={{padding: 10}}>
        <Text style={{ fontWeight: '400', fontSize: 14}}>{item['name']}</Text>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <FastImage style={{ height: 25, width: 25, borderRadius: 12.5 }} source={{uri:item['user']['profile_pic']}} />
          <Text style={{ color: colors.Lightgray, fontSize: 10, padding: 5 }}>{`${item['user']['first_name']} ${item['user']['last_name']}`}</Text>
        </View>
        </View>
      </TouchableOpacity>)
    } else {
      if (item['list_price']) {
        return (<TouchableOpacity onPress={() => this.didSelectEvent(item, index)}>
          <EventView data={item} />
        </TouchableOpacity>)
      } else {
        return <View />
      }
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'ClassBubs'} showBackBtn={false} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <ScrollView>
          <View style={{backgroundColor: colors.LightBlueColor, height: '100%'}}>
            <View style={{ height: 10,backgroundColor: 'white'}} />
            <this.renderGridView />
            <this.renderPromoView />
            <this.renderEventView />
          </View>
        </ScrollView>
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
    aspectRatio: 16/9,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    flexDirection: 'row',
  },
  horizontalCellItemStyle: {
    width: windowWidth/2 - 25,
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
    width: '100%',
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
});

import bag from './../../assets/handbag.png';
import dress from './../../assets/dress.png';
import books from './../../assets/books.png';
import paper from './../../assets/book.png';
import tenis from './../../assets/tabletennis.png';
import game from './../../assets/game.png';
import notebookmousecursor from './../../assets/notebook.png';

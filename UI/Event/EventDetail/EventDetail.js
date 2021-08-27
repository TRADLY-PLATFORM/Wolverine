import React, { Component } from 'react';
import {
  FlatList,
  Alert,
  Text,
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActionSheetIOS,
} from 'react-native';
import NavigationRoots from '../../../Constants/NavigationRoots';
import HeaderView from '../../../Component/Header'
import colors from '../../../CommonClasses/AppColor';
import commonStyles from '../../../StyleSheet/UserStyleSheet';
import eventStyles from '../../../StyleSheet/EventStyleSheet';
import APPURL from '../../../Constants/URLConstants';
import networkService from '../../../NetworkManager/NetworkManager';
import appConstant from '../../../Constants/AppConstants';
import { Pages } from 'react-native-pages';
import FastImage from 'react-native-fast-image'
import sample from '../../../assets/dummy.png';
import starIcon from '../../../assets/star.png';
import calendarIcon from '../../../assets/calendar.png';
import locationPin from '../../../assets/locationPin.png';
import copy from '../../../assets/copy.png';
import whatsappIcon from '../../../assets/whatsapp.png';
import share from '../../../assets/share.png';
import heartIcon from '../../../assets/heartIcon.png';
import favouriteIcon from '../../../assets/favourite.png';
import RatingReview from '../../../Component/RatingReview';
import emptyStar from '../../../assets/emptyStar.png';
import radio from '../../../assets/radio.png';
import selectedradio from '../../../assets/selectedradio.png';
import Spinner from 'react-native-loading-spinner-overlay';
import {getTimeFormat,changeDateFormat} from '../../../HelperClasses/SingleTon'

const windowHeight = Dimensions.get('window').height;
const windowwidth = Dimensions.get('window').width;

export default class EventDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateUI: false,
      selectIndex: 0,
      selectedVariantId:0,
      selectedVariant:{},
      isVisible:false,
      imagesArray: [],
      eventDetailData: {},
      loadData: false,
      itsLiked:false,
      itsOwnEvent:true,
    }
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.setState({updateUI: !this.state.updateUI})
      this.getEventDetailApi();
    })
  }
  /*  APIs   */
  getEventDetailApi = async () => {
    this.setState({ isVisible: true })
    let {id} = this.props.route.params;
    const responseJson = await networkService.networkCall(APPURL.URLPaths.listings + `/${id}`, 'get', '', appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      let eData = responseJson['data']['listing'];
      console.log('eData ==> ', eData['liked']);
      this.state.eventDetailData = eData;
      this.state.itsLiked = eData['liked'];
      this.state.imagesArray = eData['images'];
      this.state.itsOwnEvent = this.state.eventDetailData['account']['id'] == appConstant.accountID ? true : false;
      let variants = this.state.eventDetailData['variants'];
      if (variants.length != 0){
        this.state.selectedVariantId = variants[0]['id'];
        this.state.selectedVariant = variants[0];
      }
      this.setState({updateUI: !this.state.updateUI, loadData: true,isVisible: false})
    } else {
      this.setState({ isVisible: false })
    }
  }
  LikesAPI = async () => {
    this.setState({ isVisible: true })
    const { id } = this.props.route.params;
    let method = this.state.itsLiked ? 'DELETE' : 'POST';
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.listings}/${id}/${APPURL.URLPaths.like}`, 
    method,'', appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      this.state.itsLiked = !this.state.itsLiked;
      this.setState({ updateUI: !this.state.updateUI, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  deleteEventAPI = async () => {
    this.setState({ isVisible: true })
    const {id} = this.props.route.params;
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.listings}/${id}`,'DELETE','', appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      this.setState({isVisible: false })
      this.succesDeleted()
    } else {
      this.setState({ isVisible: false })
    }
  }
  succesDeleted() {
    this.setState({isVisible: false })
    Alert.alert("Deleted", "",
      [
        {
          text: "OK", onPress: () => {
            this.props.navigation.popToTop();
          }
        }
      ],
    );
  }
  /*  Buttons   */
  didSelectVariant(item) {
    this.state.selectedVariant = item,
    this.setState({selectedVariantId: item['id']})
  }
  likeBtnAction () {
    if (appConstant.loggedIn){
      this.LikesAPI();
    } else {
      this.props.navigation.navigate(NavigationRoots.SignIn)
    }
  }
  bookBtnAction () {
    if (appConstant.loggedIn){
      this.props.navigation.navigate(NavigationRoots.ConfirmBooking,{
        eventData:this.state.eventDetailData,
        variantData: this.state.selectedVariant,
      });
    } else {
      this.props.navigation.navigate(NavigationRoots.SignIn)
    }
  }
  chatBtnAction() {
    if (appConstant.loggedIn){
      this.props.navigation.navigate(NavigationRoots.ChatScreen,{
        receiverData:this.state.eventDetailData['account']['user'],
      });
    } else {
      this.props.navigation.navigate(NavigationRoots.SignIn)
    }
  }
  moreBtnAction() {
    if (appConstant.loggedIn) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Edit", "Delete", "Cancel"],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 2,
          userInterfaceStyle: 'light'
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            const {id} = this.props.route.params;
            this.props.navigation.navigate(NavigationRoots.AddEvent, {
              accountId: appConstant.accountID,
              listingID: id,
            })
          } else if (buttonIndex === 1) {
            this.deleteEventBtnAction()
          } else if (buttonIndex === 2) {
            // setResult("🔮");
          }
        })
    }
  }
  deleteEventBtnAction() {
    Alert.alert(
      "Are you sure you want to delete this event?", "",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "Yes", onPress: () => {
             this.deleteEventAPI();
          }
        }
      ],
    );
  }
  /*  UI   */

  renderImageSlider = () => {
    var views = []
    var cDate = "";
    for (let a = 0; a < this.state.imagesArray.length; a++) {
      views.push(<View>
        <FastImage style={{ aspectRatio: 16 / 9 }} source={this.state.imagesArray.length == 0 ? sample : { uri: this.state.imagesArray[a] }} />
      </View>)
      cDate = changeDateFormat(this.state.eventDetailData['created_at'] * 1000, 'ddd, MMM D');

    }
    var likeView = [];
    if (!this.state.itsOwnEvent) {
      let icon = this.state.itsLiked ? favouriteIcon :  heartIcon
      likeView.push(
        <Image style={{ width: 40, height: 40 }} source={icon} />
      )
    }
    return (<View style={{ aspectRatio: 16 / 9 }}>
      <Pages>
        {views}
      </Pages>
      <TouchableOpacity style={styles.createDateViewStyle} onPress={() => this.likeBtnAction()}>
        <Text style={{ fontWeight: '600', fontSize: 11, color: colors.AppWhite }}>{cDate}</Text>
        {likeView}
      </TouchableOpacity>
    </View>)
  }
  renderEventDetail = () => {
    var ticket = '';
    var rattingAvg = '';
    var price = '';
    var title = '';

    if (this.state.eventDetailData['title']) {
      if (this.state.selectedVariantId != 0){
        let item = this.state.selectedVariant;
        let variant_values = item['variant_values'];
        var vValue = [];
        for (let obj of variant_values){
          vValue.push(obj['variant_type_value']['name']);
        }
        title = vValue.join(' | ');
        price = item['list_price']['formatted'];
        ticket = `Only ${item['stock']} tickets left`;

      } else {
        rattingAvg = this.state.eventDetailData['rating_data']['rating_average'];
        price = this.state.eventDetailData['list_price']['formatted'];
        ticket = `Only ${this.state.eventDetailData['stock']} tickets left`;
        title = this.state.eventDetailData['title']
      }
      return (<View>
        <Text style={eventStyles.titleStyle}>{title}</Text>
        <View style={{ height: 5 }} />
        <Text style={eventStyles.titleStyle}>{price}</Text>
        <View style={{ height: 5 }} />
        <Text style={{ fontSize: 12, fontWeight: '500', color:colors.AppTheme }}>{ticket}</Text>
      </View>)
    } else {
      return <View />
    }
  }
  renderUserDetail = () => {
    if (this.state.eventDetailData['title']) {
      let item = this.state.eventDetailData['account'];
      let follow = item['following'] ? 'Following' : 'Follow'
      var photo = item['images'] ? item['images'] : [];
      return (<View>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems : 'center' }}>
            <Image style={{ height: 32, width: 32, borderRadius: 16 }} source={photo.length == 0 ? sample : { uri: photo[0] }} />
            <View style={{ width: 10 }} />
            <Text style={eventStyles.commonTxtStyle}>{item['name']}</Text>
          </View>
          <View>
            <View>
              <Text style={{fontSize: 14, fontWeight: '600', color: colors.AppTheme}}>{follow}</Text>
            </View>
          </View>
        </View>
      </View>)
    } else {
      return <View />
    }
  }
  renderTimeAddressDetail = () => {
    if (this.state.eventDetailData['title']) {
      let item = this.state.eventDetailData;
      let dateFr = changeDateFormat(item['start_at']  * 1000, 'ddd, MMM D');
      time = getTimeFormat(item['start_at']) + ` to ` +  getTimeFormat(item['end_at']) 
      let location = item['location'];
      return (<View style={{flexDirection: 'row'}}>
        <View style={{width: '75%'}}>
          <View style={{ flexDirection: 'row'}}>
            <Image style={commonStyles.backBtnStyle} resizeMode={'contain'} source={calendarIcon} />
            <View style={{ width: 10 }} />
            <View>
              <Text style={eventStyles.commonTxtStyle}>{dateFr}</Text>
              <View style={{ height: 5 }} />
              <Text style={eventStyles.subTitleStyle}>{time}</Text>
            </View>
          </View>
          <View style={{ height: 20 }} />
          <View style={{ flexDirection: 'row'}}>
            <Image style={commonStyles.backBtnStyle} resizeMode={'contain'} source={locationPin} />
            <View style={{ width: 10 }} />
            <View>
              <Text style={eventStyles.commonTxtStyle}>{location['formatted_address']}</Text>
            </View>
          </View>
        </View>
      </View>)
    } else {
      return <View />
    }
  }
  renderVariantListView = () => {
    let variants = this.state.eventDetailData['variants'];
    if (variants != undefined && variants.length != 0) {
      return (<View style={{backgroundColor: colors.LightBlueColor}}>
        <View>
          <FlatList
            data={variants}
            renderItem={this.renderVariantListViewCellItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index + 999}
            key={'A'}
          />
        </View>
        <View style={{ height: 10 }} />
      </View>)
    } else {
      return <View />
    }
  }
  renderVariantListViewCellItem = ({item,index}) => {
    let check = item['id'] == this.state.selectedVariantId;
    let variant_values = item['variant_values'];
    var vValue = [];
    for (let obj of variant_values){
      vValue.push(obj['variant_type_value']['name']);
    }
    let title = vValue.join(' | ')
    return (<View style={eventStyles.variantListViewStyle}>
      <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.didSelectVariant(item)}>
        <View style={{ width: '90%' }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: colors.AppTheme }}>
            {`${item['stock']} tickets left`}
          </Text>
          <View style={{ height: 5 }} />
          <Text style={eventStyles.commonTxtStyle}>{title}</Text>
          <View style={{ height: 5 }} />
          <Text style={{ fontWeight: '400', fontSize: 12 }}>{item['list_price']['formatted']}</Text>
          <View style={{ height: 5 }} />
          <Text style={eventStyles.subTitleStyle}>{item['description']}</Text>
        </View>
        <View style={{ alignItems: 'center', margin: 10, marginTop: 16 }}>
          <Image style={commonStyles.nextIconStyle} source={check ? selectedradio : radio} />
        </View>
      </TouchableOpacity>
    </View>)
  }
  renderShareView = () => {
    return (<View>
        <Text style={eventStyles.commonTxtStyle}>Share</Text>
        <View style={{height: 10}}/>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <View style={styles.whatsappViewStyle}>
            <Image style={{height: 20, width: 20}} resizeMode={'center'} source={whatsappIcon}/>
          </View>
          <View style={styles.whatsappViewStyle}>
            <Image style={{height: 20, width: 20}} resizeMode={'center'} source={copy}/>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image style={{height: 20, width: 20}} resizeMode={'center'} source={share}/>
          </View>
        </View>
      </View>)
  }
  renderEventDescriptionView = () => {
    var description = '';
    if (this.state.selectedVariantId != 0) {
      description = this.state.selectedVariant['description'];
    } else {
      description = this.state.eventDetailData['description'];
    }
    if (description.length != 0) {
      return (<View style={styles.commonViewStyle}>
        <Text style={eventStyles.commonTxtStyle}>Event description</Text>
        <View style={{ height: 10 }} />
        <Text style={eventStyles.subTitleStyle}>{description}</Text>
      </View>)
    } else {
      return <View />
    }
  }
  renderOtherEventView = () => {
    return (<View>
        <Text style={eventStyles.commonTxtStyle}>Other Events</Text>
        <View style={{height: 10}}/>
        {this.renderOthersListView()}
      </View>)
  }
  renderOthersListView = () => {
    return (<View> 
      <FlatList 
        data={[1,1,1,1,1,1,1,1,1]}
        renderItem={this.renderOthersListViewCellItem}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index + 9909}
        horizontal={true}
        key={'O'}
      />
    </View>)
  }
  renderOthersListViewCellItem = ({ item, index }) => {
    return (<View style={styles.horizontalCellItemStyle}>
      <View>
        <View>
          <Image style={styles.selectedImageStyle} source={sample} />
        </View>
        <View style={{justifyContent: 'space-between', position: 'absolute', padding: 5, flexDirection: 'row', width: '100%'}} >
          <Text style={{ fontWeight: '600', fontSize: 11, color:colors.AppWhite}}>15 hours ago</Text>
          <Image style={{width: 30, height: 30}} source={heartIcon} />
        </View>
      </View>
      <View style={{padding: 5}}>
        <Text style={{ fontWeight: '600', fontSize: 13}}>Online Conferance </Text>
        <View style={{height: 5}}/>
        <Text style={{ fontWeight: '400', fontSize: 12}}>Mon, May 31</Text>
        <View style={{height: 5}}/>
        <Text style={eventStyles.subTitleStyle}>188 Attending</Text>
      </View>
    </View>)
  }
  renderArrtibutes = () => {
    if (this.state.eventDetailData['attributes']) {
      let attributesAry = this.state.eventDetailData['attributes'];
      var views = [];
      for (let a = 0; a < attributesAry.length; a++) {
        let item = attributesAry[a];
        var values = [];
        if (item['field_type'] == 1 || item['field_type'] == 2) {
          for (let obj of item['values']) {
            values.push(obj['name']);
          }
        } else {
          values = item['values']
        }
        if (item['field_type'] == 5) {
          views.push(<View style={{ flexDirection: 'row'}}>
            <View style={{ width: '40%', height: 40,justifyContent: 'center' }}>
              <Text style={eventStyles.subTitleStyle}>{item['name']}</Text>
            </View>
            <TouchableOpacity style={{ width: '60%', height: 40,justifyContent: 'center' }}>
              <Text style={styles.greenLinkStyle}>{values.toString()}</Text>
            </TouchableOpacity>
          </View>)
        } else {
          views.push(<View style={{ flexDirection: 'row'}}>
            <View style={{ width: '40%', height: 40,  justifyContent: 'center' }}>
              <Text style={eventStyles.subTitleStyle}>{item['name']}</Text>
            </View>
            <View style={{ width: '60%', height: 40, justifyContent: 'center' }}>
              <Text style={styles.textStyle}>{values.toString()}</Text>
            </View>
          </View>)
        }
      }
    }
    if (views.length != 0) {
      return( <View style={styles.commonViewStyle}> 
      <Text style={eventStyles.commonTxtStyle}>Details</Text>
        {views}
      </View>)
    } else {
      return<View />
    }
  }
  renderReviewView = () => {
    return (<View>
        <Text style={eventStyles.commonTxtStyle}>10 Reviews</Text>
        <View style={{height: 10}}/>
        {this.renderReviewListView()}
      </View>)
  }
  renderReviewListView = () => {
    return (<View> 
      <FlatList 
        data={[1,1]}
        renderItem={this.renderReviewListViewCellItem}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index + 990989}
        key={'R'}
      />
    </View>)
  }
  renderReviewListViewCellItem = ({ item, index }) => {
    var views = [];
    for (let a = 0; a < 5; a++) {
      views.push(<View>
        <Image  style={{height: 10, width: 10}} source={a != 4 ? starIcon : emptyStar}/>
      </View>)
    }
    return (<View style={{marginTop: 20}}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image style={{ height: 32, width: 32, borderRadius: 16 }} source={ sample} />
        <View style={{ width: 10 }} />
        <Text style={eventStyles.commonTxtStyle}>{'Saini'}</Text>
      </View>
      <View style={{flexDirection: 'row',marginTop: 7, alignItems: 'center'}}>
        {views}
        <Text style={{marginLeft: 10, fontWeight: '400', fontSize: 11, color: colors.Lightgray }}>
          June 15 2021
        </Text>
      </View>
      <View>
        <Text style={{marginTop: 10, fontWeight: '400', fontSize: 12, color: colors.Lightgray}}>
          It's very nice . Soft fabric . Light weight .
          Not transparent. Colour looks elegant . I haven't washed yet .
          Very nice fit Neck is perfect not very deep . Only minus.
        </Text>
      </View>
    </View>)
  }
  renderBottomBtnView = () => {
    
    if (!this.state.itsOwnEvent){
    return (<View style={styles.commonViewStyle}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
      <TouchableOpacity style={styles.bottomBtnViewStyle} onPress={() => this.bookBtnAction()}>
        <View style={eventStyles.clearBtnViewStyle}>
          <Text style={{ color:colors.AppTheme,fontWeight: '600'}}>Book Now</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomBtnViewStyle} onPress={ () => this.chatBtnAction()}>
        <View style={eventStyles.applyBtnViewStyle}>
          <Text style={{ color: colors.AppWhite,fontWeight: '600' }}>Chat</Text>
        </View>
      </TouchableOpacity>
      </View>
    </View>)
    }else {
      return <View />
    }
    
  }
  renderMainView = () => {
    if (this.state.loadData) {
      return (<View style={{height: '100%'}}>
        <View style={{ aspectRatio: 16 / 9 }}>
          {this.renderImageSlider()}
        </View>
        <View style={styles.commonViewStyle}>
          {this.renderEventDetail()}
        </View>
        {/* <View style={{ height: 10 }} />
        <View style={styles.commonViewStyle}>
          {this.renderUserDetail()}
        </View> */}
        <View style={{ height: 10 }} />
        <View>
          {this.renderVariantListView()}
        </View>
        <View style={styles.commonViewStyle}>
          {this.renderTimeAddressDetail()}
        </View>
        {/* <View style={{ height: 10 }} />
        <View style={styles.commonViewStyle}>
          {this.renderShareView()}
        </View> */}
         <View style={{ height: 10 }} />
        <View>
          {this.renderArrtibutes()}
        </View>
        <View style={{ height: 10 }} />
        <View >
          {this.renderEventDescriptionView()}
        </View>
        {/* <View style={styles.clearViewStyle}>
          {this.renderOtherEventView()}
        </View> */}
        {/* <View style={styles.clearViewStyle}>
          <RatingReview />
        </View> */}
        {/* <View style={styles.clearViewStyle}>
          {this.renderReviewView()}
        </View> */}
        <View style={{ height: 40 }} />
      </View>)
    } else {
      return (<View />)
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={''} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} 
         showDoneBtn={this.state.itsOwnEvent} doneBtnTitle={'More'} doneBtnAction={() => this.moreBtnAction()}/>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor, justifyContent: 'space-between' }}>
          <ScrollView nestedScrollEnable={true} scrollEnabled={true}>
            <View style={{ height: '100%', backgroundColor: colors.LightBlueColor }}>
             {this.renderMainView()}
            </View>
          </ScrollView>
          <View>
            <View style={{ height: 10 }} />
            {this.renderBottomBtnView()}
            <View style={{ height: 50 }} />
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
  commonViewStyle: {
    padding: 16,
    backgroundColor: colors.AppWhite,
    borderWidth: 1, 
    borderColor: colors.LightUltraGray,
  },
  clearViewStyle: {
    padding: 16,
    backgroundColor: colors.LightBlueColor
  },
  whatsappViewStyle: {
    borderColor: colors.AppTheme,
    borderWidth: 1,
    backgroundColor: colors.AppWhite,
    height: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
  },
  horizontalCellItemStyle: {
    width: 140,
    height: 170,
    margin: 5,
    backgroundColor: colors.AppWhite,
    borderRadius: 10,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
  },
  selectedImageStyle: {
    width: 140,
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomBtnViewStyle: {
    width: '45%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 2,
    borderRadius: 20,
  },
  createDateViewStyle:{
    justifyContent: 'space-between', position: 'absolute', padding: 10, flexDirection: 'row', width: '100%',
  }
});


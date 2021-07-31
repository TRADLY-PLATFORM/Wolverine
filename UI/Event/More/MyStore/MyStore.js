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
import NavigationRoots from '../../../../Constants/NavigationRoots';
import HeaderView from '../../../../Component/Header'
import colors from '../../../../CommonClasses/AppColor';
import commonStyles from '../../../../StyleSheet/UserStyleSheet';
import eventStyles from '../../../../StyleSheet/EventStyleSheet';
import APPURL from '../../../../Constants/URLConstants';
import networkService from '../../../../NetworkManager/NetworkManager';
import appConstant from '../../../../Constants/AppConstants';
import sample from '../../../../assets/dummy.png';
import locationIcon from '../../../../assets/locationIcon.png';
import starIcon from '../../../../assets/star.png';
import shareIcon from '../../../../assets/share.png';
import product from '../../../../assets/product.png';
import productGray from '../../../../assets/productGray.png';
import info from '../../../../assets/info.png';
import infoGreen from '../../../../assets/infoGreen.png';
import plusIcon from '../../../../assets/plusIcon.png';
import emptyStar from '../../../../assets/emptyStar.png';
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image'
import RatingReview from '../../../../Component/RatingReview';

// const windowWidth = Dimensions.get('window').width;

export default class MyStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventsArray: [],
      isVisible: false,
      updateUI: false,
      segmentIndex: 0,
      storeDetail: {},
      activeSatus: false,
      starRatingValue: 0,
      pageNo: 1,
      stopPagination: false,
    }
  }

  componentDidMount() {
    // this.apiCalls();
    this.props.navigation.addListener('focus', () => {
      this.apiCalls();
    });
  }
  apiCalls() {
    this.state.stopPagination = false
    this.state.pageNo = 1;
    this.setState({ updateUI: !this.state.updateUI })
    this.getMyStoreDetailApi();
    this.getEventsApi();
  }
  getMyStoreDetailApi = async () => {
    this.setState({ isVisible: true })
    const { accId } = this.props.route.params;
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.accounts}/${accId}`, 'get', '', appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      let acctData = responseJson['data']['account'];
      this.state.storeDetail = acctData;
      this.state.activeSatus = acctData['active'];
      this.setState({ updateUI: !this.state.updateUI})
    } else {
      this.setState({ isVisible: false })
    }
  }
  getEventsApi = async () => {
    this.setState({ isVisible: true })
    const { accId } = this.props.route.params;
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.listings}?account_id=${accId}&page=${this.state.pageNo}&per_page=30&type=events`,
      'get', '', appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      let events = responseJson['data']['listings'];
      if (events.length != 0) {
        for(let objc of events){
          this.state.eventsArray.push(objc);
        }
      }else {
        this.state.stopPagination = true
      }
      this.setState({ updateUI: !this.state.updateUI, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  updateStatusAPI = async () => {
    this.setState({ isVisible: true })
    const { accId } = this.props.route.params;
    let dict = {
      active: !this.state.activeSatu,
    }
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.accounts}/${accId}`, 'patch',
      JSON.stringify({ account: dict }), appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      this.state.activeSatus = !this.state.activeSatus;
      this.setState({ updateUI: !this.state.updateUI, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }

  /*  Buttons   */
  didSelect = item => {
    const { accId } = this.props.route.params;
    this.props.navigation.navigate(NavigationRoots.AddEvent, {
      accountId: accId,
      listingID: item['id'],
    })
  }
  doneBtnAction() {
  }
  activeBtnAction() {
    this.updateStatusAPI()
  }
  editBtnAction() {
    this.props.navigation.navigate(NavigationRoots.CreateStore, { storeDetail: this.state.storeDetail })
  }
  addEventBtnAction() {
    const { accId } = this.props.route.params;
    this.props.navigation.navigate(NavigationRoots.AddEvent, {
      accountId: accId,
    })
  }
  ratingStarBtnAction(id) {
    this.setState({ starRatingValue: id + 1 })
  }
  paginationMethod = () => {
    console.log('pagination');
    if (!this.state.stopPagination){
     this.state.pageNo = this.state.pageNo + 1;
     this.getEventsApi();
    }
   }
   didSelectEventList(item, index) {
    this.props.navigation.navigate(NavigationRoots.EventDetail, {
      id :item['id'],
    });
  }
  /*  UI   */

  renderProfileView = () => {
    var address = ''
    var review = ''
    if (this.state.storeDetail['location']) {
      let add = this.state.storeDetail['location']
      address = add['formatted_address'];
      let reRate = this.state.storeDetail['rating_data']
      review = reRate['rating_average'];
    }
    return (<View style={styles.headerContainderStyle}>
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 16 }}>
          <FastImage source={sample} style={{ height: 60, width: 60, borderRadius: 30 }} />
          <View style={{ marginLeft: 16 }}>
            <Text style={eventStyles.titleStyle}>{this.state.storeDetail['name']}</Text>
            <View style={{ flexDirection: 'row', marginLeft: -5, marginTop: 5, alignItems: 'center', width: '50%' }}>
              <Image source={locationIcon} style={{ height: 20, width: 20 }} resizeMode={'center'} />
              <Text style={eventStyles.subTitleStyle} numberOfLines={1}>{address}</Text>
              <View style={{ width: 5 }} />
              <Text style={styles.greenLinkStyle}>View Location</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={styles.ratingViewStyle} >
            <View style={{ flexDirection: 'row' }}>
              <Text>3.0</Text>
              <Image source={starIcon} style={{ height: 20, width: 20, marginTop: -2 }} resizeMode={'center'} />
            </View>
            <View style={{ height: 5 }} />
            <Text style={eventStyles.subTitleStyle}>0 review</Text>
          </View>
          <View style={styles.totalProductViewStyle}>
            <Text>{this.state.storeDetail['total_listings']}</Text>
            <View style={{ height: 5 }} />
            <Text style={eventStyles.subTitleStyle}>Total Events</Text>
          </View>
          <View style={styles.ratingViewStyle}>
            <Text>{this.state.storeDetail['total_followers']}</Text>
            <View style={{ height: 5 }} />
            <Text style={eventStyles.subTitleStyle}>Followers</Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 2 }}>
        <View style={styles.ratingViewStyle}>
          <TouchableOpacity style={this.state.activeSatus ? styles.activeBntViewStyle : styles.inActiveBtnViewStyle}
            onPress={() => this.activeBtnAction()}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: this.state.activeSatus ? colors.AppTheme : colors.AppYellow }}>
              {this.state.activeSatus ? 'Active' : 'In-Active'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ratingViewStyle}>
          <View style={styles.activeBntViewStyle}>
            <Image source={shareIcon} style={{ height: 15, width: 15 }} resizeMode={'center'} />
          </View>
        </View>
        <View style={styles.ratingViewStyle}>
          <TouchableOpacity style={styles.activeBntViewStyle} onPress={() => this.editBtnAction()}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.AppTheme, }}>Edit Store</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>)
  }

  renderSegmentBar = () => {
    return (<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: -15 }}>
      <TouchableOpacity onPress={() => this.setState({ segmentIndex: 0 })}
        style={this.state.segmentIndex == 0 ? styles.selectedSegmentViewStyle : styles.segmentViewStyle}>
        <Image source={this.state.segmentIndex == 0 ? product : productGray} style={{ height: 20, width: 20 }} resizeMode={'center'} />
        <View style={{ height: 5 }} />
        <Text style={{ fontSize: 10, fontWeight: '500', color: this.state.segmentIndex == 0 ? colors.AppTheme : colors.Lightgray }}>
          Events(12)
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.setState({ segmentIndex: 1 })}
        style={this.state.segmentIndex == 1 ? styles.selectedSegmentViewStyle : styles.segmentViewStyle}>
        <Image source={this.state.segmentIndex == 0 ? info : infoGreen} style={{ height: 20, width: 20 }} resizeMode={'center'} />
        <View style={{ height: 5 }} />
        <Text style={{ fontSize: 10, fontWeight: '500', color: this.state.segmentIndex == 1 ? colors.AppTheme : colors.Lightgray }}>
          About
        </Text>
      </TouchableOpacity>
    </View>)
  }
  renderFilterView = () => {
    return (<View style={{ height: 40, justifyContent: 'space-between', flexDirection: 'row', padding: 16 }}>
      <View style={{ height: 20 }}>
        {/* <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: colors.AppGray }}>All</Text>
          <Image source={dropdownIcon} style={{ marginLeft: 10, height: 12, width: 12 }} resizeMode={'center'} />
        </TouchableOpacity> */}
      </View>
      <View style={{ height: 20, flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => this.addEventBtnAction()}>
          <Image source={plusIcon} style={{ height: 30, width: 30 }} resizeMode={'center'} />
        </TouchableOpacity>
      </View>
    </View>)
  }
  renderAboutView = () => {
    return (<View style={{ margin: 16, marginTop: 5 }}>
      <View style={{ borderWidth: 1, borderColor: colors.BorderColor, borderRadius: 2, backgroundColor: colors.AppWhite }}>
        <Text style={{ padding: 5, fontSize: 12 }}>{this.state.storeDetail['description']}</Text>
        {this.renderArrtibutes()}
      </View>
      <View style={{ height: 20 }} />
      {this.renderRateStoreView()}
      <View style={{ height: 20 }} />
      <RatingReview />
      {/* {this.renderRatingReviewView()} */}
      {/* <View style={{ height: 20 }} />
      {this.renderReviewView()} */}
    </View>)
  }
  renderArrtibutes = () => {
    if (this.state.storeDetail['attributes']) {
      let attributesAry = this.state.storeDetail['attributes'];
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
          views.push(<View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: colors.BorderColor }}>
            <View style={{ width: '40%', height: 40, padding: 5, justifyContent: 'center' }}>
              <Text style={eventStyles.subTitleStyle}>{item['name']}</Text>
            </View>
            <TouchableOpacity style={{ width: '60%', height: 40, padding: 5, justifyContent: 'center' }}>
              <Text style={styles.greenLinkStyle}>{values.toString()}</Text>
            </TouchableOpacity>
          </View>)
        } else {
          views.push(<View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: colors.BorderColor }}>
            <View style={{ width: '40%', height: 40, padding: 5, justifyContent: 'center' }}>
              <Text style={eventStyles.subTitleStyle}>{item['name']}</Text>
            </View>
            <View style={{ width: '60%', height: 40, padding: 5, justifyContent: 'center' }}>
              <Text style={styles.textStyle}>{values.toString()}</Text>
            </View>
          </View>)
        }
      }
    }
    return views;
  }
  renderRateStoreView = () => {
    var views = []
    var starViews = [];
    for (let a = 0; a < 5; a++) {
      starViews.push(<TouchableOpacity style={{ margin: 16 }} onPress={() => this.ratingStarBtnAction(a)}>
        <Image source={this.state.starRatingValue > a ? starIcon : emptyStar} style={{ height: 30, width: 30 }} />
      </TouchableOpacity>
      )
    }
    views.push(<View>
      <Text style={eventStyles.titleStyle}>{`Rate This Store`}</Text>
      <View style={{ height: 5 }} />
      <Text style={eventStyles.subTitleStyle}>{`Tell others what you think`}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {starViews}
      </View>
      <Text style={{ fontSize: 12, fontWeight: '500', color: colors.AppTheme }}>
        {`Write a review`}
      </Text>
    </View>)
    return views;
  }
  renderRatingReviewView = () => {
    var views = []
    var allStartView = [];
    var valueView = [];
    var progressView = [];
    for (let a = 0; a < 5; a++) {
      var starView = [];
      for (let b = 0; b <= a; b++) {
        starView.push(<View style={{ flexDirection: 'row', margin: 5 }}>
          <Image source={starIcon} style={{ height: 15, width: 15 }} />
        </View>)
      }
      allStartView.push(<View>
        {starView}
      </View>)
      progressView.push(<View style={{ borderRadius: 5, backgroundColor: 'red', height: 10, width: 10 * a + 10, margin: 5, marginTop: 10 }} />)
      valueView.push(<View style={{ margin: 5 }}>
        <Text style={eventStyles.subTitleStyle}>{10 * a} </Text>
      </View>)
    }

    views.push(<View>
      <Text style={eventStyles.titleStyle}>{`Ratings and reviews`}</Text>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: '25%', marginTop: 10 }}>
          <Text style={{ fontWeight: '600', fontSize: 44 }}>{'4.4'}</Text>
          <Text style={eventStyles.subTitleStyle}>{`216 ratings`}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            {allStartView}
          </View>
          <View style={{ width: '33%' }}>
            {progressView}
          </View>
          <View>
            {valueView}
          </View>
        </View>
      </View>
    </View>)
    return views;
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
        keyExtractor={(item, index) => index}
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
  renderEventView = () => {
    return <View style={{ backgroundColor: colors.lightTransparent}}>
      <FlatList
        data={this.state.eventsArray}
        numColumns={2}
        renderItem={this.renderHorizontalCellItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={2}
        onEndReached={this.paginationMethod}
      />
    </View>
  }
  renderHorizontalCellItem = ({ item, index }) => {
    let price = item['list_price'];
    var photo = item['images'] ? item['images'] : [];
    return (<TouchableOpacity style={styles.horizontalCellItemStyle} onPress={() => this.didSelect(item)}>
      <FastImage style={styles.selectedImageStyle} source={photo.length == 0 ? sample : { uri: photo[0] }} />
      <View style={{ padding: 2 }}>
        <Text style={{ fontWeight: '600', fontSize: 12, padding: 3 }}>{item['title']}</Text>
        {/* <Text style={{fontWeight: '500',fontSize: 12,padding: 3}}>{price['formatted']}</Text>
        <Text style={styles.cellItemTextStyle}>Start Date: {startDate}</Text>
        <Text style={styles.cellItemTextStyle}>End Date: {endDate}</Text> */}
        <View style={{ height: 5 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }}>
            <Image style={{ height: 25, width: 25, borderRadius: 12.5 }} source={sample} />
            <Text style={{ color: colors.Lightgray, fontSize: 10, padding: 5 }}>{item['account']['name']}</Text>
          </View>
          <View>
            <View style={eventStyles.followContainerStyle}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.AppWhite }}>{price['formatted']}</Text>
            </View>
          </View>
        </View>
        <View style={{ height: 5 }} />
      </View>
    </TouchableOpacity>)
  }

  renderTabActionView = () => {
    if (this.state.segmentIndex == 0) {
      return (<View>
        {this.renderEventView()}
      </View>)
    } else {
      return (<View>
        <ScrollView>
          {this.renderAboutView()}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>)
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'My Store'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View>
          <View style={{ position: 'relative', flexDirection: 'column' }}>
            <View style={{ backgroundColor: colors.AppTheme, height: '10%' }}>
            </View>
            <View style={{ backgroundColor: colors.LightBlueColor, height: '100%' }}>
              <View style={styles.headerContainerViewStyle} >
                <this.renderProfileView />
              </View>
              <this.renderSegmentBar />
              <this.renderFilterView />
              <View style={{ height: 10 }} />
              <View style={{height: '45%'}}>
                <this.renderTabActionView />
              </View>
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
    backgroundColor: colors.AppTheme
  },
  headerContainerViewStyle: {
    marginTop: '-25%',
    // backgroundColor: colors.AppWhite,
    flexDirection: 'row',
    margin: 20,
    borderRadius: 5,
  },
  headerContainderStyle: {
    borderRadius: 5,
    borderColor: colors.BorderColor,
    borderWidth: 1,
    // height: 200,
    backgroundColor: colors.AppWhite,
    width: '100%'
  },
  greenLinkStyle: {
    color: colors.AppTheme,
    fontSize: 12,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  ratingViewStyle: {
    backgroundColor: colors.AppWhite,
    height: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalProductViewStyle: {
    backgroundColor: colors.AppWhite,
    height: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.BorderColor,
  },
  activeBntViewStyle: {
    backgroundColor: colors.AppWhite,
    width: 75,
    height: 25,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    borderColor: colors.AppTheme,
    borderWidth: 1
  },
  inActiveBtnViewStyle: {
    backgroundColor: colors.AppWhite,
    width: 75,
    height: 25,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    borderColor: colors.AppYellow,
    borderWidth: 1
  },
  selectedSegmentViewStyle: {
    flex: 1,
    height: 60,
    borderBottomWidth: 3,
    borderBottomColor: colors.AppTheme,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentViewStyle: {
    flex: 1,
    height: 60,
    borderBottomWidth: 3,
    borderBottomColor: colors.BorderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: colors.AppGray,
    fontSize: 12,
    fontWeight: '400',
  },
  horizontalCellItemStyle: {
    // height: 250,
    width: '45%',
    margin: 10,
    backgroundColor: colors.AppWhite,
    borderRadius: 10,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
  },
  selectedImageStyle: {
    height: 120,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cellItemTextStyle: {
    fontWeight: '500',
    fontSize: 10,
    padding: 3
  },
});


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
import grid from '../../../../assets/grid.png';
import listIcon from '../../../../assets/list.png';
import dropdownIcon from '../../../../assets/dropdown.png';


// const windowWidth = Dimensions.get('window').width;

export default class MyStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myStoreArray: [],
      updateUI: false,
      segmentIndex: 0,
      storeDetail:{},
    }
  }

  componentDidMount() {
    this.setState({updateUI: !this.state.updateUI})
    this.getMyStoreDetailApi();
  }
  getMyStoreDetailApi = async () => {
    this.setState({ isVisible: true })
    const {accId} = this.props.route.params;
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.accounts}/${accId}`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let acctData = responseJson['data']['account'];
      this.state.storeDetail = acctData;
      console.log('acctData == >',acctData)
      this.state.myStoreArray = acctData;
      this.setState({ updateUI: !this.state.updateUI,isVisible: false })
    }else {
      this.setState({ isVisible: false })
    }
  }
  /*  Buttons   */
  didSelect = (item, itemData) => {
  }
  doneBtnAction () {
  }
  /*  UI   */

  renderProfileView = () => {
    var address =  ''
    if (this.state.storeDetail['location']) {
      let add = this.state.storeDetail['location']
      address = add['formatted_address'];
    }
    return (<View style={styles.headerContainderStyle}>
      <View style={{ flexDirection: 'column'}}>
        <View style={{flexDirection: 'row',alignItems: 'center', margin: 16 }}>
        <Image source={sample} style={{ height: 60, width: 60, borderRadius: 30 }} />
        <View style={{ marginLeft: 16 }}>
          <Text style={styles.titleStyle}>{this.state.storeDetail['name']}</Text>
          {/* <Text style={styles.subTitleStyle}>{this.state.storeDetail['description']}</Text> */}
          <View style={{flexDirection: 'row', marginLeft: -5, marginTop: 5, alignItems: 'center', width:'50%'}}>
            <Image source={locationIcon} style={{height: 20,width: 20}} resizeMode= {'center'} />
            <Text style={styles.subTitleStyle} numberOfLines={1}>{address}</Text>
            <Text style={styles.greenLinkStyle}>View Location</Text>
          </View>
        </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={styles.ratingViewStyle} >
            <View style={{ flexDirection: 'row' }}>
              <Text>3.0</Text>
              <Image source={starIcon} style={{ height: 20, width: 20, marginTop: -2 }} resizeMode={'center'} />
            </View>
            <View style={{ height: 5 }} />
            <Text style={styles.subTitleStyle}>0 review</Text>
          </View>
          <View style={styles.totalProductViewStyle}>
            <Text>{this.state.storeDetail['total_listings']}</Text>
            <View style={{ height: 5 }} />
            <Text style={styles.subTitleStyle}>Total Products</Text>
          </View>
          <View style={styles.ratingViewStyle}>
          <Text>{this.state.storeDetail['total_followers']}</Text>
            <View style={{ height: 5 }} />
            <Text style={styles.subTitleStyle}>Followers</Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 2}}>
        <View style={styles.ratingViewStyle}>
          <View style={styles.buttonsViewContainerStyle}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.AppTheme, }}>Active</Text>
          </View>
        </View>
        <View style={styles.ratingViewStyle}>
          <View style={styles.buttonsViewContainerStyle}>
            <Image source={shareIcon} style={{ height: 15, width: 15}} resizeMode={'center'} />
          </View>
        </View>
        <View style={styles.ratingViewStyle}>
          <View style={styles.buttonsViewContainerStyle}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.AppTheme, }}>Edit Store</Text>
          </View>
        </View>
      </View>
    </View>)
  }
  
  renderSegmentBar = () => {
    return (<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <TouchableOpacity onPress={() => this.setState({ segmentIndex: 0 })}
        style={this.state.segmentIndex == 0 ? styles.selectedSegmentViewStyle : styles.segmentViewStyle}>
        <Image source={this.state.segmentIndex == 0 ? product : productGray} style={{ height: 20, width: 20 }} resizeMode={'center'} />
        <View style={{ height: 5 }} />
        <Text style={{ fontSize: 10, fontWeight: '500', color: this.state.segmentIndex == 0 ? colors.AppTheme : colors.Lightgray }}>
          Products(12)
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
    return (<View style={{height: 40, justifyContent: 'space-between', flexDirection: 'row', padding: 16}}>
      <View style={{ height: 20 }}>
        {/* <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: colors.AppGray }}>All</Text>
          <Image source={dropdownIcon} style={{ marginLeft: 10, height: 12, width: 12 }} resizeMode={'center'} />
        </TouchableOpacity> */}
      </View>
      <View style={{ height: 20, flexDirection: 'row' }}>
        <TouchableOpacity>
        <Image source={grid} style={{height: 20, width: 20}} resizeMode={'center'} />
        </TouchableOpacity>
      </View>
    </View>)
  }
  renderAboutView = () => {

  }

  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'My Store'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}/>
          <View style={{position: 'relative', flexDirection: 'column' }}>
            <View style={{ backgroundColor: colors.AppTheme, height: '10%' }}>
            </View>
            <View style={{ backgroundColor: colors.LightBlueColor, height: '100%'}}>
              <View style={styles.headerContainerViewStyle} >
                <this.renderProfileView />
              </View>
              <this.renderSegmentBar />
              <this.renderFilterView />
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
    marginTop: '-22%',
    // backgroundColor: colors.AppWhite,
    flexDirection: 'row',
    margin: 20,
    borderRadius: 5,
  },
  headerContainderStyle: {
    margin: 0,
    borderRadius: 5,
    borderColor: colors.BorderColor,
    borderWidth: 1,
    // height: 200,
    backgroundColor: colors.AppWhite,
    width: '100%'
  },
  titleStyle: {
    color: colors.AppGray,
    fontSize: 14,
    fontWeight: '700'
  },
  subTitleStyle: {
    color: colors.Lightgray,
    fontSize: 12,
    fontWeight: '400',
  },
  greenLinkStyle: {
    color: colors.AppTheme,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 10,
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
    borderLeftWidth:1, 
    borderColor: colors.BorderColor,
  },
  buttonsViewContainerStyle: {
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
  selectedSegmentViewStyle: {
    flex: 1,
    height: 60,
    borderBottomWidth:3,
    borderBottomColor:colors.AppTheme,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentViewStyle: {
    flex: 1,
    height: 60,
    borderBottomWidth:3,
    borderBottomColor:colors.BorderColor,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


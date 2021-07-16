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
import NavigationRoots from '../../../Constants/NavigationRoots';
import HeaderView from '../../../Component/Header'
import colors from '../../../CommonClasses/AppColor';
import cameraIcon from '../../../assets/camera.png';
import upload from '../../../assets/upload.png';
import dropdownIcon from '../../../assets/dropdown.png';
import commonStyles from '../../../StyleSheet/UserStyleSheet';
import Spinner from 'react-native-loading-spinner-overlay';
import errorHandler from '../../../NetworkManager/ErrorHandle'
import ImagePicker from 'react-native-image-crop-picker';
import APPURL from '../../../Constants/URLConstants';
import DefaultPreference from 'react-native-default-preference';
import networkService from '../../../NetworkManager/NetworkManager';
import appConstant from '../../../Constants/AppConstants';

const windowWidth = Dimensions.get('window').width;

export default class CreateShop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: 0,
      photo: null,
      updateUI: false,
      categoryArray: [],
      showDropDown: false,
      categoryID: -1,
      categoryName: 'Select Category',
      bToken: '',
      selectedCatData: {},
    }
    this.renderSupplier = this.renderSupplier.bind(this);
    this.renderGovtRegView = this.renderGovtRegView.bind(this);

  }
  componentDidMount() {
    DefaultPreference.get('token').then(function (value) {
      this.setState({bToken: value })
      this.loadCategoryApi()
      this.loadShippingApi()
    }.bind(this))
  }
  loadCategoryApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(APPURL.URLPaths.category + 'accounts', 'get','',this.state.bToken)
    if (responseJson['status'] == true) {
      let cData = responseJson['data']['categories'];
      this.state.categoryArray = cData;
      console.log('cData == >',cData)
      this.setState({categoryArray: cData})
    }
  }
  loadShippingApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(APPURL.URLPaths.shippingMethod, 'get','',this.state.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
   
    }
  }
  /*  Buttons   */

  didSelectDropDown = (item, index) => {
    this.setState({ showDropDown: false, categoryID: index,categoryName:item})
  }
  categoryBtnAction() {
    this.props.navigation.navigate(NavigationRoots.Category, {
      categoryArray: this.state.categoryArray,
      getCatID: this.getSelectedCategoryID,
    });
  }
  getSelectedCategoryID = data => {
    this.setState({selectedCatData: data, categoryName: data['name']})
  }
  /*  UI   */
  imagePicker() {
    ImagePicker.openPicker({
      height: 200,
      width: 200,
      cropping: false,
    }).then(image => {
      this.state.photo = image.sourceURL;
      this.setState({ updateUI: !this.state.updateUI })
    });
  }
  viewSelectedImages = () => {
    var views = [];
    if (this.state.photo != null) {
      views.push(
        <View>
          <View style={styles.imagePickerPlaceholderStyle}>
            <TouchableOpacity onPress={() => this.imagePicker()}>
              <View>
                <Image source={{ uri: this.state.photo }}
                  style={styles.SelectedImageStyle}
                  resizeMode={'contain'}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>,
      );
    } else {
      views.push(
        <View>
          <View style={styles.imagePickerPlaceholderStyle}>
            <TouchableOpacity onPress={() => this.imagePicker()}>
              <View style={{ justifyContent: 'center' }}>
                <Image
                  source={cameraIcon}
                  style={{ width: 30, height: 30, alignSelf: 'center' }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>,
      );
    }
    return views;
  };
  renderDropDownCategory = props => {
    if (this.state.showDropDown == true) {
      return <View style={styles.dropDownViewStyle} >
        <FlatList
          data={categoryArray}
          horizontal={false}
          renderItem={this.renderDropDownItem}
          extraData={this.state}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          ItemSeparatorComponent={
            () => <View style={{ width: 0, height: 0, backgroundColor: colors.blackTransparent }} />
          }
        />
      </View>
    }
    return <View></View>
  }
  renderDropDownItem = ({ item, index }) => {
    return <TouchableOpacity onPress={() => this.didSelectDropDown(item, index)} style={{top: 1, height: 35, marginBottom: 5 }}>
      <View style={{ justifyContent: 'center', width: "100%", top: 10 }}>
        <Text style={{textAlign: 'left', fontSize: 16, color:colors.AppGray}}> {item} </Text>
      </View>
    </TouchableOpacity>
  }

  renderNGOView = () => {
    return <View>
      <View style={{ height: 20 }} />
      <Text style={commonStyles.textLabelStyle}>NGO Registration No</Text>
      <TextInput style={commonStyles.addTxtFieldStyle} placeholder={'Enter Registration No'} />
      <View style={{ height: 20 }} />
      <Text style={commonStyles.textLabelStyle}>Opreation Days</Text>
      <TextInput style={commonStyles.addTxtFieldStyle} placeholder={'Select Opreation Days'} />
      <View style={{ height: 20 }} />
      <Text style={commonStyles.textLabelStyle}>Agent No</Text>
      <TextInput style={commonStyles.addTxtFieldStyle} placeholder={'Select Agent'} />
      <View style={{ height: 20 }} />
      <Text style={commonStyles.textLabelStyle}>Business Registration</Text>
      <View style={styles.dottedViewStyle}>
        <Image source={upload} style={{ width: 20, height: 20, alignSelf: 'center' }} />
        <View style={{ height: 10 }} />
        <Text> Upload file document limit of 5 MB </Text>
      </View>
    </View>
  }
  renderGovtRegView = () => {
    return <View>
      <View style={{ height: 20 }} />
      <Text style={commonStyles.textLabelStyle}>Govt Registration No</Text>
      <TextInput style={commonStyles.addTxtFieldStyle} placeholder={'Enter Govt Registration No'} />
      <View style={{ height: 20 }} />
      <Text style={commonStyles.textLabelStyle}>Opreation Days</Text>
      <TextInput style={commonStyles.addTxtFieldStyle} placeholder={'Select Opreation Days'} />
      <View style={{ height: 20 }} />
      <Text style={commonStyles.textLabelStyle}>Speciality </Text>
      <TextInput style={commonStyles.addTxtFieldStyle} placeholder={'Select Speciality'} />
      <View style={{ height: 20 }} />
      <Text style={commonStyles.textLabelStyle}>Locality</Text>
      <TextInput style={commonStyles.addTxtFieldStyle} placeholder={'Select Locality'} />
      <View style={{ height: 20 }} />
      <Text style={commonStyles.textLabelStyle}>Address</Text>
      <TextInput style={commonStyles.addTxtFieldStyle} placeholder={'Select Address'} />
      <View style={{ height: 20 }} />
    </View>
  }
 
  renderHomeShop = () => {
    return <View>
    <View style={{ height: 20 }} />
    <Text style={commonStyles.textLabelStyle}>Whatsapp (Optional)</Text>
    <TextInput style={commonStyles.addTxtFieldStyle} placeholder={'Enter Whatsapp'} />
    <View style={{ height: 20 }} />
    <Text style={commonStyles.textLabelStyle}>Address</Text>
    <TextInput style={commonStyles.addTxtFieldStyle} placeholder={'Select Address'} />
    <View style={{ height: 20 }} />
  </View>
  }
  renderSuperRetailer = () => {
    return <View>
      <View style={{ height: 20 }} />
      <Text style={commonStyles.textLabelStyle}>GSTIN</Text>
      <TextInput style={commonStyles.addTxtFieldStyle} placeholder={'Enter GSTIN No'} />
      <View style={{ height: 20 }} />
      <Text style={commonStyles.textLabelStyle}>Purchase Preference</Text>
      <TextInput style={commonStyles.addTxtFieldStyle} placeholder={'Purchase Preference'} />
      <View style={{ height: 20 }} />
      <Text style={commonStyles.textLabelStyle}>Address</Text>
      <TextInput style={commonStyles.addTxtFieldStyle} placeholder={'Select Address'} />
      <View style={{ height: 20 }} />
    </View>
  }
  renderSupplier = () => {
    return <View>
      <View style={{ height: 20 }} />
      <Text style={commonStyles.textLabelStyle}>Address</Text>
      <TextInput style={commonStyles.addTxtFieldStyle} placeholder={'Select Address'} />
      <View style={{ height: 20 }} />
    </View>
  }
  renderFields = () => {
    if (this.state.categoryID == 0) {
      return <View>{this.renderGovtRegView()}</View>
    } else if (this.state.categoryID == 2) {
      return <View>{this.renderNGOView()}</View>
    } else if (this.state.categoryID == 1) {
      return <View>{this.renderHomeShop()}</View>
    } else if (this.state.categoryID == 3) {
      return <View>{this.renderSuperRetailer()}</View>
    } else if (this.state.categoryID == 4) {
      return <View>{this.renderSupplier()}</View>
    } else if (this.state.categoryID == 5) {
      return <View>{this.renderSupplier()}</View>
    } else {return <View />}
  }
  renderShipmentView = () => {
    let titleAry = ['Online Session', 'Pick Up', 'Delivery']
    var views = [];
    for (let a = 0; a < 3; a++) {
      views.push(<View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ height: 20, width: 20, borderWidth: 2, borderColor: colors.AppGreen, backgroundColor: colors.AppWhite }}></View>
        <Text style={{ color: colors.AppGray, marginLeft: 10 }}>{titleAry[a]}</Text>
      </View>)
    }
    return views;
  }


  renderTitleLbl = ({ title }) => {
    return (
      <View style={{margin: -5}}>
        <Text style={commonStyles.textLabelStyle}> {title == undefined ? 'Category' : title}
          <Text style={{color: colors.AppRed, paddingTop: 5}}> *</Text>
        </Text>
      </View>
    );
  }
  renderCategoryView = () => {
    return <View>
      {this.renderTitleLbl('category')}
      <View style={{ width: '100%', zIndex: 10 }}>
        <TouchableOpacity 
          style={{ flexDirection: 'row',width: '100%',justifyContent: 'space-between' }} 
          onPress={() => this.categoryBtnAction()}>
          <Text style={commonStyles.addTxtFieldStyle}>{this.state.categoryName}</Text>
          <Image style={commonStyles.nextIconStyle}
            resizeMode="contain"
            source={dropdownIcon}
          />
        </TouchableOpacity>
        {/* <this.renderDropDownCategory /> */}
      </View>
    </View>
  }

  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Create you store'} showBackBtn={false} />
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ margin: 10, width: windowWidth - 20, height: imagePickerHeight }}>
              <this.viewSelectedImages />
            </View>
            <View style={{ backgroundColor: colors.AppWhite, height: '80%', padding: 16 }}>
              <this.renderTitleLbl title={'Name'} />
              <TextInput style={commonStyles.addTxtFieldStyle} placeholder={'Enter Name'} />
              <View style={{ height: 20 }} />
              <this.renderTitleLbl title={'Description'} />
              <TextInput
                style={commonStyles.txtViewStyle}
                placeholder={'Enter Description'}
                multiline={true} />
              <View style={{ height: 20 }} />
              <this.renderCategoryView />
              <View style={{ zIndex: 1,}}>
                <this.renderSupplier />
                <View style={{ height: 20 }} />
                <Text style={commonStyles.textLabelStyle}>Preferred Shipment*</Text>
                <View>
                  <this.renderShipmentView />
                </View>
                <View style={{ height: 60 }} />
                <TouchableOpacity style={commonStyles.themeBtnStyle} onPress={() => this.setState({ showModal: true })}>
                  <Text style={commonStyles.themeTitleStyle}>Create</Text>
                </TouchableOpacity>
                <View style={{ height: 60 }} />
              </View>
            </View>
          </ScrollView >
        </View>
      </SafeAreaView>
    );
  }
}
const imagePickerHeight = 200;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.AppTheme
  },
  imageSelectedStyle: {
    height: imagePickerHeight,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerPlaceholderStyle: {
    height: imagePickerHeight,
    width: '100%',
    margin: 0,
    justifyContent: 'center',
    borderColor: colors.AppTheme,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 10,
  },
  SelectedImageStyle: {
    height: imagePickerHeight,
    width: windowWidth - 20,
    borderRadius: 10,
    borderColor: colors.BorderColor,
    borderWidth: 2,
  },
  groupViewContainerStyle: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'flex-start',
  },
  groupViewStyle: {
    borderRadius: 10,
    borderColor: colors.BorderColor,
    borderWidth: 2,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedGroupViewStyle: {
    borderRadius: 10,
    borderColor: colors.AppTheme,
    borderWidth: 2,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageThumbnail: {
    width: 35,
    height: 35,
  },
  dottedViewStyle: {
    marginTop: 10,
    borderRadius: 10,
    height: 80,
    borderColor: colors.AppTheme,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  dropDownViewStyle: {
    width: "100%",
    backgroundColor: 'white',
    marginTop: 70,
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 5,
    borderColor: colors.BorderColor,
    marginTop: 35,
    zIndex: 90,
    borderBottomWidth: 1,
  },
  nextIconStyle: {
    width: 15,
    height: 15,
    alignSelf: 'center',
    transform: [{rotate: '270deg'}],
    marginRight: 10,
    marginTop: 2,
  },
});

const categoryArray = ['Govt.Registered Shop', 'Home Shop', 'NGO', 'Super Retailer', 'Supplier', 'Parents'];
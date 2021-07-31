import React, { Component } from 'react';
import {
  TextInput,
  Text,
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { TabActions } from '@react-navigation/native';
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
import forwardIcon from '../../../assets/forward.png';
import Tags from "react-native-tags";
import uncheck from '../../../assets/uncheck.png';
import check from '../../../assets/check.png';
import eventStyles from '../../../StyleSheet/EventStyleSheet';
import FastImage from 'react-native-fast-image'

const windowWidth = Dimensions.get('window').width;

export default class CreateShop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: 0,
      photo: null,
      updateUI: false,
      categoryArray: [],
      attributeArray: [],
      shippingArray: [],
      showDropDown: false,
      categoryID: -1,
      categoryName: 'Select Category',
      bToken: '',
      selectedCatData: {},
      shippingID: 0,
      singleSelectedArray: [],
      multipleSelectedsArray: [],
      singleValue: '',
      tagsArray: [],
      selectAddress: {},
      name: '',
      description: '',
      documentFile: null,
      isVisible: false,
      photoURLPath: '',
      documentURLPath: '',
      storeDetail: {},
      isEditing: false,
      accountId: '',
    }
    this.renderAddressView = this.renderAddressView.bind(this);
  }
  componentDidMount() {
    DefaultPreference.get('token').then(function (value) {
      this.setState({ bToken: value })
      this.loadCategoryApi()
      this.loadShippingApi()
    }.bind(this))

    if(this.props.route.params) {
      let {storeDetail} = this.props.route.params;
      console.log('storeDetail == >', storeDetail)
      this.state.photo = storeDetail['images'].length != 0 ? storeDetail['images'][0] : null ;
      this.state.photoURLPath = storeDetail['images'].length != 0 ? storeDetail['images'][0] : '' ;
      this.state.storeDetail = storeDetail;
      this.state.selectAddress = storeDetail['location'];
      this.state.description = storeDetail['description'];
      this.state.name = storeDetail['name'];
      this.state.categoryName = storeDetail['categories'][0]['name'];
      this.state.selectedCatData = storeDetail['categories'][0];
      this.state.attributeArray = storeDetail['attributes'];
      this.state.isEditing = true;
      this.state.accountId = storeDetail['id']
      // this.loadAttributeApi(this.state.selectedCatData['id'])
      for (let item of this.state.attributeArray) {
        let fieldType = item['field_type'];
        if (fieldType == 1) {
          if (item['values'].length != 0) {
            this.state.singleSelectedArray = item['values'];
          }
        }
        if (fieldType == 2) {
          if (item['values'].length != 0) {
            this.state.multipleSelectedsArray = item['values'];
          }
        }
        if (fieldType == 3) {
          if (item['values']) {
            if (item['values'].length != 0) {
              this.state.singleValue = item['values'][0];
            }
          }
        }
        if (fieldType == 4) {
          if (item['values']) {
            if (item['values'].length != 0) {
              this.state.tagsArray = item['values'];
            }
          }
        }
        if (fieldType == 5) {
          if (item['values']) {
            if (item['values'].length != 0) {
              this.state.documentFile = item['values'][0];
              this.state.documentURLPath = item['values'][0];
            }
          }
        }
      }
      this.setState({ updateUI: !this.state.updateUI})
    }
  }
  loadCategoryApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(APPURL.URLPaths.category + 'accounts', 'get','',this.state.bToken)
    if (responseJson['status'] == true) {
      let cData = responseJson['data']['categories'];
      this.state.categoryArray = cData;
      // console.log('cData == >',cData)
      this.setState({categoryArray: cData})
    }else {
      this.setState({ isVisible: false })
    }
  }
  loadShippingApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(APPURL.URLPaths.shippingMethod, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let shipData = responseJson['data']['shipping_methods'];
      this.state.shippingArray = shipData
      this.setState({ updateUI: !this.state.updateUI,isVisible: false })
    }else {
      this.setState({ isVisible: false })
    }
  }
  loadAttributeApi = async (cid) => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.attribute + cid}&type=accounts`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let cData = responseJson['data']['attributes'];
      this.state.attributeArray = cData
      this.setState({ updateUI: !this.state.updateUI,isVisible: false  })
    } else {
      this.setState({ isVisible: false })
    }
  }
  uploadFilesAPI = async () => {
    this.setState({ isVisible: true })
    var imgParm = [];
    var uploadBase64 = [];
    if (this.state.photo != null) {
      console.log('calling.......here');
      let fileName = this.state.photo.data;
      if (fileName != null) {
        var splashDict = {
          name: this.state.photo['filename'],
          type: this.state.photo['mime'],
        };
        uploadBase64.push({
          file: 'data:image/png;base64,' + this.state.photo.data,
        });
        imgParm.push(splashDict);
      }
    }
    if (this.state.documentFile != null) {
      let fileName = this.state.documentFile.data;
      if (fileName != null) {
        var androidIconDict = {
          name: this.state.documentFile['filename'],
          type: this.state.documentFile['mime'],
        };
        uploadBase64.push({
          file: 'data:image/png;base64,' + this.state.documentFile.data,
        });
        imgParm.push(androidIconDict);
      }
    }
    console.log('imgParm',imgParm)
    if (imgParm != 0) {
      const responseJson = await networkService.networkCall(
        APPURL.URLPaths.S3signedUploadURL, 'POST',  JSON.stringify({files: imgParm}),appConstant.bToken,appConstant.authKey );
      if (responseJson['status'] == true) {
        var result = responseJson['data']['result'];
        console.log('result', result);
        var uploadIncrement = 0;
        for (let i = 0; i < imgParm.length; i++) {
          fetch(uploadBase64[i]['file']).then(async res => {
            const file_upload_res = await networkService.uploadFileWithSignedURL(
              result[i]['signedUrl'],
              imgParm[i]['type'],
              await res.blob(),
            );
            uploadIncrement++;
            if (this.state.photo != null) {
              if (this.state.photoURLPath.length == 0) {
                this.state.photoURLPath = result[i]['fileUri'];
              } else {
                this.state.documentURLPath = result[i]['fileUri'];
              }
            } else {
              this.state.documentURLPath = result[i]['fileUri'];
            }
            if (uploadIncrement === uploadBase64.length) {
              this.createAccountApi()
            }
          });
        }
      } else {
        this.setState({ isVisible: false })
         Alert.alert(responseJson);
      }
    } else {
      this.createAccountApi()
    }
  };

  createAccountApi = async () => {
    var dict = {
      'category_id':[this.state.selectedCatData['id']],
      'name': this.state.name,
      'type': 'accounts',
    }
    if (this.state.photo != null) {
      dict['images'] = [this.state.photoURLPath];
    }
    if (this.state.description.length != 0) {
      dict['description'] = this.state.description;
    }
    if (this.state.selectAddress['formatted_address'] !== undefined) {
      latitude = this.state.selectAddress['latitude'];
      longitude = this.state.selectAddress['longitude'];
      dict['coordinates'] = {'latitude': latitude,'longitude': longitude};
    }
    if (this.state.shippingID != 0) {
      dict['shipping_methods'] = [this.state.shippingID]
    }
    var attributeAry = [];
    for (let objc of this.state.attributeArray) {
      let fieldType = objc['field_type'];
      console.log('fieldType',fieldType);
      if (fieldType == 1) {
        if (this.state.singleSelectedArray.length != 0) {
          let atrDic = {
            values:[this.state.singleSelectedArray[0]['id']],
            id: objc['id'],
          }
          attributeAry.push(atrDic)
        }
      }
      if (fieldType == 2) {
        if (this.state.multipleSelectedsArray.length != 0) {
          var idAry = [];
          for (let obj of this.state.multipleSelectedsArray) {
            idAry.push(obj['id'])
          }
          let atrDic = {
            values:idAry,
            id: objc['id'],
          }
          attributeAry.push(atrDic)
        }
      }
      if (fieldType == 3) {
        if (this.state.singleValue.length != 0) {
          let atrDic = {
            values:[this.state.singleValue],
            id: objc['id'],
          }
          attributeAry.push(atrDic)
        }
      }
      if (fieldType == 4) {
        if (this.state.tagsArray.length != 0) {
          let atrDic = {
            values:this.state.tagsArray,
            id: objc['id'],
          }
          attributeAry.push(atrDic)
        }
      }
      if (fieldType == 5) {
        if (this.state.documentURLPath.length != 0) {
          let atrDic = {
            values:[this.state.documentURLPath],
            id: objc['id'],
          }
          attributeAry.push(atrDic)
        }
      }
    }
    if (attributeAry != 0) {
      dict['attributes'] = attributeAry
    }
    let path = this.state.isEditing ? `/${this.state.accountId}` : ''
    const responseJson = await networkService.networkCall(APPURL.URLPaths.accounts + path,
       this.state.isEditing ? 'put' : 'post', JSON.stringify({ account: dict }),appConstant.bToken,appConstant.authKey);

    console.log(" responseJson =  ", responseJson) 
    if (responseJson) {
      this.setState({ isVisible: false })
      if (responseJson['status'] == true) {
        this.setState({ isVisible: false })
        Alert.alert('SuccessFully')
      } else {
        this.setState({ isVisible: false })
        Alert.alert(responseJson)
      }
    }
  }

  /*  Buttons   */
  createBtnAction() {
    this.uploadFilesAPI()
  }
  categoryBtnAction() {
    this.props.navigation.navigate(NavigationRoots.Category, {
      categoryArray: this.state.categoryArray,
      getCatID: this.getSelectedCategoryID,
    });
  }
  valueBtnAction(id) {
    let item = this.state.attributeArray[id];
    let singleSelect = item['field_type'] == 1 ? true : false
    this.props.navigation.navigate(NavigationRoots.AttributeList, {
      attributeArray: item['values'],
      getAtriValue: this.getAttributeSelectedValues,
      singleSelect: singleSelect,
    });
  }
 
  cancelBtnAction() {

    // if (this.props.route.params) {
    //   const jumpToAction = TabActions.jumpTo("Home");
    //   this.props.navigation.dispatch(jumpToAction);
    // } else {
      this.props.navigation.goBack();
    // }
  }
  addressBtnAction() {
    this.props.navigation.navigate(NavigationRoots.AddressList, {
      getAddress: this.getAddress,
    });
  }
  /*  Delegates   */
  onTagChanges(data) {
    this.state.tagsArray = data
    this.setState({ updateUI: !this.state.updateUI })
  }
  getSelectedCategoryID = data => {
    this.setState({selectedCatData: data, categoryName: data['name']})
    this.loadAttributeApi(data['id'])
  }
  getAttributeSelectedValues = (data, singleSelect) => {
    if (singleSelect) {
      this.state.singleSelectedArray = data
    } else {
      this.state.multipleSelectedsArray = data
    }
    this.setState({ updateUI: !this.state.updateUI })
  }
  getAddress = data => {
    this.setState({selectAddress: data});
  }
  /*  UI   */
  imagePicker(id) {
    ImagePicker.openPicker({
      height: 200,
      width: 200,
      cropping: false,
      includeBase64: true,
    }).then(image => {
      // console.log('image', image);
      if (id == 2) {
        this.state.documentFile = image;
      }else {
        this.state.photo = image;
      }
      this.setState({ updateUI: !this.state.updateUI })
    });
  }
  viewSelectedImages = () => {
    var views = [];
    if (this.state.photo != null) {
      var photoPath = ''
      if (this.state.photo['sourceURL']) {
        photoPath = this.state.photo.sourceURL;
      }else {
        photoPath = this.state.photo; 
      }
      views.push(
        <View>
          <View style={styles.imagePickerPlaceholderStyle}>
            <TouchableOpacity onPress={() => this.imagePicker()}>
                <FastImage source={{uri: photoPath}}
                  style={styles.SelectedImageStyle}
                  resizeMode={'cover'}
                />
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
        <TouchableOpacity style={eventStyles.clickAbleFieldStyle} 
          onPress={() => this.categoryBtnAction()}>
          <Text style={commonStyles.txtFieldWithImageStyle}>{this.state.categoryName}</Text>
          <Image style={commonStyles.nextIconStyle}
            resizeMode="contain"
            source={forwardIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  }
  renderAttributeFields = () => {
    var views = [];
    if (this.state.attributeArray.length != 0) {
      for (let a = 0; a < this.state.attributeArray.length; a++) {
        let item = this.state.attributeArray[a];
        let fieldType = item['field_type'];
        if (fieldType == 1 || fieldType == 2) {
          var value = fieldType == 1 ? 'Select Single Value' : 'Select Multi Value'
          if (fieldType == 1) {
            if (this.state.singleSelectedArray.length !== 0) {
              value = this.state.singleSelectedArray[0]['name']
            }
          } else {
            if (this.state.multipleSelectedsArray.length != 0) {
              var nameAry = [];
              for (let obj of this.state.multipleSelectedsArray) {
                nameAry.push(obj['name'])
              }
              value = nameAry.join()
            }
          }
          views.push(<View>
            <View style={{ height: 20 }} />
            <Text style={commonStyles.textLabelStyle}>{item['name']}</Text>
            <View style={{ width: '100%', zIndex: 10 }}>
              <TouchableOpacity style={eventStyles.clickAbleFieldStyle}  onPress={() => this.valueBtnAction(a)}>
                <Text style={commonStyles.txtFieldWithImageStyle} numberOfLines={1}>{value}</Text>
                <Image style={commonStyles.nextIconStyle} resizeMode="contain" source={forwardIcon}/>
              </TouchableOpacity>
            </View>
          </View>)
        } else if (fieldType == 3) {
          views.push(<View>
            <View style={{ height: 20 }} />
            <Text style={commonStyles.textLabelStyle}>{item['name']}</Text>
            <TextInput
              style={commonStyles.addTxtFieldStyle}
              placeholder={'Enter Value'}
              value={this.state.singleValue}
              onChangeText={value => this.setState({singleValue: value})}
              />
          </View>)
        } else if (fieldType == 4) {
          views.push(<View>
            <View style={{ height: 20 }} />
            <Text style={commonStyles.textLabelStyle}>{item['name']}</Text>
            <Tags
              tagContainerStyle={{backgroundColor: colors.LightGreenColor}}
              inputContainerStyle={{backgroundColor: '#f5f5f5'}}
              initialTags={this.state.tagsArray}
              onChangeTags={tags => this.onTagChanges(tags)}
            /> 
          </View>)
        } else if (fieldType == 5) {
          var value = 'Upload file document limit of 5 MB';
          if (this.state.documentFile['sourceURL']) {
            value = this.state.documentFile['filename'];
          } else {
            value = this.state.documentURLPath.substring(this.state.documentURLPath.lastIndexOf('/')+1);
          }
          views.push(<View>
            <View style={{ height: 20 }} />
            <Text style={commonStyles.textLabelStyle}>{item['name']}</Text>
            <View style={{ height: 10 }} />
            <TouchableOpacity style={eventStyles.dottedViewStyle} onPress={() => this.imagePicker(2)}>
              <Image source={upload} style={{ width: 20, height: 20, alignSelf: 'center' }} />
              <View style={{ height: 10 }} />
              <Text>{value}</Text>
            </TouchableOpacity>
          </View>)
        }
      }
    }else {
      views.push(<View />)
    }
    return views;
  }
  renderShipmentView = () => {
    var views = [];
    for (let a = 0; a < this.state.shippingArray.length; a++) {
      let item = this.state.shippingArray[a];
      views.push(<TouchableOpacity style={styles.shippingViewStyle} onPress={() => this.setState({shippingID: item['id']})}>
        <View style={styles.squareViewStyle}>
          <Image style={styles.tickImageStyle} source={this.state.shippingID != item['id'] ? uncheck : check} />
        </View>
        <Text style={{color: colors.AppGray, marginLeft: 10}}>{item['name']}</Text>
      </TouchableOpacity>)
    }
    return views;
  }

  renderAddressView = () => {
    var value = 'Select Address'
    if (this.state.selectAddress['formatted_address'] !== undefined) {
      value = this.state.selectAddress['formatted_address'];
    }
    return <View>
      <View style={{ height: 20 }} />
      <Text style={commonStyles.textLabelStyle}>Address</Text>
      <View style={{ width: '100%', zIndex: 10 }}>
        <TouchableOpacity style={eventStyles.clickAbleFieldStyle} onPress={() => this.addressBtnAction()}>
          <Text style={commonStyles.txtFieldWithImageStyle}>{value}</Text>
          <Image style={commonStyles.nextIconStyle}
            resizeMode="contain"
            source={forwardIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Create you store'}
          showBackBtn={false} showDoneBtn={true}
          doneBtnTitle={'Cancel'} doneBtnAction={() => this.cancelBtnAction()}/>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ margin: 10, width: windowWidth - 20, height: imagePickerHeight }}>
              <this.viewSelectedImages />
            </View>
            <View style={{ backgroundColor: colors.AppWhite, height: '80%', padding: 16 }}>
              <this.renderTitleLbl title={'Name'} />
              <TextInput 
                style={commonStyles.addTxtFieldStyle}
                placeholder={'Enter Name'}
                value={this.state.name}
                onChangeText={value => this.setState({name: value})}
                />
              <View style={{ height: 20 }} />
              <Text style={commonStyles.textLabelStyle}>Description</Text>
              <TextInput
                style={commonStyles.txtViewStyle}
                placeholder={'Enter Description'}
                value={this.state.description}
                onChangeText={value => this.setState({description: value})}
                multiline={true} />
              <View style={{ height: 20 }} />
              <this.renderCategoryView />
              <this.renderAttributeFields />
              <View style={{ zIndex: 1,}}>
                <this.renderAddressView />
                <View style={{ height: 20 }} />
                <this.renderTitleLbl title={'Preferred Shipment'} />
                <View>
                  <this.renderShipmentView />
                </View>
                <View style={{ height: 60 }} />
                <TouchableOpacity style={commonStyles.themeBtnStyle} onPress={() => this.createBtnAction()}>
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
  shippingViewStyle: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  squareViewStyle: {
    height: 30,
    width: 30,
    justifyContent: 'center',
  },
  tickImageStyle: {
    height: 24,
    width: 24,
  },
});

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
  Platform,
} from 'react-native';
import { TabActions } from '@react-navigation/native';
import NavigationRoots from '../../../Constants/NavigationRoots';
import HeaderView from '../../../Component/Header'
import colors from '../../../CommonClasses/AppColor';
import cameraIcon from '../../../assets/camera.png';
import upload from '../../../assets/upload.png';
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
import SuccessView from '../../../Component/SuccessView';
import cancelIcon from '../../../assets/cancel.png';
import { photosPermissionAlert } from '../../../HelperClasses/SingleTon';
import LangifyKeys from '../../../Constants/LangifyKeys';
import {AppAlert } from '../../../HelperClasses/SingleTon';
import AppConstants from '../../../Constants/AppConstants';
import tradlyDb from '../../../TradlyDB/TradlyDB';
import ActionSheet from 'react-native-actionsheet'


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
      singleValueArray: [],
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
      showCAlert: false,
      coordinates:{},
      translationDic:{},
      attributeFilePath:'',
    }
    this.renderAddressView = this.renderAddressView.bind(this);
  }
  componentDidMount() {

    this.langifyAPI(LangifyKeys.addstore);
    this.langifyAPI(LangifyKeys.chatdetail);
    DefaultPreference.get('token').then(function (value) {
      this.setState({ bToken: value })
      this.loadCategoryApi()
      this.loadShippingApi()
    }.bind(this))

    if(this.props.route.params) {
      let {storeDetail} = this.props.route.params;
      this.state.photo = storeDetail['images'].length != 0 ? storeDetail['images'][0] : null ;
      this.state.photoURLPath = storeDetail['images'].length != 0 ? storeDetail['images'][0] : '' ;
      this.state.storeDetail = storeDetail;
      this.state.selectAddress = storeDetail['location'];
      this.state.coordinates = storeDetail['coordinates'];;
      this.state.description = storeDetail['description'];
      this.state.name = storeDetail['name'];
      if (storeDetail['categories'][0]){
        this.state.categoryName = storeDetail['categories'][0]['name'];
        this.loadAttributeApi(storeDetail['categories'][0]['id'])

      }
      this.state.selectedCatData = storeDetail['categories'][0];
      let attributeArray = storeDetail['attributes'];

      this.state.isEditing = true;
      this.state.accountId = storeDetail['id']
      for (let item of attributeArray) {
        let fieldType = item['field_type'];
        if (fieldType == 1) {
          if (item['values'].length != 0) {
            var valueDic = {};
            valueDic['valueId'] = item['id'];
            valueDic['data'] = item['values'];
            this.state.singleSelectedArray.push(valueDic);
          }
        }
        if (fieldType == 2) {
          if (item['values'].length != 0) {
            var valueDic = {};
            valueDic['valueId'] = item['id'];
            valueDic['data'] = item['values'];
            this.state.multipleSelectedsArray.push(valueDic);
          }
        }
        if (fieldType == 3) {
          if (item['values']) {
            if (item['values'].length != 0) {
              var valueDic = {};
              valueDic['valueId'] = item['id'];
              valueDic['text'] = item['values'][0];
              this.state.singleValueArray.push(valueDic);
            }
          }
        }
        if (fieldType == 4) {
          if (item['values']) {
            if (item['values'].length != 0) {
              var valueDic = {};
              valueDic['valueId'] = item['id'];
              valueDic['data'] = item['values'];
              this.state.tagsArray.push(valueDic);
            }
          }
        }
        if (fieldType == 5) {
          if (item['values']) {
            if (item['values'].length != 0) {
              this.state.documentFile = item['values'][0];
              this.state.attributeFilePath = item['values'][0];
            }
          }
        }
      }
      this.setState({ updateUI: !this.state.updateUI})
    }
  }
  langifyAPI = async (keyGroup) => {
    let addStoreD = await tradlyDb.getDataFromDB(keyGroup);
    if (addStoreD != undefined) {
      if (LangifyKeys.addstore == keyGroup){
        this.addStoreTranslationData(addStoreD);
      }else {
        this.cameraTranslationData(addStoreD)
      }
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${keyGroup}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${appConstant.appLanguage}${group}`, 'get', '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      if (LangifyKeys.addstore == keyGroup){
        tradlyDb.saveDataInDB(keyGroup, objc)
        this.addStoreTranslationData(objc);
      } else {
        tradlyDb.saveDataInDB(keyGroup, objc)
        this.cameraTranslationData(objc)
      }
     
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  cameraTranslationData(object) {
    for (let obj of object) {
      if ('chatdetail.camera' == obj['key']) {
        this.state.translationDic['camera'] = obj['value'];
      }
      if ('chatdetail.gallery' == obj['key']) {
        this.state.translationDic['gallery'] = obj['value'];
      }
    }
  }
  addStoreTranslationData(object) {
    for (let obj of object) {
      if ('addstore.add_store' == obj['key']) {
        this.state.translationDic['title'] = obj['value'];
      }
      if ('addstore.update_store_title' == obj['key']) {
        this.state.translationDic['updateTitle'] = obj['value'];
      }
      if ('addstore.store_name' == obj['key']) {
        this.state.translationDic['name'] = obj['value'];
      }
      if ('addstore.description' == obj['key']) {
        this.state.translationDic['description'] =  obj['value'];
      }
      if ('addstore.category' == obj['key']) {
        this.state.translationDic['category'] = obj['value'];
      }
      if ('addstore.alert_message_choose_category' == obj['key']) {
        this.state.translationDic['chooseCategory'] =  obj['value'];
        if (this.state.categoryName  == 'Select Category'){
          this.state.categoryName = obj['value'];
        }
      }
      if ('addstore.address' == obj['key']) {
        this.state.translationDic ['address'] =  obj['value'];
      }
      if ('addstore.alert_please_select_address' == obj['key']) {
        this.state.translationDic['selectAddress'] = obj['value'];
      }
      if ('addstore.create' == obj['key']) {
        this.state.translationDic['createBtn'] =  obj['value'];
      }
      if ('addstore.alert_ok' == obj['key']) {
        this.state.translationDic['alertOk'] =  obj['value'];
      }
      if ('addstore.add_your_store_photo' == obj['key']) {
        this.state.translationDic['image'] =  obj['value'];
      }
      if ('addstore.added_success_message' == obj['key']) {
        this.state.translationDic['success'] =  obj['value'];
      }
      if ('addstore.update_success' == obj['key']) {
        this.state.translationDic['update_success'] =  obj['value'];
      }
      if ('addstore.select_single_value' == obj['key']) {
        this.state.translationDic['select_single_value'] =  obj['value'];
      }
      if ('addstore.select_multi_value' == obj['key']) {
        this.state.translationDic['select_multi_value'] =  obj['value'];
      }     
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
      let fileName = this.state.photo.data;
      if (fileName != null) {
        this.state.photoURLPath = '';
        let fname = this.state.photo['path'];
        let fValue = fname.substring(fname.lastIndexOf('/')+1);
        var splashDict = {
          name: fValue,
          type: this.state.photo['mime'],
        };
        uploadBase64.push({
          file:this.state.photo['path'],
        });
        imgParm.push(splashDict);
      }
    }
    if (this.state.documentFile != null) {
      let fileName = this.state.documentFile.data;
      if (fileName != null) {
        let fname = this.state.documentFile['path'];
        let fValue = fname.substring(fname.lastIndexOf('/')+1);
        var androidIconDict = {
          name: fValue,
          type: this.state.documentFile['mime'],
        };
        uploadBase64.push({
          file:this.state.documentFile['path'],
        });
        imgParm.push(androidIconDict);
      }
    }
    if (imgParm != 0) {
      const responseJson = await networkService.networkCall(
        APPURL.URLPaths.S3signedUploadURL, 'POST',  JSON.stringify({files: imgParm}),appConstant.bToken,appConstant.authKey );
      if (responseJson['status'] == true) {
        var result = responseJson['data']['result'];
        // console.log('result', result);
        var uploadIncrement = 0;
        for (let i = 0; i < imgParm.length; i++) {
          let fileURL = uploadBase64[i]['file'];
          await networkService.signedURLUpload(result[i]['signedUrl'], imgParm[i]['type'], fileURL).then(res => {
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
          })
          // fetch(uploadBase64[i]['file']).then(async res => {
          //   const file_upload_res = await networkService.uploadFileWithSignedURL(
          //     result[i]['signedUrl'],
          //     imgParm[i]['type'],
          //     await res.blob(),
          //   );
          //   uploadIncrement++;
          //   if (this.state.photo != null) {
          //     if (this.state.photoURLPath.length == 0) {
          //       this.state.photoURLPath = result[i]['fileUri'];
          //     } else {
          //       this.state.documentURLPath = result[i]['fileUri'];
          //     }
          //   } else {
          //     this.state.documentURLPath = result[i]['fileUri'];
          //   }
          //   if (uploadIncrement === uploadBase64.length) {
          //     this.createAccountApi()
          //   }
          // });
        }
      } else {
        this.setState({ isVisible: false })
         AppAlert(responseJson,appConstant.okTitle);
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
      dict['coordinates'] = this.state.coordinates;
    }
    if (this.state.shippingID != 0) {
      dict['shipping_methods'] = [this.state.shippingID]
    }
    var attributeAry = [];
    for (let objc of this.state.attributeArray) {
      let fieldType = objc['field_type'];
      if (fieldType == 1) {
        var localAry = []
        if (this.state.singleSelectedArray.length != 0) {
          let obj = this.state.singleSelectedArray.findIndex(x => x.valueId === objc['id'])
          if (obj != -1) {
            let data = this.state.singleSelectedArray[obj]['data']
            let atrDic = {
              values:[data[0]['id']],
              id: this.state.singleSelectedArray[obj]['valueId'],
            }
            localAry.push(atrDic)
          }
        }

        console.log('local type 1', localAry);
        if (objc['optional'] == false) {
          if (localAry.length == 0) {
            AppAlert(`Please select ${objc['name']}`,appConstant.okTitle);
          }else {
            for (let a = 0; a < localAry.length; a++) {
              attributeAry.push(localAry[a])
            }
          }
        }else {
          if (localAry.length != 0) {
            for (let a = 0; a < localAry.length; a++) {
              attributeAry.push(localAry[a])
            }
          }
        }
      }
      if (fieldType == 2) {
        var localAry = []
        if (this.state.multipleSelectedsArray.length != 0) {
          let obj = this.state.multipleSelectedsArray.findIndex(x => x.valueId === objc['id'])
          if (obj != -1) {
            let data = this.state.multipleSelectedsArray[obj]['data']
            var idAry = [];
            for (let ob of data) {
              idAry.push(ob['id'])
            }
            let atrDic = {
              values:idAry,
              id: objc['id'],
            }
            localAry.push(atrDic)
          }
        }
        if (objc['optional'] == false) {
          if (localAry.length == 0) {
            AppAlert(`Please select ${objc['name']}`,appConstant.okTitle);
          }else {
            for (let a = 0; a < localAry.length; a++) {
              attributeAry.push(localAry[a])
            }
          }
        }else {
          if (localAry.length != 0) {
            for (let a = 0; a < localAry.length; a++) {
              attributeAry.push(localAry[a])
            }
          }
        }
      }
      if (fieldType == 3) {
        var localAry = [];
        if (this.state.singleValueArray.length != 0) {
          let obj = this.state.singleValueArray.findIndex(x => x.valueId === objc['id'])
          if (obj != -1) {
            let data = this.state.singleValueArray[obj]['text']
            let atrDic = {
              values: [data],
              id: objc['id'],
            }
            localAry.push(atrDic)
          }
        }
        if (objc['optional'] == false) {
          if (localAry.length == 0) {
            AppAlert(`Please select ${objc['name']}`,appConstant.okTitle);
          }else {
            for (let a = 0; a < localAry.length; a++) {
              attributeAry.push(localAry[a])
            }
          }
        }else {
          if (localAry.length != 0) {
            for (let a = 0; a < localAry.length; a++) {
              attributeAry.push(localAry[a])
            }
          }
        }
      }
      if (fieldType == 4) {
        var localAry = [];
        if (this.state.tagsArray.length != 0) {
          let obj = this.state.tagsArray.findIndex(x => x.valueId === objc['id'])
          if (obj != -1) {
            let data = this.state.tagsArray[obj]['data']
            let atrDic = {
              values:data,
              id: data[0]['id'],
            }
            localAry.push(atrDic)
          }
        }
        if (objc['optional'] == false) {
          if (localAry.length == 0) {
            AppAlert(`Please select ${objc['name']}`,appConstant.okTitle);
          }else {
            for (let a = 0; a < localAry.length; a++) {
              attributeAry.push(localAry[a])
            }
          }
        }else {
          if (localAry.length != 0) {
            for (let a = 0; a < localAry.length; a++) {
              attributeAry.push(localAry[a])
            }
          }
        }
      }
      if (fieldType == 5) {
        if (this.state.attributeFilePath.length != 0) {
          let atrDic = {
            values: [this.state.attributeFilePath],
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

    if (responseJson) {
      this.setState({ isVisible: false })
      if (responseJson['status'] == true) {
        this.setState({ isVisible: false })
        var result = responseJson['data']['account'];
        appConstant.accountID = result['id'];
        this.setState({ showCAlert: true })
      } else {
        this.setState({ isVisible: false })
        AppAlert(responseJson,appConstant.okTitle)
      }
    }
  }
  successAlert() {
    this.setState({ showCAlert: false,isVisible: false })
    // this.props.navigation.navigate(NavigationRoots.MyStore,{
    //   createProfile:true,
    //   accId: appConstant.accountID,
    // });
    setTimeout(() => {
      this.props.navigation.navigate(NavigationRoots.MyStore,{
        createProfile:this.state.isEditing  ? false : true,
        accId: appConstant.accountID,
      });
    }, 1000);
  }

  /*  Buttons   */
  createBtnAction() {
    if (this.state.photo == null) {    
      AppAlert(this.state.translationDic['image'],appConstant.okTitle)
    } else if (this.state.name.length == 0) {
      AppAlert(this.state.translationDic['name'],appConstant.okTitle)
    } else if (Object.keys(this.state.selectedCatData).length == 0) {
      AppAlert(this.state.translationDic['chooseCategory'],appConstant.okTitle)
    } else {
      this.uploadFilesAPI()
    }
  }
  categoryBtnAction() {
    this.state.singleSelectedArray = [];
    this.state.multipleSelectedsArray = [];
    this.state.singleValueArray = [];
    this.state.tagsArray = [];
    this.state.documentFile = null;

    this.props.navigation.navigate(NavigationRoots.CategoryList, {
      categoryArray: this.state.categoryArray,
      getCatID: this.getSelectedCategoryID,
    });
  }
  valueBtnAction(id) {
    let item = this.state.attributeArray[id];
    let singleSelect = item['field_type'] == 1 ? true : false
    this.props.navigation.navigate(NavigationRoots.AttributeList, {
      attributeArray: item['values'],
      valueId: item['id'],
      getAtriValue: this.getAttributeSelectedValues,
      singleSelect: singleSelect,
    });
  }
 
  cancelBtnAction() {
      this.props.navigation.goBack();
  }
  addressBtnAction() {
    this.props.navigation.navigate(NavigationRoots.AddressList, {
      getAddress: this.getAddress,
    });
  }
  /*  Delegates   */
  onTagChanges(data, id) {
    let index = this.state.tagsArray.findIndex(x => x.valueId === id) 
    var valueDic = {};
    valueDic['valueId'] = id;
    valueDic['data'] = data;
    if (index != -1) {
      this.state.tagsArray[index] = valueDic;
    } else {
      this.state.tagsArray.push(valueDic);
    }
    // this.state.tagsArray = data
    this.setState({ updateUI: !this.state.updateUI })
  }
  getSelectedCategoryID = data => {
    this.setState({selectedCatData: data, categoryName: data['name']})
    this.loadAttributeApi(data['id'])
  }
  getAttributeSelectedValues = (data, singleSelect) => {
    if (singleSelect) {
      let obj = this.state.singleSelectedArray.findIndex(x => x.valueId === data[0]['valueId']) 
      if (obj != -1) {
        this.state.singleSelectedArray[obj] = data[0];
      }else {
        this.state.singleSelectedArray.push(data[0]);
      }
    } else {
      let obj = this.state.multipleSelectedsArray.findIndex(x => x.valueId === data[0]['valueId']) 
      if (obj != -1) {
        this.state.multipleSelectedsArray[obj] = data[0];
      }else {
        this.state.multipleSelectedsArray.push(data[0]);
      }
      // this.state.multipleSelectedsArray = data
    }
    // console.log('singleSelectedArray ==> ',JSON.stringify(this.state.singleSelectedArray));

    this.setState({ updateUI: !this.state.updateUI })
  }
  getAddress = data => {
    this.state.coordinates = {
      'latitude':data['latitude'],
      'longitude':data['longitude'],
    }
    this.setState({selectAddress: data});
  }
  onChangeTextValue(text, id){
    let index = this.state.tagsArray.findIndex(x => x.valueId === id) 
    var valueDic = {};
    valueDic['valueId'] = id;
    valueDic['text'] = text;
    if (index != -1) {
      this.state.singleValueArray[index] = valueDic;
    } else {
      this.state.singleValueArray.push(valueDic);
    }
    // this.state.tagsArray = data
    this.setState({ updateUI: !this.state.updateUI })
  }
  deleteImageButtonAction() {
    this.state.photo = null;
    this.setState({updateUI: !this.state.updateUI});
  }
  /*  UI   */
  RenderActionSheet = (id) => {
    return (
      <View>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={[this.state.translationDic['camera'] ?? "Camera", this.state.translationDic['gallery'] ?? 'Photos', "Cancel"]}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={(index) => { 
            if (index === 0) {
              ImagePicker.openCamera({
                height: 1000,
                width: 1000,
                cropping: true,
                includeBase64: true,
              }).then(image => {
                // console.log('image', image);
                if (id == 2) {
                  this.state.documentFile = image;
                }else {
                  this.state.photo = image;
                }
                this.setState({ updateUI: !this.state.updateUI })
              }).catch(error => {
                let erData = JSON.stringify(error['message']);
                if (erData == '"User did not grant library permission."') {
                  photosPermissionAlert()
                }
              });
            } else if (index === 1) {
              ImagePicker.openPicker({
                height: 1000,
                width: 1000,
                cropping: true,
                includeBase64: true,
              }).then(image => {
                // console.log('image', image);
                if (id == 2) {
                  this.state.documentFile = image;
                }else {
                  this.state.photo = image;
                }
                this.setState({ updateUI: !this.state.updateUI })
              }).catch(error => {
                let erData = JSON.stringify(error['message']);
                if (erData == '"User did not grant library permission."') {
                  photosPermissionAlert()
                }
              });
            }
          }}
        />
      </View>
    )
  }
  viewSelectedImages = () => {
    var views = [];
    if (this.state.photo != null) {
      var photoPath = ''
      if (this.state.photo['path']) {
        photoPath = this.state.photo.path;
      }else {
        photoPath = this.state.photo; 
      }
        views.push(
            <View style={styles.imageSelectedStyle}>
              <TouchableOpacity onPress={() => this.ActionSheet.show()}>
                {this.RenderActionSheet()}
                <View>
                  <FastImage source={{ uri: photoPath}} style={styles.SelectedImageStyle} resizeMode={'cover'} />
                  <TouchableOpacity
                    style={styles.deleteViewStyle}
                    onPress={() => this.deleteImageButtonAction()}>
                    <Image resizeMode={'center'} style={{height:20, width:20}}
                      source={cancelIcon}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>,
        );
      } else {
        views.push(
          <View>
            <TouchableOpacity style={styles.dottedViewStyle} onPress={() => this.ActionSheet.show()}>
              {this.RenderActionSheet()}
              <View style={{ justifyContent: 'center' }}>
                <Image source={cameraIcon}  style={{ width: 30, height: 30, alignSelf: 'center' }} />
              </View>
            </TouchableOpacity>
          </View>,
        );
      }
    return views;
  }
  renderTitleLbl = ({ title }) => {
    return (
      <View style={{margin: -5}}>
        <Text style={commonStyles.textLabelStyle}> {title == undefined ? this.state.translationDic['category'] ?? 'category' : title}
          <Text style={{color: colors.AppRed, paddingTop: 5}}> *</Text>
        </Text>
      </View>
    );
  }
  renderCategoryView = () => {
    return <View>
      {this.renderTitleLbl(this.state.translationDic['category'] ?? 'category')}
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
          var value = fieldType == 1 ? this.state.translationDic['select_single_value']  ?? 'Select Single Value' :  this.state.translationDic['select_multi_value']  ?? 'Select Multi Value'
          if (fieldType == 1) {
            if (this.state.singleSelectedArray.length !== 0) {
              let obj = this.state.singleSelectedArray.findIndex(x => x.valueId === item['id'])
              if (obj != -1) {
                let data = this.state.singleSelectedArray[obj]['data']
                value = data[0]['name']
              }
            }
          } else {
            if (this.state.multipleSelectedsArray.length != 0) {
              let obj = this.state.multipleSelectedsArray.findIndex(x => x.valueId === item['id'])
              // console.log('obj', obj);
              if (obj != -1) {
                let data = this.state.multipleSelectedsArray[obj]['data']
                var nameAry = [];
                for (let obj of data) {
                  nameAry.push(obj['name'])
                }
                value = nameAry.join()
              }
            }
          }
          let titleAray = [];
          if (item['optional'] == false) {
            titleAray.push(
              <View>
              {this.renderTitleLbl({title:item['name']})}
              </View>
            )
          } else {
            titleAray.push(
              <Text style={commonStyles.textLabelStyle}>{item['name']}</Text>
              )
          }
          views.push(<View>
            <View style={{ height: 20 }} />
            {titleAray}
            <View style={{ width: '100%', zIndex: 10 }}>
              <TouchableOpacity style={eventStyles.clickAbleFieldStyle} onPress={() => this.valueBtnAction(a)}>
                <Text style={commonStyles.txtFieldWithImageStyle} numberOfLines={1}>{value}</Text>
                <Image style={commonStyles.nextIconStyle} resizeMode="contain" source={forwardIcon} />
              </TouchableOpacity>
            </View>
          </View>)
        } else if (fieldType == 3) {
          var value = ''
          if (this.state.singleValueArray.length !== 0) {
            let obj = this.state.singleValueArray.findIndex(x => x.valueId === item['id'])
            if (obj != -1) {
              value = this.state.singleValueArray[obj]['text']
            }
          }
          views.push(<View>
            <View style={{ height: 20 }} />
            <Text style={commonStyles.textLabelStyle}>{item['name']}</Text>
            <TextInput
              style={commonStyles.addTxtFieldStyle}
              placeholder={'Enter Value'}
              value={this.state.singleValue}
              onChangeText={value => this.onChangeTextValue(value ,item['id'])}
              />
          </View>)
        } else if (fieldType == 4) {
          var tagAry = [];
          if (this.state.tagsArray.length !== 0) {
            let obj = this.state.tagsArray.findIndex(x => x.valueId === item['id'])
            if (obj != -1) {
              tagAry = this.state.tagsArray[obj]['data']
            }
          }
          views.push(<View>
            <View style={{ height: 20 }} />
            <Text style={commonStyles.textLabelStyle}>{item['name']}</Text>
            <Tags
              tagContainerStyle={{ backgroundColor: colors.LightGreenColor }}
              inputContainerStyle={{ backgroundColor: '#f5f5f5' }}
              initialTags={tagAry}
              onChangeTags={tags => this.onTagChanges(tags, item['id'])}
            />
          </View>)
        } else if (fieldType == 5) {
          var value = 'Upload file document limit of 5 MB';
          if (this.state.documentFile != null) {
            if (this.state.documentFile['path']) {
              let fname = this.state.documentFile['path'];
              value = fname.substring(fname.lastIndexOf('/')+1);
            } else {
              value = this.state.documentURLPath.substring(this.state.documentURLPath.lastIndexOf('/')+1);
            }
          }
          views.push(<View>
            <View style={{ height: 20 }} />
            <Text style={commonStyles.textLabelStyle}>{item['name']}</Text>
            <View style={{ height: 10 }} />
            <TouchableOpacity style={eventStyles.dottedViewStyle} onPress={() => this.ActionSheet.show()}>
              {this.RenderActionSheet(2)}
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
    var value = this.state.translationDic ['selectAddress'] ?? 'Select Address'
    if (this.state.selectAddress['formatted_address'] !== undefined) {
      value = this.state.selectAddress['formatted_address'];
    }
    return <View>
      <View style={{ height: 20 }} />
      <Text style={commonStyles.textLabelStyle}>{this.state.translationDic ['address'] ?? 'Address'}</Text>
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
        <HeaderView title={this.props.route.params ? this.state.translationDic['updateTitle'] : this.state.translationDic['title'] ?? 'Create your profile'} //{} 'Update your profile' : 'Create your profile '}
          showBackBtn={false} showDoneBtn={true}
          doneBtnTitle={appConstant.cancelTitle ??'Cancel'} doneBtnAction={() => this.cancelBtnAction()}/>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ margin: 16, width: windowWidth - 20, height: 120 }}>
              <this.viewSelectedImages />
            </View>
            <View style={{ backgroundColor: colors.AppWhite, height: '100%', padding: 16 }}>
              <this.renderTitleLbl title={this.state.translationDic['name'] } />
              <TextInput 
                style={commonStyles.addTxtFieldStyle}
                placeholder={this.state.translationDic['name'] }
                value={this.state.name}
                onChangeText={value => this.setState({name: value})}
                />
              <View style={{ height: 20 }} />
              <Text style={commonStyles.textLabelStyle}>{this.state.translationDic['description']}</Text>
              <TextInput
                style={commonStyles.txtViewStyle}
                placeholder={this.state.translationDic['description']}
                value={this.state.description}
                onChangeText={value => this.setState({description: value})}
                multiline={true} />
              <View style={{ height: 20 }} />
              <this.renderCategoryView />
              <this.renderAttributeFields />
              <View style={{ zIndex: 1,}}>
                <this.renderAddressView />
                <View style={{ height: 20 }} />
                {/* <this.renderTitleLbl title={'Preferred Shipment'} />
                <View>
                  <this.renderShipmentView />
                </View> */}
                <View style={{ height: 60 }} />
                <TouchableOpacity style={commonStyles.themeBtnStyle} onPress={() => this.createBtnAction()}>
                  <Text style={commonStyles.themeTitleStyle}>{this.props.route.params ? this.state.translationDic['updateTitle'] : this.state.translationDic['createBtn']}</Text>
                </TouchableOpacity>
                <View style={{ height: 60 }} />
              </View>
            </View>
            <SuccessView title={this.state.isEditing ? this.state.translationDic['update_success'] : this.state.translationDic['success'] ?? 'SuccessFul'} show={this.state.showCAlert} onPress={() => this.successAlert() }/>
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
    height: 120,
    width: 120,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteViewStyle: {
    height: 20,
    width: 20,
    marginLeft: 105,
    top: -125,
  },
  SelectedImageStyle: {
    height: 120,
    width: 120,
    borderRadius: 10,
  },
  dottedViewStyle: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    height: 120,
    width: 120,
    borderStyle: 'dashed',
    borderColor: colors.BorderColor
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

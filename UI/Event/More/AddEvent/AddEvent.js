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
  Alert,
} from 'react-native';
import NavigationRoots from '../../../../Constants/NavigationRoots';
import HeaderView from '../../../../Component/Header'
import colors from '../../../../CommonClasses/AppColor';
import eventStyles from '../../../../StyleSheet/EventStyleSheet';
import commonStyles from '../../../../StyleSheet/UserStyleSheet';
import dropdownIcon from '../../../../assets/Triangle.png';
import cameraIcon from '../../../../assets/camera.png';
import APPURL from '../../../../Constants/URLConstants';
import networkService from '../../../../NetworkManager/NetworkManager';
import appConstant from '../../../../Constants/AppConstants';
import ImagePicker from 'react-native-image-crop-picker';
import cancelIcon from '../../../../assets/cancel.png';
import forwardIcon from '../../../../assets/forward.png';
import upload from '../../../../assets/upload.png';
import Tags from "react-native-tags";
import calendarIcon from '../../../../assets/calendar.png';
import deleteIcon from '../../../../assets/deleteIcon.png';
import editGreen from '../../../../assets/editGreen.svg';
import timeIcon from '../../../../assets/timeIcon.png';
import Spinner from 'react-native-loading-spinner-overlay';
import sample from '../../../../assets/dummy.png';
import {changeDateFormat,getTimeFormat,dateConversionFromTimeStamp,convertTimeinto24Hrs} from '../../../../HelperClasses/SingleTon'
import FastImage from 'react-native-fast-image'
import SuccessView from '../../../../Component/SuccessView';
import SvgUri from 'react-native-svg-uri';
import radio from '../../../../assets/radio.svg';
import selectedradio from '../../../../assets/radioChecked.svg';
import ConstantArrays from '../../../../Constants/ConstantArrays';

var viewload = false;

export default class AddEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryArray: [],
      imagesArray: [],
      currencyArray: [],
      updateUI: false,
      isVisible: false,
      selectedCurrency: {},
      selectedCatData: {},
      categoryName: 'Select Category',
      attributeArray: [],
      singleSelectedArray: [],
      multipleSelectedsArray: [],
      singleValueArray: [],
      tagsArray: [],
      eventDateArray: [],
      selectAddress: {},
      uploadImageURL: [],
      attributeFilePath: '',
      documentFile: null,
      name: '',
      description: '',
      offerPrice: '',
      eventPrice: '',
      ticketLimit: '',
      accountId: 0,
      selectVariantArray: [],
      listingID: 0,
      isEditing: false,
      selectedVariantIndex: 0,
      showCAlert:false,
      coordinates:{},
      hideOfferPrice:false,
      hideAddressField:false,
      online:false,
    }
  }
  componentDidMount() {
    this.state.accountId = appConstant.accountID;
    // this.props.navigation.addListener('focus', () => {
      this.loadCategoryApi()
      this.loadConfigApi()
      this.getCurrencyApi()
    // })
    if (this.props.route.params) {
      let {listingID} = this.props.route.params;
      if (listingID != undefined) {
        this.state.listingID = listingID
        this.setState({isEditing: true})
        this.loadEventDetailApi();
        this.loadVariantTypeApi();
      }
    }
  }
  clearExitData() {
    this.state.imagesArray = [];
    this.state.name = '';
    this.state.description = '';
    this.state.offerPrice = '';
    this.state.eventPrice = '';
    this.state.ticketLimit = '';
    this.state.selectedCatData = {};
    this.state.categoryName = 'Select Category';
    this.state.attributeArray = [];
    this.state.eventDateArray = [];
    this.state.selectVariantArray = [];
    this.state.isEditing = false;

    this.setState({ updateUI: !this.state.updateUI})
  }

  /*  APIS Methods */
  loadConfigApi = async () => {
    const responseJson = await networkService.networkCall(APPURL.URLPaths.configList + 'listings', 'get','',appConstant.bToken,'')
    if (responseJson['status'] == true) {
      var configs = responseJson['data']['configs'];
      // console.log('configs -==>', configs)
      this.setState({
        hideOfferPrice: configs['hide_offer_percent'] || false,
        hideAddressField: configs['listing_address_enabled'] || false
      });
    }
    this.setState({dataLoad: true});
  };
  loadEventDetailApi = async () => {
    this.setState({ isVisible: true })
    const {accId} = this.props.route.params;
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.listings}/${this.state.listingID}`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let listData = responseJson['data']['listing'];
      console.log('dsds ===-=- =-', JSON.stringify(listData));
      this.state.name = listData['title'];
      this.state.description = listData['description'];
      this.state.selectAddress = listData['location'];
      this.state.coordinates = listData['coordinates']
      this.state.eventPrice = listData['list_price']['amount'];
      this.state.offerPrice = listData['offer_percent'];
      this.state.ticketLimit = listData['stock'];
      let attributeArray =  listData['attributes'];
      this.state.categoryName = listData['categories'][0]['name'];
      this.state.selectedCatData = listData['categories'][0];
      this.state.imagesArray = listData['images'] || [];
      this.loadAttributeApi(this.state.selectedCatData['id'])
      //  let sTime = getTimeFormat(listData['start_at']);
      // let eTime = getTimeFormat(listData['end_at']);
      // let dd = (listData['start_at'] * 1000);
      // let eventdate = changeDateFormat(dd,'ddd, D MMM yy')
      let schedules = listData['schedules'];
    
      for (let scObj of schedules) {
        console.log('scObj',scObj);
        let eventdate = changeDateFormat(scObj['start_date'], 'ddd, D MMM yy')
        let sTime = scObj['start_time'];
        let eTime = scObj['end_time'];
        if (scObj['repeat_days']) {
          let repeatClass = scObj['repeat_days'];
          var repeatIDs = '1,7';
          var repeatName = '';
          var repeatIndex = 0;
          repeatIDs = repeatClass.toString()
          let index = ConstantArrays.repeatArray.findIndex(x => x.id == repeatIDs);
          if (index == -1) {
            repeatIndex = 3;
            var nameary = [];
            for (let objc of repeatClass) {
              let ind = ConstantArrays.weekDays.findIndex(x => x.id == objc);
              nameary.push(ConstantArrays.weekDays[ind].name)
            }
            if (nameary.length != 0) {
              repeatName = nameary.toString()
            }
          } else {
            repeatIndex = index;
            repeatName = ConstantArrays.repeatArray[index].name;
          }
        }
        console.log('repeatName', repeatName);
        let dict = {
          date: eventdate,
          startTime: sTime,
          endTime: eTime,
          repeatClass: { 'id': repeatIDs, 'name': repeatName, 'repeatIndex': repeatIndex },
        }
        this.state.eventDateArray.push(dict);
      }
      console.log('this.state.eventDateArray === - ', this.state.eventDateArray)
      
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
              // this.state.singleValue = item['values'][0];
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
      this.setState({ updateUI: !this.state.updateUI,isVisible: false })
    }else {
      this.setState({ isVisible: false })
    }
  }
  loadCategoryApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(APPURL.URLPaths.category + 'listings', 'get', '', appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      let cData = responseJson['data']['categories'];
      this.state.categoryArray = cData;
      this.setState({ categoryArray: cData })
    } else {
      this.setState({ isVisible: false })
    }
  }
  loadAttributeApi = async (cid) => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.attribute + cid}&type=listings`, 'get', '', appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      let aData = responseJson['data']['attributes'];
      // console.log('aData == >.',JSON.stringify(aData))
      this.state.attributeArray = aData
      this.setState({ updateUI: !this.state.updateUI, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  loadVariantTypeApi  = async () =>  {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.listings}/${this.state.listingID}/variants`, 'get', '', appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      let vData = responseJson['data']['variants'];
      // console.log('vData', vData)
      for (let objc of vData){
        let v1 = objc['variant_values'][0];
        let dic1 = {
          name:v1['variant_type']['name'],
          id:v1['variant_type']['id'],
        }
        let vDict = {
          name:v1['variant_type_value']['name'],
          id:v1['variant_type_value']['id'],
        }
        dic1['values'] = vDict;
        let dic2 = {
          'list_price': objc['list_price']['amount'],
          'offer_percent': objc['offer_percent'],
          'stock': objc['stock'],
          'title': objc['title'],
          'description': objc['description'],
          'images': objc['images'],
        }
        
        let fDict = {'id': objc['id']};
        fDict['variantType'] = dic1;
        fDict['uploadParm'] = dic2;
        fDict['currency'] = this.state.selectedCurrency;
        this.state.selectVariantArray.push(fDict)
      }
      this.setState({ updateUI: !this.state.updateUI, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  getCurrencyApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.currencies}?user_id=${appConstant.userId}`, 'get', '', appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      let ccData = responseJson['data']['currencies'];
      this.state.currencyArray = ccData;
      if (this.state.currencyArray.length != 0) {
        this.state.selectedCurrency = ccData[0];
      }
      this.setState({ updateUI: !this.state.updateUI, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  uploadFilesAPI = async () => {
    this.setState({ isVisible: true })
    var imgParm = [];
    var uploadBase64 = [];
    if (this.state.imagesArray.length != 0) {
      for (let p = 0; p < this.state.imagesArray.length; p++) {
        let photo = this.state.imagesArray[p]
        let fileName = photo.data;
        if (fileName != null) {
          var dict = {
            name: photo['filename'],
            type: photo['mime'],
          };
          uploadBase64.push({
            file: 'data:image/png;base64,' + photo.data,
          });
          imgParm.push(dict);
        } else {
          this.state.uploadImageURL.push(photo);
        }
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
    if (imgParm != 0) {
      const responseJson = await networkService.networkCall(
        APPURL.URLPaths.S3signedUploadURL, 'POST', JSON.stringify({ files: imgParm }), appConstant.bToken, appConstant.authKey);
      if (responseJson['status'] == true) {
        var result = responseJson['data']['result'];
        var uploadIncrement = 0;
        for (let i = 0; i < imgParm.length; i++) {
          fetch(uploadBase64[i]['file']).then(async res => {
            const file_upload_res = await networkService.uploadFileWithSignedURL(result[i]['signedUrl'], imgParm[i]['type'],
              await res.blob(),
            );
            uploadIncrement++;
            if (uploadIncrement === uploadBase64.length) {
              var imageP = [];
              for (let obj of result) {
                imageP.push(obj['fileUri'])
              }
              if (this.state.documentFile != null) {
                this.setState({ attributeFilePath: imageP[imageP.length - 1] })
                imageP.splice(imageP.length - 1, 1)
                for (let a = 0; a < imageP.length; a++){
                  this.state.uploadImageURL.push(imageP[a]);
                }
              } else {
                for (let a = 0; a < imageP.length; a++){
                  this.state.uploadImageURL.push(imageP[a]);
                }
              }
              this.createEventApi()
            }
          });
        }
      } else {
        this.setState({ isVisible: false })
        Alert.alert(responseJson)
      }
    } else {
      this.createEventApi()
    }
  };
  createEventApi = async () => {
    var dict = {
      'category_id': [this.state.selectedCatData['id']],
      'title': this.state.name,
      'type': 'events',
      'currency_id': this.state.selectedCurrency['id'],
      'account_id': this.state.accountId,
    }
    if (this.state.imagesArray.length != 0) {
      dict['images'] = this.state.uploadImageURL;;
    }
    if (this.state.eventPrice.length != 0) {
      dict['list_price'] = this.state.eventPrice;
    }
    if (this.state.offerPrice.length != 0) {
      dict['offer_percent'] = this.state.offerPrice;
    }
    if (this.state.ticketLimit.length != 0) {
      dict['stock'] = this.state.ticketLimit;
    }
    if (this.state.description.length != 0) {
      dict['description'] = this.state.description;
    }
    if (this.state.selectAddress['formatted_address'] !== undefined) {
      dict['coordinates'] = this.state.coordinates;
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
        if (objc['optional'] == false) {
          if (localAry.length == 0) {
            Alert.alert(`Please select ${objc['name']}`);
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
            Alert.alert(`Please select ${objc['name']}`);
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
            Alert.alert(`Please select ${objc['name']}`);
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
            Alert.alert(`Please select ${objc['name']}`);
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
    // if (this.state.eventDateArray != 0) {
    //   let dateDict = this.state.eventDateArray[0];
    //   let startDate = dateDict['date'] + ` ${dateDict['startTime']}`
    //   let endDate = dateDict['date'] + ` ${dateDict['endTime']}`
    //   let startTimestamp = new Date(startDate).getTime() / 1000;
    //   let endTimestamp = new Date(endDate).getTime() / 1000;
    //   dict['start_at'] = startTimestamp;
    //   dict['end_at'] = endTimestamp;
    // }
    // console.log('dict', dict);
    let path = this.state.isEditing ? `/${this.state.listingID}` : ''
    const responseJson = await networkService.networkCall(APPURL.URLPaths.listings + path, 
      this.state.isEditing ? 'patch' : 'post', JSON.stringify({ listing: dict }), appConstant.bToken, appConstant.authKey)
    // console.log(" responseJson =  ", responseJson)
    if (responseJson) {
      this.setState({ isVisible: false })
      if (responseJson['status'] == true) {
        let dictData = responseJson['data']['listing'];
        this.state.listingID = dictData['id'] ;
        this.setState({ listingID: dictData['id'] })
        if (!this.state.isEditing){
          this.addVariantUploadServiceMethod(0);
        }else {
        // Alert.alert('Update SuccessFully')
        // this.setState({ showCAlert: true })
        this.scheduleAPI();
        }
      } else {
        Alert.alert(responseJson)
      }
    }
  }
  addVariantUploadServiceMethod(index) {
    let dic = this.state.selectVariantArray[index];
    if (dic != undefined){
      if (dic['variantType']) {
        let uploadDic = dic['uploadParm']['images'];
        this.uploadVariantImages(uploadDic, index);
      } else {
        if (this.state.selectVariantArray.length > index) {
          if (this.state.isEditing){
            this.addVariantUploadServiceMethod(index)
          } else {
            this.addVariantUploadServiceMethod(index + 1)
          }
        } else {
          // this.setState({ showCAlert: true })
          this.scheduleAPI();
        }
      }
    }else {
      // this.setState({ showCAlert: true })
      this.scheduleAPI();
    }
  }
  uploadVariantImages = async (uploadImageArray, index) => {
    this.setState({ isVisible: true })
    var imgParm = [];
    var uploadBase64 = [];
    var imageFileURI = [];
    if (uploadImageArray != undefined) {
      for (let p = 0; p < uploadImageArray.length; p++) {
        let photo = uploadImageArray[p]
        let fileName = photo.data;
        if (fileName != null) {
          var dict = {
            name: photo['filename'],
            type: photo['mime'],
          };
          uploadBase64.push({
            file: 'data:image/png;base64,' + photo.data,
          });
          imgParm.push(dict);
        }  else {
          imageFileURI.push(photo);
        }
      }
    }
    if (imgParm != 0) {
      const responseJson = await networkService.networkCall(
        APPURL.URLPaths.S3signedUploadURL, 'POST', JSON.stringify({ files: imgParm }), appConstant.bToken, appConstant.authKey);
      if (responseJson['status'] == true) {
        var result = responseJson['data']['result'];
        var uploadIncrement = 0;
        for (let i = 0; i < imgParm.length; i++) {
          fetch(uploadBase64[i]['file']).then(async res => {
            const file_upload_res = await networkService.uploadFileWithSignedURL(result[i]['signedUrl'], imgParm[i]['type'],
              await res.blob(),
            );
            uploadIncrement++;
            if (uploadIncrement === uploadBase64.length) {
              for (let obj of result) {
                imageFileURI.push(obj['fileUri'])
              }
              this.addVariantTypeApi(imageFileURI, index)
            }
          });
        }
      } else {
        this.setState({ isVisible: false })
        Alert.alert(responseJson)
      }
    } else {
      this.addVariantTypeApi(imageFileURI, index)
    }
  }
  addVariantTypeApi = async (images, index) => {
    let dic = this.state.selectVariantArray[index];
    var dict = dic['uploadParm'];
    dict['images'] = images;
    let item = dic['variantType']
    let variantvalues = [{variant_type_id: item['id'], variant_type_value_id:item['values']['id']}]
    dict['variant_values'] = variantvalues;
    var path = '/variants'
    var reqMethod = 'POST';
    if(dic['id']){
       path = '/variants/' + dic['id'];
       reqMethod = 'PUT';
    }
    // console.log('path == >', path, reqMethod, index)
    const responseJson = await networkService.networkCall(APPURL.URLPaths.listings + `/${this.state.listingID}${path}`,reqMethod,
     JSON.stringify({ variant: dict }), appConstant.bToken, appConstant.authKey)
    // console.log(" responseJson =  ", responseJson)
    if (responseJson) {
      this.setState({ isVisible: false })
      if (responseJson['status'] == true) {
        if (!this.state.isEditing) {
          this.addVariantUploadServiceMethod(index + 1)
        } else {
          // this.setState({ showCAlert: true });
          this.scheduleAPI();
        }
      } else {
        Alert.alert(responseJson)
      }
    }
  }
  scheduleAPI = async () => {
    this.setState({ isVisible: true })
    var uploadDic = []
    for (let obj of this.state.eventDateArray) {
      console.log('obj', obj);
      let dd = obj['date'];
      let scheduledate = changeDateFormat(dd, 'yyyy-MM-DD')
      let strt = convertTimeinto24Hrs(obj['startTime']);
      let endt = convertTimeinto24Hrs(obj['endTime']);
      var dic = {
        'start_date': scheduledate,
        'start_time': strt,
        'end_time': endt,
        'active': true,
      }
      dic['schedule_type'] = 1;
      if (obj['repeatClass']) {
        dic['schedule_type'] = obj['repeatClass']['name'] ? 2 : 1;
        if (obj['repeatClass']['name']) {
          let dsd = obj['repeatClass']['id'];
          const usingSplit = dsd.split(',');
          var ids = [];
          for(let imp of usingSplit) {
            ids.push(Number(imp));
          }
          dic['repeat_days'] = ids;
        }
      }
      uploadDic.push(dic);
      console.log('uploadDic', uploadDic)
    }  
    var path = APPURL.URLPaths.schedules;
    let reqMethod = 'PUT';
    const responseJson = await networkService.networkCall(APPURL.URLPaths.listings + `/${this.state.listingID}${path}`,reqMethod,
     JSON.stringify({ schedules: uploadDic}), appConstant.bToken, appConstant.authKey)
    // console.log(" responseJson =  ", responseJson)
    if (responseJson) {
      this.setState({ isVisible: false })
      if (responseJson['status'] == true) {
        this.setState({ showCAlert: true })
      } else {
        Alert.alert(responseJson)
      }
    }
  }
  deleteEventAPI = async (id) => {
    this.setState({ isVisible: true })
      let { listingID } = this.props.route.params;
      const responseJson = await networkService.networkCall(`${APPURL.URLPaths.listings}/${listingID}/variants/${id}`, 'DELETE', '', appConstant.bToken, appConstant.authKey)
      if (responseJson['status'] == true) {
        this.setState({ isVisible: false })
      } else {
        this.setState({ isVisible: false })
      }
  }
  successAlert() {
    this.clearExitData();
    this.setState({ isVisible: false })
    this.setState({showCAlert: false});
    this.props.navigation.goBack();
  }
  /*  Buttons   */
  backBtnAction(){
    this.clearExitData();
    this.props.navigation.goBack();
  }
  createBtnAction() {
    if (this.state.imagesArray.length == 0) {
      Alert.alert('Please select atleast one image')
    } else if (this.state.name.length == 0) {
      Alert.alert('Name field should not be empty')
    } else if (this.state.eventPrice.length == 0) {
      Alert.alert('Price field should not be empty')
    } else if (this.state.ticketLimit.length == 0) {
      Alert.alert('Ticket Limits field should not be empty')
    } else if (this.state.hideAddressField && !this.state.online && this.state.selectAddress['formatted_address'] == undefined) {
      Alert.alert('Address field should not be empty')
    } else if (Object.keys(this.state.selectedCatData).length == 0) {
      Alert.alert('Category field should not be empty')
    } else {
      this.uploadFilesAPI()
    }
  }
  selectDateTimeBtnAction(index) {
    if (index != undefined) {
      this.props.navigation.navigate(NavigationRoots.EventTiming, {
        eventDateTime: this.state.eventDateArray[0],
        getDateTime: this.getEventDateTime,
        id:index,
      });
    } else {
      this.props.navigation.navigate(NavigationRoots.EventTiming, {
        getDateTime: this.getEventDateTime
      });
    }
  }
  onlineBtnAction() {
    this.state.selectAddress = {};
    this.setState({online:!this.state.online});
  }
  deleteImageButtonAction(id) {
    this.state.imagesArray.splice(id, 1)
    this.setState({ updateUI: !this.state.updateUI });
  }
  currecnyBtnAction() {
    this.props.navigation.navigate(NavigationRoots.Currency, {
      currencyArray: this.state.currencyArray,
      getCurrencyID: this.getCurrencyData,
    });
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
      valueId:item['id'],
      getAtriValue: this.getAttributeSelectedValues,
      singleSelect: singleSelect,
    });
  }
  addressBtnAction() {
    this.props.navigation.navigate(NavigationRoots.AddressList, {
      getAddress: this.getAddress,
    });
  }
  addVarianBtnAction() {
    this.props.navigation.navigate(NavigationRoots.AddVariant, {
      getVariant: this.getVariant,
      selectVariantArray: this.state.selectVariantArray,
      isEditing: this.state.isEditing,
    });
  }
  didSelectVariant(id) {
    this.state.selectedVariantIndex = id;
    this.props.navigation.navigate(NavigationRoots.AddVariantValue, {
      variantData: this.state.selectVariantArray[id],
      index: id,
      currencyArray: this.state.currencyArray,
      getDeleteVariant: this.getDeleteVariant,
      getVariantTypeUploadValue: this.getVariantTypeUploadValue,
    });
  }
  deleteEventDateTimeBtnAction(id) {
    Alert.alert(
      "Are you sure you want to delete this event dete & time?", "",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "Yes", onPress: () => {
            this.state.eventDateArray.splice(id, 1);
            this.setState({ updateUI: !this.state.updateUI });
          }
        }
      ],
    )
  }
  /*  Delegates  */
  getDeleteVariant = data => {
    let { listingID } = this.props.route.params;
    if (listingID != undefined) {
      if (this.state.selectVariantArray[data]['id']){
        this.deleteEventAPI(this.state.selectVariantArray[data]['id'])
      }
    }
    this.state.selectVariantArray.splice(data, 1);
    this.setState({ updateUI: !this.state.updateUI });
  }
  getVariant = data => {
    var vAray = [... this.state.selectVariantArray];
    this.state.selectVariantArray = [];
    for (let a = 0; a < data.length; a++) {
      if (vAray[a]) {
        let vdic = vAray[a];
        if (vdic['variantType']['id'] == data[a]['id']) {
          this.state.selectVariantArray.push(vdic)
        }else {
        }
      }else {
        this.state.selectVariantArray.push(data[a])
      }
    }
    // this.state.selectVariantArray = data;
    this.setState({ updateUI: !this.state.updateUI });
  }
  getVariantTypeUploadValue = (data, index) => {
    this.state.selectedVariantIndex = index;
    this.state.selectVariantArray[index] = data;
    this.setState({ updateUI: !this.state.updateUI });
    if (this.state.isEditing) {
      this.addVariantUploadServiceMethod(this.state.selectedVariantIndex);
    }
  }
  getAddress = data => {
    this.state.coordinates = {
      'latitude':data['latitude'],
      'longitude':data['longitude'],
    }
    this.setState({ selectAddress: data });
  }
  getEventDateTime = data => {
    if (data['id'] != -1) {
      this.state.eventDateArray[data['id']] = data;
    }else {
      // this.state.eventDateArray = [];
      this.state.eventDateArray.push(data);
    }
    this.setState({ updateUI: !this.state.updateUI });
  }
  getSelectedCategoryID = data => {
    this.setState({ selectedCatData: data, categoryName: data['name'] })
    this.loadAttributeApi(data['id'])
  }
  getCurrencyData = (data) => {
    this.setState({ selectedCurrency: data[0]})
  }
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
  onChangeTextValue(text, id){
    let index = this.state.singleValueArray.findIndex(x => x.valueId === id)
    var valueDic = {};
    valueDic['valueId'] = id;
    valueDic['text'] = text;
    if (index != -1) {
      this.state.singleValueArray[index] = valueDic;
    } else {
      this.state.singleValueArray.push(valueDic);
    }
    // console.log('valueDic',valueDic);
    // this.state.tagsArray = data
    this.setState({ updateUI: !this.state.updateUI })
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
      // console.log('this.state.multipleSelectedsArray',this.state.multipleSelectedsArray);
    }
    this.setState({ updateUI: !this.state.updateUI })
  }
  /*  UI   */
  imagePicker(id) {
    ImagePicker.openPicker({
      height: 1000,
      width: 1000,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      if (id == 2) {
        this.state.documentFile = image;
      } else {
        this.state.imagesArray.push(image)
      }
      this.setState({ updateUI: !this.state.updateUI })
    }).catch(error => {
      let erData = JSON.stringify(error['message']);
      if (erData == '"User did not grant library permission."') {
        photosPermissionAlert()
      }
    });
  }
  viewSelectedImages = () => {
    var views = [];
    for (let i = 0; i < this.state.imagesArray.length + 1; i++) {
      let photo =  this.state.imagesArray[i];
      var photoPath = ''
      if (photo) {
        if (photo['sourceURL']) {
           photoPath = photo.path;
        }else {
          photoPath = photo; 
        }
      }
      if (this.state.imagesArray[i]) {
        views.push(
          <View style={styles.imageSelectedStyle}>
            <TouchableOpacity onPress={() => this.imagePicker()}>
              <View>
                <FastImage
                  source={{ uri: photoPath }}
                  style={styles.SelectedImageStyle}
                  resizeMode={'cover'}
                />
                <TouchableOpacity
                  style={styles.deleteViewStyle}
                  onPress={() => this.deleteImageButtonAction(i)}>
                  <Image resizeMode={'center'} style={{ height: 20, width: 20 }}
                    source={cancelIcon}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>,
        );
      } else {
        if (this.state.imagesArray.length < 4) {
          views.push(
            <View>
              <TouchableOpacity style={styles.dottedViewStyle} onPress={() => this.imagePicker()}>
                <View style={{ justifyContent: 'center' }}>
                  <Image source={cameraIcon}
                    style={{ width: 30, height: 30, alignSelf: 'center' }}
                  />
                </View>
              </TouchableOpacity>
            </View>,
          );
        } else {
          views.push(<View />)
        }
       
      }
    }
    return views;
  };
  renderTitleLbl = ({ title }) => {
    return (
      <View style={{ margin: -5 }}>
        <Text style={commonStyles.textLabelStyle}> {title == undefined ? 'Category' : title}
          <Text style={{ color: colors.AppRed, paddingTop: 5 }}> *</Text>
        </Text>
      </View>
    );
  }
  renderPriceView = () => {
    let amount = this.state.eventPrice
    return (<View>
      <View style={eventStyles.clickAbleFieldStyle}>
        <TextInput
          style={commonStyles.txtFieldWithImageStyle}
          placeholder={'Enter Price'}
          keyboardType={'number-pad'}
          value={amount.toString()}
          onChangeText={value => this.setState({ eventPrice: value })}
        />
        <TouchableOpacity style={{ width: 40, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}
          onPress={() => this.currecnyBtnAction()}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.AppTheme }}>
            {this.state.selectedCurrency['code']}
          </Text>
          <Image style={{ margin: 5, height: 10, width: 10 }} resizeMode='center' source={dropdownIcon} />
        </TouchableOpacity>
      </View>
    </View>)
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
                value = nameAry.join(', ')
              }
            }
          }

          let titleAray = [];
          if (item['optional'] == false) {
            titleAray.push(<View>
               {this.renderTitleLbl({title:item['name']})}
            </View>)
          } else {
            titleAray.push( <View>
              <Text style={commonStyles.textLabelStyle}>{item['name']}
              </Text>
              </View>
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
              value={value}
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
          if (this.state.documentFile !=  null) {
            if (this.state.documentFile['sourceURL'])  {
              value = this.state.documentFile['filename'];
            }else {
              value = this.state.attributeFilePath.substring(this.state.attributeFilePath.lastIndexOf('/')+1);
            }
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
    } else {
      views.push(<View />)
    }
    return views;
  }
  renderAddressView = () => {
    if (this.state.hideAddressField) {
      var onLineView = [];
      onLineView.push(<View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.onlineBtnAction()}>
          <Text style={{ fontSize: 16 }}>Offline</Text>
          <View style={{ width: 5 }} />
          <SvgUri width={20} height={20} source={!this.state.online ? selectedradio : radio}
            fill={!this.state.online ? colors.AppTheme : colors.Lightgray} />
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row',marginLeft: 20}} onPress={() => this.onlineBtnAction()}>
          <Text style={{ fontSize: 16 }}>Online</Text>
          <View style={{ width: 5 }} />
          <SvgUri width={20} height={20} source={this.state.online ? selectedradio : radio}
            fill={this.state.online ? colors.AppTheme : colors.Lightgray} />
        </TouchableOpacity>
      </View>)
      var value = 'Select Address'
      if (this.state.selectAddress['formatted_address'] !== undefined) {
        value = this.state.selectAddress['formatted_address'];
      }
      var addressView = [];
      if (!this.state.online) {
        addressView.push(<View>
          <View style={{ height: 20 }} />
          <Text style={commonStyles.textLabelStyle}>Address</Text>
          <View style={{ width: '100%', zIndex: 10 }}>
            <TouchableOpacity style={eventStyles.clickAbleFieldStyle} onPress={() => this.addressBtnAction()}>
              <Text style={commonStyles.txtFieldWithImageStyle}>{value}</Text>
              <Image style={commonStyles.nextIconStyle} resizeMode="contain" source={forwardIcon} />
            </TouchableOpacity>
          </View>
        </View>)
      }
      return <View>
        <View style={{ height: 20 }} />
          {onLineView}
          {addressView}
      </View>
    } else {
      return <View />
    }
  }
  renderEventDateTimeView = () => {
    return (<View style={styles.mainViewStyle}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={commonStyles.textLabelStyle}>Event Date & Time</Text>
        <View>
          <TouchableOpacity style={eventStyles.addBntViewStyle} onPress={() => this.selectDateTimeBtnAction()}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.AppTheme }}>Select</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        {this.renderEventDateTimeListView()}
      </View>
    </View>)
  }
  renderEventDateTimeListView = () => {
    return (<View>
      <FlatList
        data={this.state.eventDateArray}
        renderItem={this.renderListCellItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
      />
    </View>)
  }
  renderListCellItem = ({ item, index }) => {
    var views = []
    if (item['repeatClass']) {
      if (item['repeatClass']['name']) {
      views.push(<View>
        <Text style={eventStyles.subTitleStyle}>{item['repeatClass']['name'] || ''}</Text>
      </View>)
      }
    }
    return <View style={{ flexDirection: 'row', marginTop: 16, borderWidth: 1, borderColor: colors.BorderColor, padding: 5, justifyContent: 'space-between', borderRadius: 5 }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.calendarViewStyle}>
            <Image style={{ width: 20, height:23, marginRight:1, marginTop: -2}} source={calendarIcon} />
        </View>
        <View>
          <View style={{ margin: 5, flexDirection: 'row' }}>
            <Text style={{ fontSize: 14, fontWeight: '500' }}>{item['date']}</Text>
            <TouchableOpacity style={{marginLeft: 5}} onPress={() => this.selectDateTimeBtnAction(index)}>
              <SvgUri width={15} height={15} source={editGreen} fill={colors.AppTheme} />
            </TouchableOpacity>
          </View>
          <View style={{ margin: 5, flexDirection: 'row', alignItems: 'center' }}>
            <Image style={{ width: 12, height: 12 }}  source={timeIcon} />
            <View style={{ width: 5 }} />
            <Text style={eventStyles.subTitleStyle}>{`${item['startTime']} to ${item['endTime']}`}</Text>
          </View>
          {views}
        </View>
      </View>
      <TouchableOpacity onPress={() => this.deleteEventDateTimeBtnAction(index)}>
        <Image style={commonStyles.backBtnStyle} resizeMode='center' source={deleteIcon} />
      </TouchableOpacity>
    </View>
  }
  renderVariantsView = () => {
    return (<View style={styles.mainViewStyle}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={commonStyles.textLabelStyle}>Variants</Text>
        <View>
          <TouchableOpacity style={eventStyles.addBntViewStyle} onPress={() => this.addVarianBtnAction()}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.AppTheme }}>+Add Variants</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View >
        {this.renderVariantListView()}
      </View>
    </View>)
  }
  renderVariantListView = () => {
    if (this.state.selectVariantArray.length != 0) {
      return (<View style={{ marginTop: 20 }}>
        <FlatList
          data={this.state.selectVariantArray}
          renderItem={this.renderVariantListCellItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
        />
      </View>)
    } else { return <View /> }
  }
  renderVariantListCellItem = ({ item, index }) => {
    var title = "";
    var price = "";
    var stock = "";
    var available = "";
    var photos = [];
    if (item['values']) {
      title = item['values']['name'];
    }
    if (item['variantType']) {
      let value = item['variantType']
      if(value['values']) {
        title = value['values']['name'];
      }
      let pp = item['uploadParm']['list_price'] || '';
      let curency = item['currency']['format']
      if (curency != undefined) {
        price = curency.replace('{amount}', ` ${pp}`)
      } else {
        price = `$ ${pp}`
      }
      if (item['uploadParm']['stock']){
        stock = item['uploadParm']['stock'].length == 0 ? '0' : item['uploadParm']['stock'];
      }
      available = ` Available`
      photos = item['uploadParm']['images'] ? item['uploadParm']['images'] : [];
      if (photos.length != 0) {
        if (photos[0]['sourceURL']) { 
          photos = photos[0]['path'];
        } else {
          photos = photos[0];
        }
      }
    }
    return <TouchableOpacity style={styles.variantCellViewStyle} onPress={() => this.didSelectVariant(index)}>
      <View style={{ flexDirection: 'row' }}>
        <FastImage style={{ width: 70, height: 70 }} source={photos.length == 0 ? sample : { uri: photos}} />
        <View style={{ margin: 5 }}>
          <Text style={eventStyles.titleStyle}>{title}</Text>
          <View style={{ height: 5 }} />
          <Text style={{ fontSize: 14, fontWeight: '400', color: colors.AppGray }}>{price}</Text>
          <View style={{ height: 5 }} />
          <Text style={{ color: stock == '0' ? colors.AppRed : colors.Lightgray, fontSize: 12 }}>{stock + available}</Text>
        </View>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image style={commonStyles.backBtnStyle} resizeMode='center' source={forwardIcon} />
      </View>
    </TouchableOpacity>
  }
  renderOfferView = () => {
    if (this.state.hideOfferPrice) {
      return (<View style={{ marginTop: 20 }}>
        <Text style={commonStyles.textLabelStyle}>Offer Percentage</Text>
        <TextInput
          style={commonStyles.addTxtFieldStyle}
          placeholder={'Enter Offer Percentage'}
          value={this.state.offerPrice.toString()}
          keyboardType={'number-pad'}
          onChangeText={value => this.setState({ offerPrice: value })}
        />
      </View>)
    } else {
      return <View />
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title= {this.state.isEditing ? 'Update Event' : 'Add Event'} backBtnIcon={'close'} showBackBtn={true} backBtnAction={() => this.backBtnAction()} showDoneBtn={false} />
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor }}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
            <View style={{ padding: 16 }}>
              <ScrollView horizontal={true}>
                <View style={{ width: '100%', height: 130, flexDirection: 'row-reverse', marginTop: 10, alignContent: 'center' }}>
                  <this.viewSelectedImages />
                </View>
              </ScrollView>
              <Text style={eventStyles.subTitleStyle}>Maximum 4 Images</Text>
            </View>
            <View style={styles.mainViewStyle}>
              <this.renderTitleLbl title={'Name'} />
              <TextInput
                style={commonStyles.addTxtFieldStyle}
                placeholder={'Enter Name'}
                value={this.state.name}
                onChangeText={value => this.setState({ name: value })}
              />
              <View style={{ height: 20 }} />
              <Text style={commonStyles.textLabelStyle}>Description</Text>
              <TextInput
                style={commonStyles.txtViewStyle}
                placeholder={'Enter Description'}
                value={this.state.description}
                onChangeText={value => this.setState({ description: value })}
                multiline={true} />
              <View style={{ marginTop: 20 }}>
                <this.renderTitleLbl title={'Price'} />
                <this.renderPriceView />
              </View>
              <this.renderOfferView />
              <View style={{ height: 20 }} />
              <this.renderTitleLbl title={'Ticket Limits'} />
              <TextInput
                style={commonStyles.addTxtFieldStyle}
                placeholder={'Enter Ticket Limits'}
                keyboardType={'number-pad'}
                value={this.state.ticketLimit.toString()}
                onChangeText={value => this.setState({ ticketLimit: value })}
              />
              <View style={{ marginTop: 20 }} >
                <this.renderTitleLbl title={'Category'} />
                <TouchableOpacity style={eventStyles.clickAbleFieldStyle} onPress={() => this.categoryBtnAction()}>
                  <Text style={commonStyles.txtFieldWithImageStyle}>{this.state.categoryName}</Text>
                  <Image style={commonStyles.backBtnStyle} resizeMode='center' source={forwardIcon} />
                </TouchableOpacity>
              </View>
              <this.renderAttributeFields />
              <this.renderAddressView />
            </View>
            <View style={{ height: 10 }} />
            <this.renderEventDateTimeView />
            <View style={{ height: 10 }} />
            <this.renderVariantsView />
            <View style={{ height: 40 }} />
            <TouchableOpacity style={commonStyles.themeBtnStyle} onPress={() => this.createBtnAction()}>
              <Text style={commonStyles.themeTitleStyle}>{this.state.isEditing ? 'Update' : 'Create'}</Text>
            </TouchableOpacity>
            <View style={{ height: 80 }} />
            <SuccessView show={this.state.showCAlert} onPress={() => this.successAlert() }/>
          </ScrollView>
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
  calendarViewStyle:{
    height: 40,
    width: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: colors.AppWhite,
     borderRadius: 20
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
  mainViewStyle: {
    backgroundColor: colors.AppWhite,
    padding: 16,
    borderColor: colors.BorderColor,
    borderWidth: 1,
  },
  variantCellViewStyle: {
    flexDirection: 'row',
    margin: 5,
    borderWidth: 1,
    borderColor: colors.BorderColor,
    justifyContent: 'space-between',
    alignContent: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    height: 70,
  }
});



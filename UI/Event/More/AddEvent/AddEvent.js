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
import calendarIcon from '../../../../assets/calendarIcon.png';
import deleteIcon from '../../../../assets/deleteIcon.png';
import editGreen from '../../../../assets/editGreen.png';
import timeIcon from '../../../../assets/timeIcon.png';
import Spinner from 'react-native-loading-spinner-overlay';
import sample from '../../../../assets/dummy.png';


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
      selectedCatData:{},
      categoryName:'Select Category',
      attributeArray: [],
      singleSelectedArray: [],
      multipleSelectedsArray: [],
      singleValue: '',
      tagsArray: [],
      eventDateArray:[],
      selectAddress: {},
      uploadImageURL: [],
      documentURLPath: '',
      attributeFilePath: '',
      documentFile:null,
      name: '',
      description: '',
      offerPrice: '',
      eventPrice: '',
      ticketLimit:'',
      accountId: 0,
      selectVariantArray: [],
    }
  }
  componentDidMount() {
    let {accountId} = appConstant.accountID;
    this.state.accountId = accountId;
    this.loadCategoryApi()
    this.getCurrencyApi();
  }

  /*  APIS Methods */

  loadCategoryApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(APPURL.URLPaths.category + 'listings', 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let cData = responseJson['data']['categories'];
      this.state.categoryArray = cData;
      this.setState({categoryArray: cData})
    }else {
      this.setState({ isVisible: false })
    }
  }
  loadAttributeApi = async (cid) => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.attribute + cid}&type=listings`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let cData = responseJson['data']['attributes'];
      // console.log('cData == >',cData)
      this.state.attributeArray = cData
      this.setState({ updateUI: !this.state.updateUI,isVisible: false  })
    } else {
      this.setState({ isVisible: false })
    }
  }
  getCurrencyApi = async () => {
    this.setState({ isVisible: true })
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.currencies}?user_id=${appConstant.userId}`, 'get','',appConstant.bToken,appConstant.authKey)
    if (responseJson['status'] == true) {
      let ccData = responseJson['data']['currencies'];
      this.state.currencyArray = ccData;
      if (this.state.currencyArray.length != 0){
        this.state.selectedCurrency = ccData[0];
      }
      this.setState({ updateUI: !this.state.updateUI,isVisible: false })
    }else {
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
            if (uploadIncrement === uploadBase64.length) {
              var imageP = [];
              for (let obj of result) {
                imageP.push(obj['fileUri'])
              }
              if (this.state.documentFile != null) {
                this.setState({attributeFilePath: imageP[imageP.length - 1]})
                imageP.splice(imageP.length - 1, 1)
                this.state.uploadImageURL = imageP;
              } else {
                this.state.uploadImageURL = imageP;
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
      'category_id':[this.state.selectedCatData['id']],
      'title': this.state.name,
      'type': 'events',
      'currency_id': this.state.selectedCurrency['id'],
      'account_id': this.state.accountId,
    }
    if (this.state.imagesArray.length != 0) {
        dict['images'] = this.state.uploadImageURL;;
    }
    if (this.state.description.length != 0) {
      dict['description'] = this.state.description;
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
    if (this.state.selectAddress['formatted_address'] !== undefined) {
      latitude = this.state.selectAddress['latitude'];
      longitude = this.state.selectAddress['longitude'];
      dict['coordinates'] = {'latitude': latitude,'longitude': longitude};
    }

    var attributeAry = [];
    for (let objc of this.state.attributeArray) {
      let fieldType = objc['field_type'];
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
        console.log('this.state.attributeFilePath', this.state.attributeFilePath);
        if (this.state.attributeFilePath.length != 0) {
          let atrDic = {
            values:[this.state.attributeFilePath],
            id: objc['id'],
          }
          attributeAry.push(atrDic)
        }
      }
    }
    if (attributeAry != 0) {
      dict['attributes'] = attributeAry
    }
    console.log('dict == ', dict);
    const responseJson = await networkService.networkCall(APPURL.URLPaths.listings, 'POST', JSON.stringify({ listing: dict }),appConstant.bToken,appConstant.authKey)
    console.log(" responseJson =  ", responseJson) 
    if (responseJson) {
      this.setState({ isVisible: false })
      if (responseJson['status'] == true) {
        Alert.alert('SuccessFully')
      } else {
        Alert.alert(responseJson)
      }
    }
  }
  /*  Buttons   */
  createBtnAction() {
    this.uploadFilesAPI()
  }
  selectDateTimeBtnAction(isEdit) {
    if (isEdit) {
      this.props.navigation.navigate(NavigationRoots.EventTiming, {
        eventDateTime: this.state.eventDateArray[0],
        getDateTime: this.getEventDateTime
      });
    } else {
      this.props.navigation.navigate(NavigationRoots.EventTiming, {
        getDateTime: this.getEventDateTime
      });
    }
  }
  doneBtnAction () {
  }
  deleteImageButtonAction(id) {
    this.state.imagesArray.splice(id, 1)
    this.setState({updateUI: !this.state.updateUI});
  }
  currecnyBtnAction() {
    this.props.navigation.navigate(NavigationRoots.Currency, {
      currencyArray: this.state.currencyArray,
      getCurrencyID: this.getCurrencyData,
    });
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
  addressBtnAction() {
    this.props.navigation.navigate(NavigationRoots.AddressList, {
      getAddress: this.getAddress,
    });
  }
  addVarianBtnAction() {
    this.props.navigation.navigate(NavigationRoots.AddVariant,{
      getVariant: this.getVariant,
      selectVariantArray: this.state.selectVariantArray,
    });
  }
  didSelectVariant(id) {
    this.props.navigation.navigate(NavigationRoots.AddVariantValue,{
      variantData: this.state.selectVariantArray[id],
      index:id,
      currencyArray: this.state.currencyArray,
      getDeleteVariant: this.getDeleteVariant,
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
            this.setState({updateUI: !this.state.updateUI});
          }
        }
      ],
    )
  }  
  /*  Delegates  */
  getDeleteVariant = data => {
    this.state.selectVariantArray.splice(data, 1);
    this.setState({updateUI: !this.state.updateUI});
  }
  getVariant = data => {
    console.log('getVariant data', data);
    this.state.selectVariantArray = data;
    this.setState({updateUI: !this.state.updateUI});
  }
  getAddress = data => {
    this.setState({selectAddress: data});
  }
  getEventDateTime = data => {
    // console.log('data => ', data);
    this.state.eventDateArray = [];
    this.state.eventDateArray.push(data);
    this.setState({updateUI: !this.state.updateUI});
  }
  getSelectedCategoryID = data => {
    this.setState({selectedCatData: data, categoryName: data['name']})
    this.loadAttributeApi(data['id'])
  }
  getCurrencyData = (data) => {
    console.log('data => ', data);
    this.setState({selectedCurrency: data})
  }
  onTagChanges(data) {
    this.state.tagsArray = data
    this.setState({ updateUI: !this.state.updateUI })
  }
  getAttributeSelectedValues = (data, singleSelect) => {
    if (singleSelect) {
      this.state.singleSelectedArray = data
    } else {
      this.state.multipleSelectedsArray = data
    }
    this.setState({ updateUI: !this.state.updateUI })
  }
  /*  UI   */
  imagePicker(id) {
    ImagePicker.openPicker({
      height: 200,
      width: 200,
      cropping: false,
      includeBase64: true,
      compressImageQuality: 0.5,
    }).then(image => {
      if (id == 2) {
        this.state.documentFile = image;
      }else {
      this.state.imagesArray.push(image)
      }
      this.setState({updateUI: !this.state.updateUI})
    });
  }
  viewSelectedImages = () => {
    var views = [];
    for (let i = 0; i < this.state.imagesArray.length + 1; i++) {
      let imageObj = {};
      if (this.state.imagesArray[i]) {
        imageObj = this.state.imagesArray[i];
      }
      if (this.state.imagesArray[i]) {
        views.push(
            <View style={styles.imageSelectedStyle}>
              <TouchableOpacity onPress={() => this.imagePicker()}>
                <View>
                  <Image
                    source={{ uri: this.state.imagesArray[i].sourceURL}}
                    style={styles.SelectedImageStyle}
                    resizeMode={'cover'}
                  />
                  <TouchableOpacity
                    style={styles.deleteViewStyle}
                    onPress={() => this.deleteImageButtonAction(i)}>
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
            <View style={styles.dottedViewStyle}>
              <TouchableOpacity onPress={() => this.imagePicker()}>
                <View style={{ justifyContent: 'center' }}>
                  <Image source={cameraIcon}
                    style={{ width: 30, height: 30, alignSelf: 'center' }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>,
        );
      }
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

  renderPriceView = () => {
    return (<View>
      <View style={eventStyles.clickAbleFieldStyle}>
        <TextInput
          style={commonStyles.txtFieldWithImageStyle}
          placeholder={'Enter Price'}
          keyboardType={'number-pad'}
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
    </View>  )
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
          if (this.state.documentFile !== null) {
            value = this.state.documentFile.filename;
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
  renderEventDateTimeView = () => {
    return ( <View style={styles.mainViewStyle}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={commonStyles.textLabelStyle}>Event Date & Time</Text>
        <View>
          <TouchableOpacity style={eventStyles.addBntViewStyle} onPress={() => this.selectDateTimeBtnAction()}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.AppTheme}}>Select</Text>
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
    console.log('item',item)
    return <View style={{ flexDirection: 'row', marginTop: 16, borderWidth: 1, borderColor: colors.BorderColor, padding: 5, justifyContent: 'space-between', borderRadius: 5 }}>
      <View style={{ flexDirection: 'row' }}>
        <Image style={{ width: 40, height: 40 }} resizeMode='center' source={calendarIcon} />
        <View>
          <View style={{ margin: 5, flexDirection: 'row' }}>
            <Text style={{ fontSize: 14, fontWeight: '500' }}>{item['date']}</Text>
            <TouchableOpacity onPress={() => this.selectDateTimeBtnAction(true)}>
              <Image style={{ width: 12, height: 12, marginLeft: 10 }} resizeMode='center' source={editGreen} />
            </TouchableOpacity>
          </View>
          <View style={{ margin: 5, flexDirection: 'row', alignItems: 'center' }}>
            <Image style={{ width: 12, height: 12 }} resizeMode='center' source={timeIcon} />
            <View style={{ width: 5 }} />
            <Text style={eventStyles.subTitleStyle}>{`${item['startTime']} to ${item['endTime']}`}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => this.deleteEventDateTimeBtnAction(index)}>
        <Image style={commonStyles.backBtnStyle} resizeMode='center' source={deleteIcon} />
      </TouchableOpacity>
    </View>
  }
  renderVariantsView = () => {
    return ( <View style={styles.mainViewStyle}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={commonStyles.textLabelStyle}>Variants</Text>
        <View>
          <TouchableOpacity style={eventStyles.addBntViewStyle} onPress={() => this.addVarianBtnAction()}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.AppTheme}}>+Add Variants</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginTop: 20}}>
        {this.renderVariantListView()}
      </View>
    </View>)
  }
  renderVariantListView = () => {
    return (<View>
      <FlatList
        data={this.state.selectVariantArray}
        renderItem={this.renderVariantListCellItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
      />
    </View>)
  }
  renderVariantListCellItem = ({ item, index }) => {
    return <TouchableOpacity style={styles.variantCellViewStyle} onPress={() => this.didSelectVariant(index)}>
      <View style={{ flexDirection: 'row'}}>
        <Image style={{width: 60, height: 60 }}source={sample} />
        <View style={{margin: 5}}>
          <Text style={{ fontSize: 14, fontWeight: '500' }}>{item['values']['name']}</Text>
        </View>
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image style={commonStyles.backBtnStyle} resizeMode='center' source={forwardIcon} />
      </View>
    </TouchableOpacity>
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Add Event'} backBtnIcon={'close'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} showDoneBtn={false} />
        <Spinner visible={this.state.isVisible} textContent={'Loading...'} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor }}>
          <ScrollView showsVerticalScrollIndicator={false}>
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
                onChangeText={value => this.setState({ name: value })}
              />
              <View style={{ height: 20 }} />
              <Text style={commonStyles.textLabelStyle}>Description</Text>
              <TextInput
                style={commonStyles.txtViewStyle}
                placeholder={'Enter Description'}
                onChangeText={value => this.setState({ description: value })}
                multiline={true} />
              <View style={{ marginTop: 20 }}>
                <this.renderTitleLbl title={'Price'} />
                <this.renderPriceView />
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={commonStyles.textLabelStyle}>Offer Price</Text>
                <TextInput
                  style={commonStyles.addTxtFieldStyle}
                  placeholder={'Enter Offer Price'}
                  keyboardType={'number-pad'}
                  onChangeText={value => this.setState({ offerPrice: value })}
                />
              </View>
              <View style={{ marginTop: 20 }} >
                <this.renderTitleLbl title={'Category'} />
                <TouchableOpacity style={eventStyles.clickAbleFieldStyle} onPress={() => this.categoryBtnAction()}>
                  <Text style={commonStyles.txtFieldWithImageStyle}>{this.state.categoryName}</Text>
                  <Image style={commonStyles.backBtnStyle} resizeMode='center' source={forwardIcon} />
                </TouchableOpacity>
              </View>
              <this.renderAttributeFields />
              <View style={{ height: 20 }} />
              <this.renderTitleLbl title={'Ticket Limits'} />
              <TextInput
                style={commonStyles.addTxtFieldStyle}
                placeholder={'Enter Ticket Limits'}
                keyboardType={'number-pad'}
                onChangeText={value => this.setState({ ticketLimit: value })}
              />
              <this.renderAddressView />
            </View>
            <View style={{ height: 10 }} />
            <this.renderEventDateTimeView />
            <View style={{ height: 10 }} />
            <this.renderVariantsView />
            <View style={{ height: 40 }} />
            <TouchableOpacity style={commonStyles.themeBtnStyle} onPress={() => this.createBtnAction()}>
              <Text style={commonStyles.themeTitleStyle}>Create</Text>
            </TouchableOpacity>
            <View style={{ height: 80 }} />
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
  }
});


import React, { Component } from 'react';
import {
  Alert,
  TextInput,
  Text,
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import HeaderView from '../../../../Component/Header'
import colors from '../../../../CommonClasses/AppColor';
import commonStyles from '../../../../StyleSheet/UserStyleSheet';
import APPURL from '../../../../Constants/URLConstants';
import networkService from '../../../../NetworkManager/NetworkManager';
import appConstant from '../../../../Constants/AppConstants';
import FastImage from 'react-native-fast-image'
import cameraIcon from '../../../../assets/camera.png';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-crop-picker';
import { photosPermissionAlert } from '../../../../HelperClasses/SingleTon';

import LangifyKeys from '../../../../Constants/LangifyKeys';
import tradlyDb from '../../../../TradlyDB/TradlyDB';
import AppConstants from '../../../../Constants/AppConstants';
import ActionSheet from 'react-native-actionsheet'

// const windowWidth = Dimensions.get('window').width;

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: [],
      attributeArray: [],
      updateUI: false,
      firstname:'',
      lastname:'',
      email:'',
      isVisible:false,
      photo:null,
      translationDic:{},
    }
  }

  componentDidMount() {
    this.langifyAPI(LangifyKeys.editprofile);
    this.langifyAPI(LangifyKeys.chatdetail);
    this.setState({updateUI: !this.state.updateUI})
    let {userData} = this.props.route.params;
    console.log('userData ==> ', userData);
    if (userData != undefined) {
      this.state.email = userData['email'];
      this.state.firstname = userData['first_name'];
      this.state.lastname = userData['last_name'];
      this.state.photo = userData['profile_pic'] || null;
    }
    // this.getMyStoreApi();
  }
  langifyAPI = async (keyGroup) => {
    let searchD = await tradlyDb.getDataFromDB(keyGroup);
    if (searchD != undefined) {
      if (LangifyKeys.editprofile ==keyGroup) {
      this.editprofileTranslationData(searchD);
      }else {
        this.cameraTranslationData(searchD)
      }
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${keyGroup}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${appConstant.appLanguage}${group}`, 'get', '', AppConstants.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      if (LangifyKeys.editprofile == keyGroup) {
        tradlyDb.saveDataInDB(keyGroup, objc)
        this.editprofileTranslationData(objc);
      }else {
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
  editprofileTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('variant.title' == obj['key']) {
        this.state.translationDic['title'] = obj['value'];
      }  
      if ('variant.submit' == obj['key']) {
        this.state.translationDic['submit'] = obj['value'];
      } 
      if ('variant.firstname' == obj['key']) {
        this.state.translationDic['firstname'] = obj['value'];
      } 
      if ('variant.email' == obj['key']) {
        this.state.translationDic['email'] = obj['value'];
      }
      if ('variant.lastname' == obj['key']) {
        this.state.translationDic['lastname'] = obj['value'];
      }
    }
  }
  uploadPhotoAPI = async () => {
    this.setState({ isVisible: true })
    var imgParm = [];
    var uploadBase64 = [];
    if (this.state.photo != null) {
      let fileName = this.state.photo.data;
      if (fileName != null) {
        let fname = this.state.photo['path'];
        let fValue = fname.substring(fname.lastIndexOf('/')+1);
        var photoDic = {
          name: fValue,
          type: this.state.photo['mime'],
        };
        uploadBase64.push({
          file: this.state.photo['path'],
        });
        imgParm.push(photoDic);
      }
    }
    if (imgParm != 0) {
      const responseJson = await networkService.networkCall(
        APPURL.URLPaths.S3signedUploadURL, 'POST', JSON.stringify({ files: imgParm }), appConstant.bToken, appConstant.authKey);
      if (responseJson['status'] == true) {
        var result = responseJson['data']['result'];
        for (let i = 0; i < imgParm.length; i++) {
          let fileURL = uploadBase64[i]['file'];
          await networkService.signedURLUpload(result[i]['signedUrl'],imgParm[i]['type'],fileURL).then(res => {
              this.UpdateProfileAPI(result[0]['fileUri']);
          })
        }
      } else {
        this.setState({ isVisible: false })
        Alert.alert(responseJson)
      }
    } else {
      this.UpdateProfileAPI(this.state.photo != null ? this.state.photo : '')
    }
  };
  UpdateProfileAPI = async (photoPath) => {
    let dic = {
      'first_name': this.state.firstname,
      'last_name': this.state.lastname,
      'profile_pic': photoPath
    }
    this.setState({ isVisible: true })
    let method = 'PATCH';
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.users}${appConstant.userId}`, 
    method,JSON.stringify({user: dic}), appConstant.bToken, appConstant.authKey)
    if (responseJson['status'] == true) {
      this.setState({ updateUI: !this.state.updateUI, isVisible: false })
      this.props.navigation.goBack();
    } else {
      this.setState({ isVisible: false })
    }
  }
  /*  Buttons   */
  submitBtnAction () {
    this.uploadPhotoAPI()
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
                this.state.photo = image;
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
                this.state.photo = image;
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
  imagePicker(id) {
    ImagePicker.openPicker({
      height: 1000,
      width: 1000,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      this.state.photo = image;
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
    if (this.state.photo != null) {
      let photo =  this.state.photo;
      var photoPath = ''
      if (photo) {
        // if (photo['sourceURL']) {
        if (photo['path']) {
           photoPath = photo.path;
        }else {
          photoPath = photo; 
        }
      }
      views.push(
        <View style={styles.imageSelectedStyle}>
          <TouchableOpacity onPress={() => this.ActionSheet.show()}>
            {this.RenderActionSheet()}
            <FastImage source={{ uri: photoPath }} style={styles.SelectedImageStyle} resizeMode={'cover'} />
          </TouchableOpacity>
        </View>,
      );
    } else {
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
    }

    return views;
  };
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={this.state.translationDic['title'] ?? 'Edit Profile'} backBtnIcon={'close'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}/>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{height: '100%', backgroundColor: colors.LightBlueColor }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ padding: 16, justifyContent: 'center',height: 150, alignItems: 'center'}}>
              <View style={{width: 140, height: 140, justifyContent: 'center'}}> 
                <this.viewSelectedImages />
              </View>
            </View>
            <View style={{ backgroundColor: colors.LightBlueColor, padding: 16 }}>
              <Text style={commonStyles.textLabelStyle}>{this.state.translationDic['firstname'] ?? 'First Name'}</Text>
              <TextInput
                style={commonStyles.addTxtFieldStyle}
                placeholder={this.state.translationDic['firstname'] ?? 'First Name'}
                value={this.state.firstname}
                onChangeText={value => this.setState({ firstname: value })}
              />
              <View style={{ height: 20 }} />
              <Text style={commonStyles.textLabelStyle}>{this.state.translationDic['lastname'] ?? 'Last Name'}</Text>
              <TextInput
                style={commonStyles.addTxtFieldStyle}
                placeholder={this.state.translationDic['lastname'] ?? 'Last Name'}
                value={this.state.lastname}
                onChangeText={value => this.setState({ lastname: value })}
              />
              <View style={{ height: 20 }} />
              <Text style={commonStyles.textLabelStyle}>{this.state.translationDic['email'] ?? 'email'}</Text>
              <TextInput
                style={commonStyles.addTxtFieldStyle}
                value={this.state.email}
                editable={false}
              />
              <View style={{ height: 50 }} />
              <TouchableOpacity style={commonStyles.themeBtnStyle} onPress={() => this.submitBtnAction()}>
                <Text style={commonStyles.themeTitleStyle}>{this.state.translationDic['submit'] ?? 'Submit'}</Text>
              </TouchableOpacity>
              <View style={{ height: 50 }} />
            </View>
          </ScrollView >
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
    borderColor: colors.LightUltraGray,
    borderWidth:1,
    borderRadius:5,
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
});


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
    }
  }

  componentDidMount() {
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
          file: 'data:image/png;base64,' + this.state.photo.data,
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
          fetch(uploadBase64[i]['file']).then(async res => {
            const file_upload_res = await networkService.uploadFileWithSignedURL(result[i]['signedUrl'], imgParm[i]['type'],
              await res.blob(),
            );
            this.UpdateProfileAPI(result[0]['fileUri']);
          });
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
        if (photo['path']) {
           photoPath = photo.path;
        }else {
          photoPath = photo; 
        }
      }
      views.push(
        <View style={styles.imageSelectedStyle}>
          <TouchableOpacity onPress={() => this.imagePicker()}>
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
        <HeaderView title={'Edit Profile'} backBtnIcon={'close'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}/>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{height: '100%', backgroundColor: colors.LightBlueColor }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ padding: 16, justifyContent: 'center',height: 150, alignItems: 'center'}}>
              <View style={{width: 140, height: 140, justifyContent: 'center'}}> 
                <this.viewSelectedImages />
              </View>
            </View>
            <View style={{ backgroundColor: colors.LightBlueColor, padding: 16 }}>
              <Text style={commonStyles.textLabelStyle}>First Name</Text>
              <TextInput
                style={commonStyles.addTxtFieldStyle}
                placeholder={'Enter first name'}
                value={this.state.firstname}
                onChangeText={value => this.setState({ firstname: value })}
              />
              <View style={{ height: 20 }} />
              <Text style={commonStyles.textLabelStyle}>Last Name</Text>
              <TextInput
                style={commonStyles.addTxtFieldStyle}
                placeholder={'Enter last name'}
                value={this.state.lastname}
                onChangeText={value => this.setState({ lastname: value })}
              />
              <View style={{ height: 20 }} />
              <Text style={commonStyles.textLabelStyle}>Email ID</Text>
              <TextInput
                style={commonStyles.addTxtFieldStyle}
                value={this.state.email}
                editable={false}
              />
              <View style={{ height: 50 }} />
              <TouchableOpacity style={commonStyles.themeBtnStyle} onPress={() => this.submitBtnAction()}>
                <Text style={commonStyles.themeTitleStyle}>Submit</Text>
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


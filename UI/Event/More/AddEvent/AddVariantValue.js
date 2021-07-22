import React, { Component } from 'react';
import {
  FlatList,
  Text,
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import NavigationRoots from '../../../../Constants/NavigationRoots';
import HeaderView from '../../../../Component/Header'
import colors from '../../../../CommonClasses/AppColor';
import cameraIcon from '../../../../assets/camera.png';
import upload from '../../../../assets/upload.png';
import dropdownIcon from '../../../../assets/dropdown.png';
import commonStyles from '../../../../StyleSheet/UserStyleSheet';
import Spinner from 'react-native-loading-spinner-overlay';
import errorHandler from '../../../../NetworkManager/ErrorHandle'
import ImagePicker from 'react-native-image-crop-picker';
import APPURL from '../../../../Constants/URLConstants';
import DefaultPreference from 'react-native-default-preference';
import networkService from '../../../../NetworkManager/NetworkManager';
import appConstant from '../../../../Constants/AppConstants';
import eventStyles from '../../../../StyleSheet/EventStyleSheet';

const windowWidth = Dimensions.get('window').width;


// const windowWidth = Dimensions.get('window').width;

export default class AddVariantValue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible:false,
      updateUI: false,
      currencyArray: [],
      selectedCurrency: {},
      photo: null,
      name: '',
      description: '',
      offerPrice: '',
      price: '',
      ticketLimit:'',
    }
  }
  componentDidMount() {
    let {currencyArray} = this.props.route.params;
    this.state.currencyArray = currencyArray;
    this.state.selectedCurrency = currencyArray[0];
    this.setState({ updateUI: !this.state.updateUI })
  }
  uploadFilesAPI = async () => {
    this.setState({ isVisible: true })
    var imgParm = [];
    var uploadBase64 = [];
    if (this.state.photo != null) {
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
              this.addVariantTypeApi(result[i]['fileUri'])
          });
        }
      } else {
        this.setState({ isVisible: false })
        let error = errorHandler.errorHandle(responseJson['error']['code'])
        console.log('error',error)
        Alert.alert(error)
      }
    } else {
      this.addVariantTypeApi('')
    }
  };
  addVariantTypeApi = async (imagePath) => {
    var dict = {}
    if (imagePath.length != 0) {
      dict['images'] = imagePath;
    } 
    let valueray = [this.state.name,this.state.description, this.state.price,this.state.ticketLimit,this.state.offerPrice];
    let keyAry = ['title','description','list_price', 'stock','offer_percent'];
    for (let a = 0; a < keyAry.length; a++) {
      if (valueray[a].length != 0) {
        dict[keyAry[a]] = valueray[a];
      }
    }
    const responseJson = await networkService.networkCall(APPURL.URLPaths.listings + '/77/variants', 'POST', JSON.stringify({variant: dict}),appConstant.bToken,appConstant.authKey)
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
  currecnyBtnAction() {
    this.props.navigation.navigate(NavigationRoots.Currency, {
      currencyArray: this.state.currencyArray,
      getCurrencyID: this.getCurrencyData,
    });
  }
  submitBtnAction () {
    this.uploadFilesAPI();
  }
  deleteBtnAction() {
    Alert.alert(
      "Are you sure you want to delete this?", "",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "Yes", onPress: () => {
            let {index} = this.props.route.params;
            this.props.route.params.getDeleteVariant(index);
            this.props.navigation.goBack()
          }
        }
      ],
    )
  }
  /*  Buttons   */
  getCurrencyData = (data) => {
    console.log('data => ', data);
    this.setState({selectedCurrency: data[0]})
  }
  /*  UI   */
  imagePicker(id) {
    ImagePicker.openPicker({
      height: 200,
      width: 200,
      cropping: false,
      includeBase64: true,
    }).then(image => {
      this.state.photo = image;
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
                <Image source={{ uri: this.state.photo.sourceURL }}
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
  renderPriceView = () => {
    return (<View>
      <View style={eventStyles.clickAbleFieldStyle}>
        <TextInput
          style={commonStyles.txtFieldWithImageStyle}
          placeholder={'Enter Price'}
          keyboardType={'number-pad'}
          onChangeText={value => this.setState({ price: value })}
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
  render() {
    let {variantData} = this.props.route.params;
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={variantData['values']['name']}
          showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}  showDoneBtn={true}
          doneBtnTitle={'Delete'} doneBtnAction={() => this.deleteBtnAction()}/>
        <Spinner visible={this.state.isVisible} textContent={'Loading...'} textStyle={commonStyles.spinnerTextStyle} />
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ margin: 10, width: windowWidth - 20, height: imagePickerHeight }}>
              <this.viewSelectedImages />
            </View>
            <View style={{ backgroundColor: colors.AppWhite, height: '80%', padding: 16 }}>
            <Text style={commonStyles.textLabelStyle}>Title</Text>
              <TextInput 
                style={commonStyles.addTxtFieldStyle}
                placeholder={'Enter Name'}
                onChangeText={value => this.setState({name: value})}
                />
              <View style={{ height: 20 }} />
              <Text style={commonStyles.textLabelStyle}>Description</Text>
              <TextInput
                style={commonStyles.txtViewStyle}
                placeholder={'Enter Description'}
                onChangeText={value => this.setState({description: value})}
                multiline={true} />
              <View style={{ marginTop: 20 }}>
              <Text style={commonStyles.textLabelStyle}>Price</Text>
                <this.renderPriceView />
              </View>
              <View style={{ height: 20 }} />
              <Text style={commonStyles.textLabelStyle}>Offer %</Text>
              <View style={eventStyles.clickAbleFieldStyle}>
                <Text style={{marginTop: 18,fontSize: 20, width: 20}}>%</Text>
                <TextInput
                  style={commonStyles.txtFieldWithImageStyle}
                  placeholder={'Enter Offer '}
                  keyboardType={'number-pad'}
                  onChangeText={value => this.setState({offerPrice: value})}
                  />
              </View>
              <View style={{ height: 20 }} />
              <Text style={commonStyles.textLabelStyle}>Ticket Limit</Text>
              <TextInput
                style={commonStyles.txtViewStyle}
                placeholder={'Enter Ticket Limit'}
                keyboardType={'number-pad'}
                onChangeText={value => this.setState({ticketLimit: value})}
                />
              <View style={{ height: 20 }} />
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

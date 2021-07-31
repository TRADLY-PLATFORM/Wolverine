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
import cancelIcon from '../../../../assets/cancel.png';
import FastImage from 'react-native-fast-image'


const keyAry = ['title','description','list_price', 'stock','offer_percent'];

// const windowWidth = Dimensions.get('window').width;

export default class AddVariantValue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible:false,
      updateUI: false,
      currencyArray: [],
      selectedCurrency: {},
      imagesArray: [],
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
    let {variantData} = this.props.route.params;
    if (variantData['variantType']) {
      let uploadParm = variantData['uploadParm'];
      this.state.imagesArray = uploadParm['images'];
      this.state.name = uploadParm[keyAry[0]];
      this.state.description = uploadParm[keyAry[1]];
      this.state.price = uploadParm[keyAry[2]];
      this.state.ticketLimit = uploadParm[keyAry[3]];
      this.state.offerPrice = uploadParm[keyAry[4]];
      this.state.selectedCurrency = variantData['currency'];
    } 
    this.setState({ updateUI: !this.state.updateUI })
  }
  /*  Buttons   */
  currecnyBtnAction() {
    this.props.navigation.navigate(NavigationRoots.Currency, {
      currencyArray: this.state.currencyArray,
      getCurrencyID: this.getCurrencyData,
    });
  }
  submitBtnAction () {
    var dict = {}
    if (this.state.imagesArray.length != 0) {
      dict['images'] = this.state.imagesArray;
    } 
    dict['active'] = true;
    let valueray = [this.state.name,this.state.description, this.state.price,this.state.ticketLimit,this.state.offerPrice];
    let keyAry = ['title','description','list_price', 'stock','offer_percent'];
    for (let a = 0; a < keyAry.length; a++) {
      if (valueray[a].length != 0) {
        dict[keyAry[a]] = valueray[a];
      }
    }
    let {index,variantData} = this.props.route.params;
    let uploadDic = {
      uploadParm: dict,
      currency:this.state.selectedCurrency,
    }
    if (variantData['variantType']) {
      uploadDic['variantType'] = variantData['variantType'];
    }else {
      uploadDic['variantType'] = variantData;
    }
    this.props.route.params.getVariantTypeUploadValue(uploadDic,index)
    this.props.navigation.goBack()
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
  deleteImageButtonAction(id) {
    this.state.imagesArray.splice(id, 1)
    this.setState({updateUI: !this.state.updateUI});
  }
  /*  UI   */
  imagePicker(id) {
    ImagePicker.openPicker({
      height: 200,
      width: 200,
      cropping: false,
      includeBase64: true,
    }).then(image => {
      // this.state.photo = image;
      this.state.imagesArray.push(image);
      this.setState({ updateUI: !this.state.updateUI })
    });
  }
  viewSelectedImages = () => {
    var views = [];
    for (let i = 0; i < this.state.imagesArray.length + 1; i++) {
      let photo =  this.state.imagesArray[i];
      var photoPath = ''
      if (photo) {
        if (photo['sourceURL']) {
           photoPath = photo.sourceURL;
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
                    source={{ uri: photoPath}}
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
  renderPriceView = () => {
    return (<View>
      <View style={eventStyles.clickAbleFieldStyle}>
        <TextInput
          style={commonStyles.txtFieldWithImageStyle}
          placeholder={'Enter Price'}
          keyboardType={'number-pad'}
          value={this.state.price.toString()}
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
    var title = ''
    if (variantData['values']) {
      title = variantData['values']['name'];
    } else {
      let value = variantData['variantType']
      title = value['values']['name'];
    }
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={title}
          showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}  showDoneBtn={true}
          doneBtnTitle={'Delete'} doneBtnAction={() => this.deleteBtnAction()}/>
        <Spinner visible={this.state.isVisible} textContent={''} textStyle={commonStyles.spinnerTextStyle} />
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
            <View style={{ backgroundColor: colors.AppWhite, height: '80%', padding: 16 }}>
            <Text style={commonStyles.textLabelStyle}>Title</Text>
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
                  value={this.state.offerPrice.toString()}
                  onChangeText={value => this.setState({offerPrice: value})}
                  />
              </View>
              <View style={{ height: 20 }} />
              <Text style={commonStyles.textLabelStyle}>Ticket Limit</Text>
              <TextInput
                style={commonStyles.txtViewStyle}
                placeholder={'Enter Ticket Limit'}
                keyboardType={'number-pad'}
                value={this.state.ticketLimit.toString()}
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
});

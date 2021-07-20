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

// const windowWidth = Dimensions.get('window').width;

export default class AddEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryArray: [],
      imagesArray: [],
      documentFile:null,
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
    }
  }
  componentDidMount() {
    this.loadCategoryApi()
    this.getCurrencyApi();
  }
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
      console.log('cData == >',cData)
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
  /*  Buttons   */
  didSelect = (item, itemData) => {
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
  /*  Delegates  */
  getSelectedCategoryID = data => {
    this.setState({selectedCatData: data, categoryName: data['name']})
    this.loadAttributeApi(data['id'])
  }
  getCurrencyData = (data) => {
    console.log('data => ', data);
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
  /*  UI   */
  imagePicker(id) {
    ImagePicker.openPicker({
      height: 200,
      width: 200,
      cropping: true,
    }).then(image => {
      if (id == 2) {
        this.state.documentFile = image;
      }else {
      this.state.imagesArray.push(image.sourceURL)
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
                    source={{ uri: this.state.imagesArray[i]}}
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
          onChangeText={value => this.setState({ name: value })}
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
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Add Event'} backBtnIcon={'close'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} showDoneBtn={true} />
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
                onChangeText={value => this.setState({ name: value })}
              />
            </View>
            <View style={{ height: 10 }} />
            <View style={styles.mainViewStyle}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <this.renderTitleLbl title={'Event Date & Time'} />
                <View>
                  <View style={styles.activeBntViewStyle}>
                  <Text style={{fontSize: 12, fontWeight: '500', color: colors.AppTheme, }}>Select</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ height: 60 }} />
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
  activeBntViewStyle: {
    backgroundColor: colors.AppWhite,
    width: 80,
    height: 30,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.AppTheme,
    borderWidth: 1
  },
});


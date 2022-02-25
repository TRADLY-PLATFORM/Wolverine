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
} from 'react-native';
import NavigationRoots from '../../Constants/NavigationRoots';
import HeaderView from '../../Component/Header'
import colors from '../../CommonClasses/AppColor';
import commonStyles from '../../StyleSheet/UserStyleSheet';
import forwardIcon from '../../assets/forward.png';
import empty from '../../assets/empty.png';

import APPURL from '../../Constants/URLConstants';
import networkService from '../../NetworkManager/NetworkManager';
import appConstant from '../../Constants/AppConstants';

import LangifyKeys from '../../Constants/LangifyKeys';
import tradlyDb from '../../TradlyDB/TradlyDB';


export default class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryArray: [],
      updateUI: false,
      selectIndex: -1,
      catIndex: 0,
      translationDic:{},
      titleName: '',
    }
  }

  componentDidMount() {
    this.langifyAPI()
    let {categoryList} = this.props.route.params;
    this.state.categoryArray = categoryList
    this.setState({updateUI: !this.state.updateUI})
  }
  langifyAPI = async () => {
    let addStoreD = await tradlyDb.getDataFromDB(LangifyKeys.category);
    if (addStoreD != undefined) {
      this.addressTranslationData(addStoreD);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: true })
    }
    let group = `&group=${LangifyKeys.category}`
    const responseJson = await networkService.networkCall(`${APPURL.URLPaths.clientTranslation}${appConstant.appLanguage}${group}`, 'get', '', appConstant.bToken)
    if (responseJson['status'] == true) {
      let objc = responseJson['data']['client_translation_values'];
      tradlyDb.saveDataInDB(LangifyKeys.category, objc)
      this.addressTranslationData(objc);
      this.setState({ updateUI: true, isVisible: false })
    } else {
      this.setState({ isVisible: false })
    }
  }
  addressTranslationData(object) {
    this.state.translationDic = {};
    for (let obj of object) {
      if ('category.header_title' == obj['key']) {
        this.state.translationDic['title'] =  obj['value'];
      }
      if ('category.no_categories_available' == obj['key']) {
        this.state.translationDic['no_categories_available'] =  obj['value'];
      }
    }
  }
  /*  Buttons   */
  didSelect(item,index) {
    this.setState({selectIndex: index})
    if (item['sub_category']) {
      console.log(item['name'],'coming', this.state.catIndex);
      console.log('second', item['sub_category'].length);
      if (item['sub_category'].length != 0) {
        this.state.titleName = item['name'];
        this.state.categoryArray = item['sub_category'];
        this.setState({ catIndex: this.state.catIndex + 1 })
      } else {
        this.props.navigation.navigate(NavigationRoots.EventList, {
          categoryID: item['id'],
          categoryName: item['name'],
        });
      }
    } else {
      this.props.navigation.navigate(NavigationRoots.EventList, {
        categoryID: item['id'],
        categoryName: item['name'],
      });
    }
  }
  doneBtnAction () {
    this.props.navigation.goBack();
  }
  backBtnAction(){
    if(this.state.catIndex == 0) {
      this.props.navigation.pop()
    } else {
      let {categoryList} = this.props.route.params;
      this.state.categoryArray = categoryList;
      this.setState({catIndex: this.state.catIndex - 1})
    }
  }
  /*  UI   */
 
  renderListView = () => {
    return (<View style={{margin: 5, height: '90%'}}>
      <FlatList
        data={this.state.categoryArray}
        renderItem={this.renderListViewCellItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
      />
    </View>)
  }
  renderListViewCellItem = ({item, index}) => {
    var check = false
    if (item['sub_category']) {
       check = item['sub_category'].length == 0 ? true : false;
    }
    return (
      <TouchableOpacity onPress={() => this.didSelect(item,index)}>
        <View style={styles.listViewStyle}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.imageThumbnail} >
              <Image style={styles.imageThumbnail} source={{uri: item['image_path']}}/>
            </View>
            <Text style={{marginLeft: 10, textAlign: 'left', fontSize: 16, color: colors.AppGray }}> {item['name']} </Text>
          </View>
          <Image style={commonStyles.nextIconStyle} source={check ? empty : forwardIcon} />
        </View>
      </TouchableOpacity>
    )
  }
  render() {
    var title = this.state.translationDic['title'] ?? 'Category'
    let {categoryName} = this.props.route.params;
    if (categoryName != undefined) {
      title = this.state.titleName.length == 0 ? categoryName : this.state.titleName;
    }
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={title} showBackBtn={true} backBtnAction={() => this.backBtnAction()} />
        <View style={{height: '100%', backgroundColor: colors.AppWhite }}>
          <this.renderListView />
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
  listViewStyle: {
    width: "97%",
    margin: 10,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderColor: colors.BorderColor,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    justifyContent: 'space-between',
  },
  imageThumbnail : {
    width: 30,
    height: 30,
  },
});


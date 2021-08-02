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
import checkBox from '../../assets/checkBox.png';
import checkedBox from '../../assets/checkedBox.png';
import eventStyles from '../../StyleSheet/EventStyleSheet';
import FastImage from 'react-native-fast-image'



export default class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: [],
      attributeArray: [],
      updateUI: false,
      selectIndex: -1,
    }
  }

  componentDidMount() {
  }
  /*  Buttons   */
  didSelect(index) {
  this.setState({selectIndex: index})
  }
  doneBtnAction () {
    this.props.navigation.goBack();
  }
  /*  UI   */
 
  renderListView = () => {
    let {categoryList} = this.props.route.params;
    return (<View style={{margin: 5, height: '84%'}}>
      <FlatList
        data={categoryList}
        renderItem={this.renderListViewCellItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
      />
    </View>)
  }
  renderListViewCellItem = ({item, index}) => {
    let check = index == this.state.selectIndex ? true : false
    return (
      <TouchableOpacity onPress={() => this.didSelect(index)}>
        <View style={styles.listViewStyle}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image style={styles.imageThumbnail} source={{url: item['image_path']}}/>
            <Text style={{marginLeft: 10, textAlign: 'left', fontSize: 16, color: colors.AppGray }}> {item['name']} </Text>
          </View>
          <Image style={commonStyles.nextIconStyle} source={check ? checkedBox : checkBox} />
        </View>
      </TouchableOpacity>
    )
  }
  renderButtonView = () => {
    return (<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16 }}>
      <TouchableOpacity style={eventStyles.bottomBtnViewStyle} onPress={() => this.doneBtnAction()}>
        <View style={eventStyles.applyBtnViewStyle}>
          <Text style={{ color: colors.AppWhite, fontWeight: '600' }}>Done</Text>
        </View>
      </TouchableOpacity>
    </View>)
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Category'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} />
        <View style={{height: '100%', backgroundColor: colors.AppWhite }}>
          <this.renderListView />
          <this.renderButtonView />
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


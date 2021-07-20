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
import NavigationRoots from '../../../Constants/NavigationRoots';
import HeaderView from '../../../Component/Header'
import colors from '../../../CommonClasses/AppColor';
import commonStyles from '../../../StyleSheet/UserStyleSheet';
import forwardIcon from '../../../assets/forward.png';
import tickIcon from '../../../assets/tick.png';
import emptyIcon from '../../../assets/empty.png';

export default class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCatData: 0,
      selectedCategory: [],
      catIndex: 0,
      categoryArray: [],
      updateUI: false,
    }
  }

  componentDidMount() {
    const {categoryArray} = this.props.route.params;
    this.state.categoryArray = categoryArray
    this.setState({updateUI: !this.state.updateUI})
  }
  /*  Buttons   */
  didSelect = (item, itemData) => {
    this.setState({selectedCatData: itemData})
    if (item['sub_category'].length != 0) {
      this.state.categoryArray = item['sub_category'];
      this.setState({catIndex: this.state.catIndex + 1})
    }
  }
  backBtnAction(){
    if(this.state.catIndex == 0) {
      this.props.navigation.pop()
    } else {
      const {categoryArray} = this.props.route.params;
      this.state.categoryArray = categoryArray;
      this.setState({catIndex: this.state.catIndex - 1})
    }
  }
  doneBtnAction () {
    this.props.route.params.getCatID(this.state.selectedCatData);
    this.props.navigation.goBack();
  }
  /*  UI   */
  renderListView = () => {
  
    let catAry = this.state.categoryArray;
    var views = [];
    for (let a = 0; a < catAry.length; a++) {
      let item = catAry[a];
        if (item['sub_category'].length == 0) {
          views.push(
            <TouchableOpacity onPress={() => this.didSelect(item, item)}>
              <View style={styles.listViewStyle}>
                <Text style={{ textAlign: 'left', fontSize: 16, color: colors.AppGray }}> {item['name']} </Text>
                <Image style={commonStyles.nextIconStyle} source={this.state.selectedCatData['id'] != item['id'] ? emptyIcon : tickIcon} />
              </View>
            </TouchableOpacity>
          );
        } else {
          views.push(
            <TouchableOpacity onPress={() => this.didSelect(item, a)}>
              <View style={styles.listViewStyle}>
                <Text style={{ textAlign: 'left', fontSize: 16, color: colors.AppGray }}> {item['name']} </Text>
                <Image style={commonStyles.nextIconStyle} source={forwardIcon} />
              </View>
            </TouchableOpacity>
          );
      } 
    }
    return views;
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Category'} showBackBtn={true} backBtnAction={() => this.backBtnAction()} showDoneBtn={true} doneBtnAction={() => this.doneBtnAction()}/>
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
    justifyContent: 'space-between',
    width: "100%",
    margin: 5,
    borderBottomWidth: 1,
    borderColor: colors.BorderColor,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
});


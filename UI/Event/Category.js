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



export default class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryArray: [],
      updateUI: false,
      selectIndex: -1,
      catIndex: 0,
    }
  }

  componentDidMount() {
    let {categoryList} = this.props.route.params;
    this.state.categoryArray = categoryList
    this.setState({updateUI: !this.state.updateUI})
  }
  /*  Buttons   */
  didSelect(item,index) {
    this.setState({selectIndex: index})
    if (item['sub_category']) {
      console.log('coming', this.state.catIndex);
      console.log('second', item['sub_category'].length);
      if (item['sub_category'].length != 0) {
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
            <Image style={styles.imageThumbnail} source={{url: item['image_path']}}/>
            <Text style={{marginLeft: 10, textAlign: 'left', fontSize: 16, color: colors.AppGray }}> {item['name']} </Text>
          </View>
          <Image style={commonStyles.nextIconStyle} source={check ? empty : forwardIcon} />
        </View>
      </TouchableOpacity>
    )
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Category'} showBackBtn={true} backBtnAction={() => this.backBtnAction()} />
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


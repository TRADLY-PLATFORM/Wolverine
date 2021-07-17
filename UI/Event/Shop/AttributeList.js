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


const windowWidth = Dimensions.get('window').width;

export default class AttributeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: [],
      attributeArray: [],
      updateUI: false,
    }
  }

  componentDidMount() {
    const {attributeArray} = this.props.route.params;
    this.state.attributeArray = attributeArray
    this.setState({updateUI: !this.state.updateUI})
  }
  /*  Buttons   */
  didSelect = (item, itemData) => {
    const {singleSelect} = this.props.route.params;
    if (singleSelect) {
      this.state.selectedAttributes = [];
      this.state.selectedAttributes.push(item);
    } else  {
      let obj = this.state.selectedAttributes.findIndex(x => x.id === item['id'])
      if (obj != -1) {
        this.state.selectedAttributes.splice(obj, 1);
      }else {
        this.state.selectedAttributes.push(item);
      }
    }
    this.setState({updateUI: !this.state.updateUI})
  }
  doneBtnAction () {
    const {singleSelect} = this.props.route.params;
    this.props.route.params.getAtriValue(this.state.selectedAttributes,singleSelect);
    this.props.navigation.goBack();
  }
  /*  UI   */
  renderListView = () => {
    let atAry = this.state.attributeArray;
    var views = [];
    for (let a = 0; a < atAry.length; a++) {
      let item = atAry[a];
      let obj = this.state.selectedAttributes.findIndex(x => x.id === item['id'])
      let check = obj == -1 ? true : false
      views.push(
        <TouchableOpacity onPress={() => this.didSelect(item, a)}>
          <View style={styles.listViewStyle}>
            <Text style={{ textAlign: 'left', fontSize: 16, color: colors.AppGray }}> {item['name']} </Text>
            <Image style={commonStyles.nextIconStyle} source={check ? emptyIcon : tickIcon} />
          </View>
        </TouchableOpacity>
      );
    }
    return views;
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Attributes'}
          showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}
          showDoneBtn={true} doneBtnAction={() => this.doneBtnAction()}/>
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
    width: "97%",
    margin: 5,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderColor: colors.BorderColor,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
});


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
import checkBox from '../../../assets/checkBox.png';
import checkedBox from '../../../assets/checkedBox.png';


const windowWidth = Dimensions.get('window').width;

export default class Sort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: [],
      attributeArray: [],
      updateUI: false,
    }
  }

  componentDidMount() {
  }
  /*  Buttons   */
  didSelect = (item, itemData) => {
    
    this.setState({updateUI: !this.state.updateUI})
  }
  doneBtnAction () {
    const {singleSelect} = this.props.route.params;
    this.props.route.params.getAtriValue(this.state.selectedAttributes,singleSelect);
    this.props.navigation.goBack();
  }
  /*  UI   */
 
  renderListView = () => {
    return (<View style={{margin: 5, height: '84%'}}>
      <FlatList
        data={[1,1,1,1,1,1,1,1,1,1,1,1]}
        renderItem={this.renderListViewCellItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
      />
    </View>)
  }
  renderListViewCellItem = ({item, index}) => {
    let check = index == 4 ? true : false
    return (
      <TouchableOpacity>
        <View style={styles.listViewStyle}>
          <Image style={commonStyles.nextIconStyle} source={check ? checkedBox : checkBox} />
          <Text style={{ textAlign: 'left', fontSize: 16, color: colors.AppGray }}> {'Distance'} </Text>
        </View>
      </TouchableOpacity>
    )
  }
  renderButtonView = () => {
    return (<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16 }}>
      <TouchableOpacity style={styles.bottomBtnViewStyle}>
        <View style={styles.applyBtnViewStyle}>
          <Text style={{ color: colors.AppWhite, fontWeight: '600' }}>Done</Text>
        </View>
      </TouchableOpacity>
    </View>)
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Sort'} backBtnIcon={'cross'} showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()} />
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
    margin: 5,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderColor: colors.BorderColor,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  bottomBtnViewStyle: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 2,
    borderRadius: 20,
  },
  clearBtnViewStyle: {
    borderRadius: 4,
    borderColor: colors.AppTheme,
    borderWidth: 1,
    margin: 5,
    width: '100%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AppWhite,
  },
  applyBtnViewStyle: {
    borderRadius: 4,
    margin: 5,
    width: '100%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AppTheme,
  }
});


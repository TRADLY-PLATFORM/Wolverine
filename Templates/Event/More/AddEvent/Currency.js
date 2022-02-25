import React, { Component } from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import NavigationRoots from '../../../../Constants/NavigationRoots';
import HeaderView from '../../../../Component/Header'
import colors from '../../../../CommonClasses/AppColor';
import commonStyles from '../../../../StyleSheet/UserStyleSheet';
import forwardIcon from '../../../../assets/forward.png';
import tickIcon from '../../../../assets/tick.png';
import emptyIcon from '../../../../assets/empty.png';

export default class Currency extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCurrency: [],
      currencyArray: [],
      updateUI: false,
    }
  }
  componentDidMount() {
    const {currencyArray} = this.props.route.params;
    this.state.currencyArray = currencyArray
    this.setState({updateUI: !this.state.updateUI})
  }
  /*  Buttons   */
  didSelect = (item) => {
    this.state.selectedCurrency = [];
    this.state.selectedCurrency.push(item);
    this.setState({ updateUI: !this.state.updateUI })
  }
  doneBtnAction () {
    this.props.route.params.getCurrencyID(this.state.selectedCurrency);
    this.props.navigation.goBack();
  }
  /*  UI   */
  renderListView = () => {
    let atAry = this.state.currencyArray;
    var views = [];
    for (let a = 0; a < atAry.length; a++) {
      let item = atAry[a];
      let obj = this.state.selectedCurrency.findIndex(x => x.id === item['id'])
      let check = obj == -1 ? true : false
      views.push(
        <TouchableOpacity onPress={() => this.didSelect(item)}>
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
        <HeaderView title={'Currency'}
          showBackBtn={true} backBtnAction={() => this.props.navigation.goBack()}
          showDoneBtn={true} doneBtnAction={() => this.doneBtnAction()}/>
        <View style={{height: '100%', backgroundColor: colors.AppWhite }}>
          <ScrollView>
            <this.renderListView />
            <View style={{height: 100}}/>
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


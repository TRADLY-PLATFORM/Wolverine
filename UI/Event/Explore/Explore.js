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
// import NavigationRoots from '../../../../Constants/NavigationRoots';
import HeaderView from '../../../Component/Header'
import colors from '../../../CommonClasses/AppColor';
import commonStyles from '../../../StyleSheet/UserStyleSheet';

import ImagePicker from 'react-native-image-crop-picker';

const windowWidth = Dimensions.get('window').width;

export default class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: 0,
      photo: null,
      updateUI: false,
      showModal: false,
      showDropDown: false,
      categoryID: -1,
      categoryName: 'Select Category',
    }
  }
  componentDidMount() {
  }
  /*  Buttons   */

  /*  UI   */
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Explore'} showBackBtn={false} />
        <View style={{ height: '100%', backgroundColor: colors.LightBlueColor }}>
          <ScrollView showsVerticalScrollIndicator={false}>
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
});


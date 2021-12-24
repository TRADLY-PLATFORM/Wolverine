

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../CommonClasses/AppColor';
import AppConstants from '../Constants/AppConstants';

const windowWidth = Dimensions.get('window').width;

export default class SuccessView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    }
  }
  static propTypes = {
    show: PropTypes.bool,
    onPress:PropTypes.func,
    title:PropTypes.string,
  };
  successView = () => {
    let title = this.props.title == undefined ? 'Successfully Updated' :  this.props.title
    return <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.show}
        onRequestClose={() => {Alert.alert("Modal has been closed.");}}>
        <View style={styles.successContainer}>
          <View style={styles.successView}>
            <Image style={styles.bannerImageViewStyle} resizeMode="contain" source={require('../assets/sucess.png')}>
            </Image>
            <View style={{ marginTop: 20 }} />
            <Text style={styles.txtStyle}>{title}</Text>
            <TouchableOpacity style={styles.submitBtnStyle} onPress={() => this.props.onPress()}>
              <Text style={{ fontSize: 16, fontWeight: "400", color: 'white' }}>{AppConstants.okTitle}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
}
  render() {
    return (<View>
      <this.successView />
    </View>)
  }
}
const styles = StyleSheet.create({
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.blackTransparent
  },
  successView: {
    height: 340,
    width: "80%",
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: "center",
  },
  submitBtnStyle: {
    marginTop: 30,
    backgroundColor: colors.AppTheme,
    marginLeft: "8%",
    marginRight: "8%",
    height: 45,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    marginBottom: 20,
  },
  bannerImageViewStyle: {
    marginTop: 20,
    aspectRatio: 16 / 9,
  },
  txtStyle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    textAlign: "left",
    marginBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: colors.Lightgray
},
});

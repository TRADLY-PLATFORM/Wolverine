import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
// import notificationIcon from '../assets/notification.png';
import commonStyle from '../StyleSheet/UserStyleSheet';

export default class AppHeader extends Component {
  static propTypes = {
    title: PropTypes.string,
    showBackBtn:PropTypes.bool,
    backBtnAction: PropTypes.func,
    notificationBtnAction: PropTypes.func,
    showDoneBtn:PropTypes.bool,
    doneBtnAction: PropTypes.func,
  };

  renderDoneBtn = () => {
    if (this.props.showDoneBtn) {
      return <View>
        <TouchableOpacity onPress={() => this.props.doneBtnAction()}>
            <Text style={{color: 'white', fontSize: 16}}>{'Done'}</Text>
        </TouchableOpacity>
      </View>
    } else {
      return <View />
    }
  }
  render() {
    if (this.props.showBackBtn) {
      return <View style={commonStyle.headerViewStyle}>
        <StatusBar barStyle="light-content" />
        <TouchableOpacity style={{left:0}} onPress={() => this.props.backBtnAction()}>
          <Image style={commonStyle.backBtnStyle} resizeMode="contain" source={require('../assets/back.png')}>
          </Image>
        </TouchableOpacity>
        <Text style={commonStyle.headerTitleStyle}>{this.props.title}</Text>
        <this.renderDoneBtn />
      </View>
    } else {
      return <View style={commonStyle.headerViewStyle}>
        <StatusBar barStyle="light-content" />
        <Text style={commonStyle.headerTitleStyle}>{this.props.title}</Text>
        {/* <TouchableOpacity onPress={() => this.props.notificationBtnAction()}>
          <Image source={notificationIcon} style={commonStyle.backBtnStyle} />
        </TouchableOpacity> */}
      </View>
    }
  }
}

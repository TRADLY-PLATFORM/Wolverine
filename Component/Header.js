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
import backIcon from '../assets/back.png'
import closeIcon from '../assets/close.png'
import menuIcon from '../assets/menu.png'
import searchIcon from '../assets/search.png'
import heartEmptyIcon from '../assets/heartEmpty.png'

export default class AppHeader extends Component {
  static propTypes = {
    title: PropTypes.string,
    showBackBtn:PropTypes.bool,
    backBtnAction: PropTypes.func,
    notificationBtnAction: PropTypes.func,
    showDoneBtn:PropTypes.bool,
    doneBtnAction: PropTypes.func,
    doneBtnTitle: PropTypes.string,
    backBtnIcon: PropTypes.string,
  };

  renderDoneBtn = () => {
    if (this.props.showDoneBtn) {
      if (this.props.doneBtnTitle == 'More') {
        return <View>
          <TouchableOpacity onPress={() => this.props.doneBtnAction()}>
          <Image style={commonStyle.backBtnStyle} resizeMode='contain'  source={menuIcon} />
        </TouchableOpacity>
        </View>
      }else if (this.props.doneBtnTitle == 'Search') {
        return <View>
          <TouchableOpacity onPress={() => this.props.doneBtnAction()}>
          <Image style={{height: 25, width: 25}} resizeMode='contain'  source={searchIcon} />
        </TouchableOpacity>
        </View>
      }else if (this.props.doneBtnTitle == 'Favourite') {
        return <View>
          <TouchableOpacity onPress={() => this.props.doneBtnAction()}>
          <Image style={{height: 25, width: 25}} resizeMode='contain'  source={heartEmptyIcon} />
        </TouchableOpacity>
        </View>
      }else {
      return <View>
        <TouchableOpacity onPress={() => this.props.doneBtnAction()}>
            <Text style={{color: 'white', fontSize: 16, fontWeight: '700'}}>
              {this.props.doneBtnTitle == undefined ? 'Done' : this.props.doneBtnTitle }
            </Text>
        </TouchableOpacity>
      </View>
      }
    } else {
      return <View />
    }
  }
  render() {
    if (this.props.showBackBtn) {
      return <View style={commonStyle.headerViewStyle}>
        <StatusBar barStyle="light-content" />
        <TouchableOpacity style={{left:0}} onPress={() => this.props.backBtnAction()}>
          <Image 
            style={this.props.backBtnIcon == undefined ? commonStyle.backBtnStyle : styles.crossStyle} resizeMode="contain" 
            source={this.props.backBtnIcon == undefined ? backIcon : closeIcon}>
          </Image>
        </TouchableOpacity>
        <Text style={commonStyle.headerTitleStyle}>{this.props.title}</Text>
        <this.renderDoneBtn />
      </View>
    } else {
      return <View style={commonStyle.headerViewStyle}>
        <StatusBar barStyle="light-content" />
        <Text style={commonStyle.headerTitleStyle}>{this.props.title}</Text>
        <this.renderDoneBtn />
      </View>
    }
  }
}
const styles = StyleSheet.create({
  crossStyle: {
    height: 15,
    width: 15,
  },
});
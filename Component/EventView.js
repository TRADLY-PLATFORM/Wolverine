
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../CommonClasses/AppColor';
import eventStyles from '../StyleSheet/EventStyleSheet';
import FastImage from 'react-native-fast-image'
import sample from '../assets/dummy.png';

const windowWidth = Dimensions.get('window').width;
export default class EventView extends Component {
  static propTypes = {
    data: PropTypes.any,
  };

  renderEventView = () => {
    let item = this.props.data;
    let price = item['list_price'];
    var photo = item['images'] ? item['images'] : [];
    let profilePic = sample;
    if(item['account']['images']) {
      let images = item['account']['images'] ? item['account']['images'] : [];
      profilePic = images.length == 0 ? sample : {uri:images[0]}
    }
    return (<View style={eventStyles.horizontalCellItemStyle}>
      <FastImage style={eventStyles.selectedImageStyle} source={photo.length == 0 ? sample : { uri: photo[0] }} />
      <View style={{ padding: 2 }}>
        <Text style={{ fontWeight: '600', fontSize: 12, padding: 3 }} numberOfLines={1}>{item['title']}</Text>
        <View style={{ height: 5 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }}>
            <FastImage style={{ height: 25, width: 25, borderRadius: 12.5 }} source={profilePic}/>
            <Text numberOfLines={1} style={{ color: colors.Lightgray, fontSize: 10, padding: 5, width: '70%' }}>{item['account']['name']}</Text>
          </View>
          <View>
            <View style={eventStyles.followContainerStyle}>
              <Text style={{fontSize: 14, fontWeight: '600', color: colors.AppWhite}}>{price['formatted']}</Text>
            </View>
          </View>
        </View>
        <View style={{ height: 5 }} />
      </View>
    </View>)
  }
  render() {
      return (<View>
        <this.renderEventView />
      </View>)
  }
}

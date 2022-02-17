
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../CommonClasses/AppColor';
import eventStyles from '../StyleSheet/EventStyleSheet';
import FastImage from 'react-native-fast-image'
import sample from '../assets/dummy.png';

const windowWidth = Dimensions.get('window').width;
export default class StoreListItem extends Component {
  static propTypes = {
    data: PropTypes.any,
  };

  renderEventView = () => {
    let item = this.props.data;

    let profilePic = sample;
    if(item['account']) {
      name = item['account']['name'];
      let images = item['account']['images'] ? item['account']['images'] : [];
      profilePic = images.length == 0 ? sample : {uri:images[0]}
    }
    if(item['name']){
      title = item['name'];
    }

    var photo = item['images'] ? item['images'] : [];
    return (<View style={styles.variantCellViewStyle}>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <FastImage style={{ width: 110, height: 130, borderRadius: 5 }} source={photo.length == 0 ? sample : { uri: photo[0] }} />
        <View style={{ margin: 5,justifyContent: 'space-between' }}>
          <View style={{ margin: 5,width: '92%'}}>
            <Text style={eventStyles.titleStyle} numberOfLines={2}>{title}</Text>
          </View>
          <View style={{ margin: 5,}}>
            <Text style={styles.textStyle}>{item['total_listings']} Events</Text>
            <View style={{width: 5, height:5 }} />
            <Text style={styles.textStyle}>{item['total_followers']} Followers</Text>
          </View>
        </View>
        <View>
        </View>
      </View>
    </View>)
  }
  render() {
      return (<View>
        <this.renderEventView />
      </View>)
  }
}
const styles = StyleSheet.create({
  variantCellViewStyle: {
    flexDirection: 'row',
    margin: 5,
    justifyContent: 'space-between',
    alignContent: 'center',
    borderRadius: 5,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    backgroundColor: colors.AppWhite,
    width: windowWidth - 20,
    elevation: 10,
  },
  selectedImageStyle: {
    height: windowWidth/2.25,
    width: windowWidth/2.25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cellItemTextStyle: {
    fontWeight: '500',
    fontSize: 10,
    padding: 3
  },
  textStyle:{
    fontSize: 14,
    fontWeight: '400',
    color: colors.AppGray
  }
});
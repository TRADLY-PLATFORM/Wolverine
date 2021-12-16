
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
import {getTimeFormat} from '../HelperClasses/SingleTon'
import timeIcon from '../assets/timeIcon.png';
import starIcon from '../assets/star.png';
import heartIcon from '../assets/heartIcon.png';
import favouriteIcon from '../assets/favourite.png';


const windowWidth = Dimensions.get('window').width;
export default class ExploreListItem extends Component {
  static propTypes = {
    data: PropTypes.any,
  };

  renderEventView = () => {
    let item = this.props.data;
    var title = '';
    var rattingAvg = '';
    var price = '';
    var time = '';
    var name = '';
    let profilePic = sample;
    if(item['account']) {
      name = item['account']['name'];
      let images = item['account']['images'] ? item['account']['images'] : [];
      profilePic = images.length == 0 ? sample : {uri:images[0]}
    }
    if(item['title']){
      title = item['title'];
      price = item['list_price']['formatted']
      // time = getTimeFormat(item['start_at']) + ` to ` +  getTimeFormat(item['end_at']) 
    }
    if (item['rating_data']) {
      rattingAvg = item['rating_data']['rating_average']
    }
    if (item['list_price']) {
      price = item['list_price']['formatted']
      // time = getTimeFormat(item['start_at']) + ` to ` +  getTimeFormat(item['end_at']) 
    }
    var photo = item['images'] ? item['images'] : [];
    let icon = item['liked'] ? favouriteIcon :  heartIcon

    return (<View style={styles.variantCellViewStyle}>
    <View style={{flexDirection: 'row', width: '80%'}}>
      <FastImage style={{ width: 110, height: 130, borderRadius: 5 }}  source={photo.length == 0 ? sample : { uri: photo[0] }} />
        <View style={{ margin: 5 }}>
          <View style={{ margin: 5, flexDirection: 'row', alignItems: 'center',width: '85%' }}>
            {/* <Image style={{ width: 15, height: 15 }} resizeMode='center' source={timeIcon} /> */}
            {/* <View style={{ width: 5 }} /> */}
            <Text style={eventStyles.titleStyle} numberOfLines={1}>{title}</Text>
          </View>
          {/* <View style={{ margin: 5, width: '80%'}}>
          <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '400', color: colors.AppGray }}>{title}</Text>
        </View> */}
          <View style={{ margin: 5, flexDirection: 'row', alignItems: 'center' }}>
            <Image style={{ width: 15, height: 15, marginTop: -3 }} source={starIcon} />
            <View style={{ width: 5 }} />
            <Text style={eventStyles.subTitleStyle}>{`${rattingAvg}`}</Text>
          </View>
          <View style={{ margin: 5, marginTop: 5 }}>
            <Text style={eventStyles.titleStyle}>{price}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
            <FastImage style={{ height: 25, width: 25, borderRadius: 12.5 }} source={profilePic}/>
            <Text numberOfLines={1} style={{color: colors.Lightgray, fontSize: 12, padding: 5,fontWeight: '400'}}>
              {name}</Text>
          </View>
        </View>
      <View>
        </View>
    </View>
    <View style={{ alignContent: 'center', padding: 10}}>
      <Image style={{width: 40, height: 40, marginTop: 5}} resizeMode='center' source={icon} />
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
    height: 130,
    elevation: 10,
  },
});

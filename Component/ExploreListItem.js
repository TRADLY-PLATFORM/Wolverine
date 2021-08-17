
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
    if(item['title']){
      title = item['title'];
      rattingAvg =item['rating_data']['rating_average']
      price =item['list_price']['formatted']
      time = getTimeFormat(item['start_at']) + ` to ` +  getTimeFormat(item['end_at']) 
    }
    var photo = item['images'] ? item['images'] : [];
    let icon = item['liked'] ? favouriteIcon :  heartIcon

    return (<View style={styles.variantCellViewStyle}>
    <View style={{flexDirection: 'row', width: '80%'}}>
      <FastImage style={{ width: 110, height: 130, borderRadius: 5 }} source={photo.length == 0 ? sample : { uri: photo[0] }} />
      <View style={{ margin: 5 }}>
        <View style={{ margin: 5, flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{ width: 15, height: 15 }} resizeMode='center' source={timeIcon} />
          <View style={{ width: 5 }} />
          <Text style={eventStyles.titleStyle} numberOfLines={1}>{time}</Text>
        </View>
        <View style={{ margin: 5, width: '80%'}}>
          <Text style={{ fontSize: 14, fontWeight: '400', color: colors.AppGray }}>{title}</Text>
        </View>
        <View style={{ margin: 5, flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{ width: 15, height: 15 }} source={starIcon} />
          <View style={{ width: 5 }} />
          <Text style={eventStyles.subTitleStyle}>{`${rattingAvg} | 0 rating`}</Text>
        </View>
        <View style={{ margin: 5, marginTop: 15}}>
        <Text style={eventStyles.titleStyle}>{price}</Text>
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
  
});

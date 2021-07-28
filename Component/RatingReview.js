
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
import starIcon from '../assets/star.png';
import colors from '../CommonClasses/AppColor';
import eventStyles from '../StyleSheet/EventStyleSheet';

export default class RatingReview extends Component {
  static propTypes = {
    title: PropTypes.string,
  };

  renderRatingReviewView = () => {
    var views = []
    var allStartView = [];
    var valueView = [];
    var progressView = [];
    for (let a = 0; a < 5; a++) {
      var starView = [];
      for (let b = 0; b <= a; b++) {
        starView.push(<View style={{ flexDirection: 'row', margin: 5 }}>
          <Image source={starIcon} style={{ height: 15, width: 15 }} />
        </View>)
      }
      allStartView.push(<View>
        {starView}
      </View>)
      progressView.push(<View style={{ borderRadius: 5, backgroundColor: 'red', height: 10, width: 10 * a + 10, margin: 5, marginTop: 10 }} />)
      valueView.push(<View style={{ margin: 5 }}>
        <Text style={eventStyles.subTitleStyle}>{10 * a} </Text>
      </View>)
    }
  
    views.push(<View>
      <Text style={eventStyles.titleStyle}>{`Ratings and reviews`}</Text>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: '25%', marginTop: 10 }}>
          <Text style={{ fontWeight: '600', fontSize: 44 }}>{'4.4'}</Text>
          <Text style={eventStyles.subTitleStyle}>{`216 ratings`}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            {allStartView}
          </View>
          <View style={{ width: '33%' }}>
            {progressView}
          </View>
          <View>
            {valueView}
          </View>
        </View>
      </View>
    </View>)
    return views;
  }
  render() {
      return (<View>
        <this.renderRatingReviewView />
      </View>)
  }
}
const styles = StyleSheet.create({
  crossStyle: {
    height: 15,
    width: 15,
  },
});


import React, { Component } from 'react';
import {FlatList, Alert, TextInput, Text, Image, View,
  StyleSheet, SafeAreaView, TouchableOpacity,ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../CommonClasses/AppColor';
import pic1 from '../../assets/obBoarding1.png';
import pic2 from '../../assets/obBoarding2.png';
import pic3 from '../../assets/obBoarding3.png';
import NavigationRoots from '../../Constants/NavigationRoots';
import AppIntroSlider from 'react-native-app-intro-slider';
import eventStyles from '../../StyleSheet/EventStyleSheet';

const slides = [{
  key: 1,
  title: 'Find classes for your kids',
  text: '',
  image: pic1,
}, {
  key: 2,
  title: 'Select and pay for classes',
  text: '',
  image: pic2,
}, {
  key: 3,
  title: 'Give ratings and feedback on the classes',
  text: '',
  image: pic3,
}
];
export default class OnBoardings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      slider: AppIntroSlider | undefined,
      index: 0,
    }
    
  }
  componentDidMount() {
  }
  /*  Buttons   */
  _onDone = () => {
    this.props.navigation.navigate(NavigationRoots.BottomTabbar)
  }
  _nextBtnAction(){
    this.state.index = this.state.index + 1;
    this.slider.goToSlide(this.state.index,true)
  }
  /*  UI   */
  _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageViewStyle}>
          <Image source={item.image} style={styles.image}/>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  }
  renderNextBtn = () => {
    return (<View style={styles.buttonCircle}>
      <TouchableOpacity onPress={() => this._nextBtnAction()}>
        <View style={eventStyles.applyBtnViewStyle}>
          <Text style={{ color: colors.AppWhite, fontWeight: '600' }}>Next</Text>
        </View>
      </TouchableOpacity>
    </View>)
  }
  renderDoneBtn = () => {
    return (<View style={styles.buttonCircle}>
      <TouchableOpacity  onPress ={() => this._onDone()}>
        <View style={eventStyles.applyBtnViewStyle}>
          <Text style={{ color: colors.AppWhite, fontWeight: '600' }}>Done</Text>
        </View>
      </TouchableOpacity>
    </View>)
  }
  renderIntro = () => {
    return <AppIntroSlider 
      dotStyle={{backgroundColor: colors.LightGreen}}
      activeDotStyle={{backgroundColor: colors.AppTheme}}
      renderItem={this._renderItem}
      data={slides} 
      renderNextButton={this.renderNextBtn}
      renderDoneButton={this.renderDoneBtn}
      onSlideChange={i => this.setState({index: i})}
      ref={ref => this.slider = ref}
      />;
  }
  render() {
    return (
      <LinearGradient style={styles.Container} colors={[colors.AppWhite, colors.AppWhite]} >
        <View style={{ flex: 1, flexDirection: 'column'}} >
          <View style={{backgroundColor:colors.AppTheme, height: '50%', width: '100%'}}>
          </View>
          <View style={{height: '100%', width: '100%',position: 'absolute'}}>
            <View style={{height: '100%'}}>
              <this.renderIntro />
            </View>
            <View style={styles.skipBtnViewStyle}> 
              <TouchableOpacity onPress ={() => this._onDone()}>
                <Text style={{color: colors.AppWhite, fontSize: 20, fontWeight: '500'}}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.AppTheme
  },
  titleStyle: {
    color: 'black'
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageViewStyle: {
    margin: 20,
    padding:20 ,
    width: '100%'
  },
  image: {
    width: '100%',
    borderRadius: 20,
  },
  text: {
    color: colors.AppWhite,
    textAlign: 'center',
  },
  title: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: '500',
    color: colors.AppTheme,
    textAlign: 'center',
  },
  skipBtnViewStyle: {
    width: '100%',
    marginTop: 50 ,
    position: 'absolute',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 20,
  },
  buttonCircle: {
    width: 80,
    height: 40,
    backgroundColor: colors.AppTheme,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 2,
    borderRadius: 20,
  }
});

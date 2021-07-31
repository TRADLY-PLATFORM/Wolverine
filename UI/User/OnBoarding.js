
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
import Onboarding from 'react-native-onboarding-swiper';


export default class OnBoardings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    }
  }
  componentDidMount() {
  }
  /*  Buttons   */
  signUpBtnAction() {
    // this.props.navigation.navigate(NavigationRoots.SignIn);
  }
  /*  UI   */
  render() {
    return (
      <LinearGradient style={styles.Container} colors={[colors.GradientTop, colors.GradientBottom]} >
          <View style={{position: 'relative', flexDirection: 'column'}}>
            <View style={{backgroundColor: colors.AppTheme, height: '50%'}}> 
            </View>
            <View style={{backgroundColor: colors.AppTheme, height: '50%'}}>
            <View style={{height: '195%', marginTop: '-100%', margin: 0,}} >
              <Onboarding
                onDone={() => this.props.navigation.navigate(NavigationRoots.SignIn)}
                onSkip={() => this.props.navigation.navigate(NavigationRoots.SignIn)}
                pages={[
                  {
                    backgroundColor: colors.lightTransparent,
                    image: <Image source={pic1} />,
                    title: 'Find classes for your kids',
                    titleStyles: { color: colors.AppWhite }
                  },
                  {
                    backgroundColor: colors.lightTransparent,
                    image: <Image source={pic2} />,
                    title: 'Select and pay for classes',
                    titleStyles: { color: colors.AppWhite }

                  },
                  {
                    backgroundColor: colors.lightTransparent,
                    image: <Image source={pic3} />,
                    title: "Give ratings and feedback on the classes",
                    titleStyles: { color: colors.AppWhite }
        
                  },
                ]}
              />
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
});
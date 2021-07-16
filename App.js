/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { StyleSheet, SafeAreaView ,LogBox,View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import colors from './CommonClasses/AppColor';
import NavigationRoots from './Constants/NavigationRoots';

import OnBoarding from './UI/User/OnBoarding';
import Signin from './UI/User/SignIn';
import Signup from './UI/User/SignUp';
import Verifications from './UI/User/Verification';
import ForgotPassword from './UI/User/ForgotPassword';
import bottomBar from './Component/BottomTabbar';
import CategoryList from './UI/Event/Shop/CategoryList';


const Stack = createStackNavigator();

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: 'false',
      reload: true,
    }
  }
  componentDidMount() {
    LogBox.ignoreAllLogs(true)

  }
  navigationReturn = () => {
    return <NavigationContainer>
      <Stack.Navigator initialRouteName={NavigationRoots.SignIn} screenOptions={{
        headerShown: false}}>
        <Stack.Screen name={NavigationRoots.OnBoardings} component={OnBoarding} />
        <Stack.Screen name={NavigationRoots.SignIn} component={Signin}
        options={{
          title: '',
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }} />
        <Stack.Screen name={NavigationRoots.SignUp}component={Signup} />
        <Stack.Screen name={NavigationRoots.Verification}component={Verifications} />
        <Stack.Screen name={NavigationRoots.ForgotPassword}component={ForgotPassword} />
        <Stack.Screen name={NavigationRoots.BottomTabbar} component={bottomBar}/>
        <Stack.Screen name={NavigationRoots.Category}component={CategoryList} />

        {/* <Stack.Screen name={NavigationRoots.BottomTabbar} component={bottomTabBar}/>
        <Stack.Screen name={NavigationRoots.VerifyPhoneNo}component={VerifyPhone} />
        <Stack.Screen name={NavigationRoots.PhoneVerification}component={PhoneVerifications} />
        <Stack.Screen name={NavigationRoots.Target}component={Target} />
        <Stack.Screen name={NavigationRoots.SetTarget}component={SetTarget} />
        <Stack.Screen name={NavigationRoots.CollectionHistory}component={CollectionHistory} />
        <Stack.Screen name={NavigationRoots.AddRecycleItem}component={AddRecycleItems} />
        <Stack.Screen name={NavigationRoots.RecycleGuide}component={RecycleGuides} />
        <Stack.Screen name={NavigationRoots.ApplyGroup}component={ApplyGroups} />
        <Stack.Screen name={NavigationRoots.InviteFriends}component={InviteFriends} />
        <Stack.Screen name={NavigationRoots.AddBinMap}component={AddBinMaps} />
        <Stack.Screen name={NavigationRoots.Notifications}component={Notifications} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  }
  render() {
    if (this.state.reload == false) {
      return <SafeAreaView style={styles.container}></SafeAreaView>
    } else {
      return (<View style={styles.navigationContainer}>
        <this.navigationReturn />
      </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.AppTheme,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationContainer: {
    flex: 1,
    backgroundColor:colors.AppTheme,
  },
});
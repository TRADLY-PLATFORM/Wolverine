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
import AttributesList from './UI/Event/Shop/AttributeList';
import AddressList from './UI/Event/Shop/AddressList';
import MyStore from './UI/Event/More/MyStore/MyStore';
import Profile from './UI/Event/More/EditProfile/EditProfile';
import CreateStore from './UI/Event/Shop/CreateShop';
import AddEvent from './UI/Event/More/AddEvent/AddEvent';
import Currency from './UI/Event/More/AddEvent/Currency';
import EventTimings from './UI/Event/More/AddEvent/EventTiming';
import AddVariant from './UI/Event/More/AddEvent/AddVariant';
import VariantList from './UI/Event/More/AddEvent/VariantList';
import AddVariantValue from './UI/Event/More/AddEvent/AddVariantValue';
import Filter from './UI/Event/Explore/Filter';
import Category from './UI/Event/Explore/Category';
import EventDetail from './UI/Event/EventDetail/EventDetail';
import ChatScreen from './UI/Event/Chat/ChatScreen';

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
      <Stack.Navigator initialRouteName={NavigationRoots.OnBoardings} screenOptions={{
        headerShown: false}}>
        <Stack.Screen name={NavigationRoots.OnBoardings} component={OnBoarding} />
        <Stack.Screen name={NavigationRoots.SignIn} component={Signin}
          options={{
            title: '',
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }} />
         <Stack.Screen name={NavigationRoots.BottomTabbar} component={bottomBar} />
        <Stack.Screen name={NavigationRoots.SignUp} component={Signup} />
        <Stack.Screen name={NavigationRoots.Verification} component={Verifications} />
        <Stack.Screen name={NavigationRoots.ForgotPassword} component={ForgotPassword} />
        <Stack.Screen name={NavigationRoots.Category} component={CategoryList} />
        <Stack.Screen name={NavigationRoots.AttributeList} component={AttributesList} />
        <Stack.Screen name={NavigationRoots.AddressList} component={AddressList} />
        <Stack.Screen name={NavigationRoots.MyStore} component={MyStore} />
        <Stack.Screen name={NavigationRoots.Currency} component={Currency} />
        <Stack.Screen name={NavigationRoots.EventTiming} component={EventTimings} />
        <Stack.Screen name={NavigationRoots.AddVariant} component={AddVariant} />
        <Stack.Screen name={NavigationRoots.VariantList} component={VariantList} />
        <Stack.Screen name={NavigationRoots.AddVariantValue} component={AddVariantValue} />
        <Stack.Screen name={NavigationRoots.Sort} component={Category} />
        <Stack.Screen name={NavigationRoots.EventDetail} component={EventDetail} />
        <Stack.Screen name={NavigationRoots.ChatScreen} component={ChatScreen} />

        <Stack.Screen name={NavigationRoots.Filter}component={Filter} options={{
          title: '',
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}/>
        <Stack.Screen name={NavigationRoots.Profile}component={Profile} options={{
          title: '',
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}/>
        <Stack.Screen name={NavigationRoots.CreateStore} component={CreateStore} options={{
          title: '',
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }} />
         <Stack.Screen name={NavigationRoots.AddEvent} component={AddEvent} options={{
          title: '',
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }} />
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
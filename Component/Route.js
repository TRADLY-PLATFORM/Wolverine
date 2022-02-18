/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import colors from '../CommonClasses/AppColor';
import NavigationRoots from '../Constants/NavigationRoots';
import OnBoarding from '../UI/User/OnBoarding';
import Signin from '../UI/User/SignIn';
import Signup from '../UI/User/SignUp';
import Verifications from '../UI/User/Verification';
import ForgotPassword from '../UI/User/ForgotPassword';
import bottomBar from '../Component/BottomTabbar';
import CategoryList from '../UI/Event/Shop/CategoryList';
import AttributesList from '../UI/Event/Shop/AttributeList';
import AddressList from '../UI/Event/Shop/AddressList';
import MyStore from '../UI/Event/More/MyStore/MyStore';
import Profile from '../UI/Event/More/EditProfile/EditProfile';
import CreateStore from '../UI/Event/Shop/CreateShop';
import AddEvent from '../UI/Event/More/AddEvent/AddEvent';
import Currency from '../UI/Event/More/AddEvent/Currency';
import EventTimings from '../UI/Event/More/AddEvent/EventTiming';
import AddVariant from '../UI/Event/More/AddEvent/AddVariant';
import VariantList from '../UI/Event/More/AddEvent/VariantList';
import AddVariantValue from '../UI/Event/More/AddEvent/AddVariantValue';
import Filter from '../UI/Event/Explore/Filter';
import Category from '../UI/Event/Category';
import EventDetail from '../UI/Event/EventDetail/EventDetail';
import ChatScreen from '../UI/Event/Chat/ChatScreen';
import EventList from '../UI/Event/EventList';
import ConfirmBooking from '../UI/Event/EventDetail/ConfirmBooking';
import MyOrders from '../UI/Event/More/MyOrders/MyOrders';
import OrderDetail from '../UI/Event/More/MyOrders/OrderDetail';
import PaymentScreen from '../UI/Event/More/Payments/PaymentScreen';
import MySale from '../UI/Event/More/MySale/MySale';
import PayoutsScreen from '../UI/Event/More/MySale/PayoutsScreen';
import InviteFriend from '../UI/Event/More/InviteFriends';
import appConstant from '../Constants/AppConstants';
import Notifications from '../UI/Event/Notification/Notifications';
import Schedules from '../UI/Event/EventDetail/Schedule';
import MyCart from '../UI/Event/More/MyCart/MyCart';
import Shipment from '../UI/Event/More/MyCart/Shipment';
import AddAddress from '../UI/Event/More/MyCart/AddAddress'
import Language from '../UI/User/Language';
import ResetPassword from '../UI/User/ResetPassword';
import StoreList from '../UI/Event/StoreList';
import MangoPaySetup from '../UI/Event/More/Payments/MangoPaySetup';



const Stack = createStackNavigator();

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
  }
  navigationReturn = () => {
    let root = appConstant.appInstalled ? NavigationRoots.BottomTabbar : NavigationRoots.Language
    return <NavigationContainer>
      <Stack.Navigator initialRouteName={root} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={NavigationRoots.OnBoardings} component={OnBoarding} />
        <Stack.Screen name={NavigationRoots.SignIn} component={Signin}
          options={{
            title: '',
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }} />
        <Stack.Screen name={NavigationRoots.Language} component={Language} />
        <Stack.Screen name={NavigationRoots.BottomTabbar} component={bottomBar} />
        <Stack.Screen name={NavigationRoots.SignUp} component={Signup} />
        <Stack.Screen name={NavigationRoots.Verification} component={Verifications} />
        <Stack.Screen name={NavigationRoots.ForgotPassword} component={ForgotPassword} />
        <Stack.Screen name={NavigationRoots.CategoryList} component={CategoryList} />
        <Stack.Screen name={NavigationRoots.AttributeList} component={AttributesList} />
        <Stack.Screen name={NavigationRoots.AddressList} component={AddressList} />
        <Stack.Screen name={NavigationRoots.MyStore} component={MyStore} />
        <Stack.Screen name={NavigationRoots.Currency} component={Currency} />
        <Stack.Screen name={NavigationRoots.EventTiming} component={EventTimings} />
        <Stack.Screen name={NavigationRoots.AddVariant} component={AddVariant} />
        <Stack.Screen name={NavigationRoots.VariantList} component={VariantList} />
        <Stack.Screen name={NavigationRoots.AddVariantValue} component={AddVariantValue} />
        <Stack.Screen name={NavigationRoots.Category} component={Category} />
        <Stack.Screen name={NavigationRoots.EventDetail} component={EventDetail} />
        <Stack.Screen name={NavigationRoots.ChatScreen} component={ChatScreen} />
        <Stack.Screen name={NavigationRoots.EventList} component={EventList} />
        <Stack.Screen name={NavigationRoots.ConfirmBooking} component={ConfirmBooking} />
        <Stack.Screen name={NavigationRoots.MyOrders} component={MyOrders} />
        <Stack.Screen name={NavigationRoots.OrderDetail} component={OrderDetail} />
        <Stack.Screen name={NavigationRoots.PaymentScreen} component={PaymentScreen} />
        <Stack.Screen name={NavigationRoots.MySale} component={MySale} />
        <Stack.Screen name={NavigationRoots.PayoutsScreen} component={PayoutsScreen} />
        <Stack.Screen name={NavigationRoots.InviteFriend} component={InviteFriend} />
        <Stack.Screen name={NavigationRoots.Notifications} component={Notifications} />
        <Stack.Screen name={NavigationRoots.Schedule} component={Schedules} />
        <Stack.Screen name={NavigationRoots.MyCart} component={MyCart} />
        <Stack.Screen name={NavigationRoots.Shipment} component={Shipment} />
        <Stack.Screen name={NavigationRoots.ResetPassword} component={ResetPassword} />
        <Stack.Screen name={NavigationRoots.StoreList} component={StoreList} />
        <Stack.Screen name={NavigationRoots.MangoPaySetup} component={MangoPaySetup} />

        <Stack.Screen name={NavigationRoots.AddAddress} component={AddAddress} options={{
          title: '',
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }} />
        <Stack.Screen name={NavigationRoots.Filter} component={Filter} options={{
          title: '',
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }} />
        <Stack.Screen name={NavigationRoots.Profile} component={Profile} options={{
          title: '',
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }} />
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
    return (<View style={styles.navigationContainer}>
      <this.navigationReturn />
    </View>);
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.AppTheme,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationContainer: {
    flex: 1,
    backgroundColor: colors.AppTheme,
  },
});
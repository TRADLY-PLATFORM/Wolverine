import React from 'react';

import { Image} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Home from '../UI/Order/Home/HomeScreen'
import Deliveries from '../UI/Order/Deliveries/DelivieriesScreen'
import More from '../UI/Order/More/MoreScreen'

import colors from './AppColors';

const Tab = createBottomTabNavigator();


function AppTabbar() {
  return (
    <Tab.Navigator initialRouteName="الرئيسية" tabBarOptions={{
      activeTintColor:colors.Appgreen ,
      inactiveTintColor: '#c3d5fa',
      labelStyle: { fontSize: 12 }
      
    }}  screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          //Home
          iconName = focused    ? require('../assets/homeActive.png')  : require('../assets/homeUnActive.png');
        } else if (route.name === 'Deliveries') {
           //Deliveries
          iconName = focused    ? require('../assets/DeliveriesActive.png')  : require('../assets/DeliveriesUnActive.png');
        }
        else if (route.name === 'More') {
          //More
          iconName = focused    ? require('../assets/moreActive.png')  : require('../assets/moreUnActive.png');
        }
        return  <Image
        source={iconName}
        style={{width: 20, height: 20}}
      />
      },
    })}  >
      <Tab.Screen name="Home" component={Home}/>
      <Tab.Screen name="Deliveries" component={Deliveries} />
      <Tab.Screen name="More" component={More} />
     
    </Tab.Navigator>
  );
}
export default AppTabbar;
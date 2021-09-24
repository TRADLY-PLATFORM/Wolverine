import React from 'react';
import {Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../UI/Event/Home';
import shop from '../UI/Event/Shop/CreateShop'
import AddEvent from '../UI/Event/More/AddEvent/AddEvent'
import explore from '../UI/Event/Explore/Explore'
import colors from '../CommonClasses/AppColor';
import More from '../UI/Event/More/More';
import appConstant from '../Constants/AppConstants';
import ConversationList from '../UI/Event/Chat/ConversationList';
import Login from '../UI/User/SignIn';
import SvgUri from 'react-native-svg-uri';

const Tab = createBottomTabNavigator();

function AppTabbar() {
  var centerTab = Login;
  var chatS = Login;

  if (appConstant.loggedIn) {
    centerTab = appConstant.accountID.length == 0 ? shop : AddEvent
  }
  if (appConstant.loggedIn) {
    chatS = ConversationList;
  }
  return (
    <Tab.Navigator initialRouteName="Home" tabBarOptions={{
      activeTintColor: colors.AppTheme,
      inactiveTintColor: '#c3d5fa',
      labelStyle: { fontSize: 12, color: 'black' }
      
    }} screenOptions={({ route}) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        let tabColor;
        if (route.name === 'Home') {
          iconName = require('../assets/homeIcon.svg');
          tabColor = focused ? colors.AppTheme : colors.AppGray
        } else if (route.name === 'Search') {
          iconName = require('../assets/searchSvg.svg');
          tabColor = focused ? colors.AppTheme : colors.AppGray
        } else if (route.name === 'List') {
          iconName = focused ? require('../assets/tradly.png') : require('../assets/tradly.png');
          return <Image source={iconName} resizeMode={'contain'} style={{ width: 18, height: 18 }} />
        } else if (route.name === 'Chat') {
          iconName = require('../assets/chatIcon.svg');
          tabColor = focused ? colors.AppTheme : colors.AppGray
        } else if (route.name === 'More') {
          iconName = require('../assets/more.svg');
          tabColor = focused ? colors.AppTheme : colors.AppGray
        }
        return  <SvgUri width={20} height={20} source={iconName} fill={tabColor} />
      },
    })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={explore} options={{tabBarVisible: appConstant.hideTabbar}}/>
      <Tab.Screen name="List" component={centerTab} options={{tabBarVisible: false}}/>
      <Tab.Screen name="Chat" component={chatS}  options={{tabBarVisible: appConstant.loggedIn}}/>
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
}
export default AppTabbar;
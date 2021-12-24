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
import AppConstants from '../Constants/AppConstants';
import Svg, { G, Path } from 'react-native-svg';


const Tab = createBottomTabNavigator();

function AppTabbar() {
  var centerTab = Login;
  var chatS = Login;

  let home = AppConstants.bottomTabBarDic['home'] ?? 'Home';
  let more = AppConstants.bottomTabBarDic['more'] ?? 'More'
  let chat = AppConstants.bottomTabBarDic['chats'] ?? 'Chat'
  let sell = AppConstants.bottomTabBarDic['sell'] ?? 'Sell'
  let search = AppConstants.bottomTabBarDic['search'] ?? 'search'

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
        if (route.name === home) {
          iconName = require('../assets/home.png');
          tabColor = focused ? colors.AppTheme : colors.AppGray
        } else if (route.name === search) {
          iconName = require('../assets/search.png');
          tabColor = focused ? colors.AppTheme : colors.AppGray
        } else if (route.name === sell) {
          iconName = focused ? {uri:appConstant.sellIcon } : {uri:appConstant.sellIcon} ;
          return <Image source={iconName} resizeMode={'contain'} style={{ width: 18, height: 18 }} />
        } else if (route.name === chat) {
          iconName = require('../assets/chat.png');
          tabColor = focused ? colors.AppTheme : colors.AppGray
        } else if (route.name === more) {
          iconName = require('../assets/more.png');
          tabColor = focused ? colors.AppTheme : colors.AppGray
        }
        return <Image source={iconName} resizeMode={'contain'} style={{ width: 18, height: 18,tintColor: tabColor}} />
      },
    })}>
      <Tab.Screen name={home} component={Home} />
      <Tab.Screen name={search} component={explore} options={{tabBarVisible: appConstant.hideTabbar}}/>
      <Tab.Screen name={sell} component={centerTab} options={{tabBarVisible: false}}/>
      <Tab.Screen name={chat} component={chatS}  options={{tabBarVisible: appConstant.loggedIn}}/>
      <Tab.Screen name={more} component={More} />
    </Tab.Navigator>
  );
}
export default AppTabbar;
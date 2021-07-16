import React from 'react';
import {Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../UI/Event/Home';
import shop from '../UI/Event/Shop/CreateShop'
import explore from '../UI/Event/Explore/Explore'
import colors from '../CommonClasses/AppColor';

const Tab = createBottomTabNavigator();

function AppTabbar() {
  return (
    <Tab.Navigator initialRouteName="Home" tabBarOptions={{
      activeTintColor:colors.AppTheme ,
      inactiveTintColor: '#c3d5fa',
      labelStyle: { fontSize: 12, color: 'black' }  
    }}  screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused    ? require('../assets/home.png')  : require('../assets/home.png');
        } else if (route.name === 'Explore') {
          iconName = focused    ? require('../assets/feed.png')  : require('../assets/feed.png');
        } else if (route.name === 'Sell') {
         iconName = focused    ? require('../assets/home.png')  : require('../assets/home.png');
        } else if (route.name === 'Chat') {
         iconName = focused    ? require('../assets/chat.png')  : require('../assets/chat.png');
        } else if (route.name === 'Profile') {
          iconName = focused    ? require('../assets/profile.png')  : require('../assets/profile.png');
        }
        return  <Image source={iconName} resizeMode={'contain'} style={{width: 18, height: 18}} />
      },
    })}>
      <Tab.Screen name="Home" component={Home}/>
      <Tab.Screen name="Explore" component={explore} />
      <Tab.Screen name="Sell" component={shop} />
      <Tab.Screen name="Chat" component={Home} />
      <Tab.Screen name="Profile" component={Home} />     
    </Tab.Navigator>
  );
}
export default AppTabbar;
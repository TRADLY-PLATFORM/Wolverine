import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Home from '../UI/Event/Home';
import shop from '../UI/Event/Shop/CreateShop';
import AddEvent from '../UI/Event/More/AddEvent/AddEvent';
import explore from '../UI/Event/Explore/Explore';
import colors from '../CommonClasses/AppColor';
import More from '../UI/Event/More/More';
import appConstant from '../Constants/AppConstants';

// JS-only tab bar to avoid native RNScreens crash on RN 0.81 + iOS 26 Fabric
// Original used createBottomTabNavigator which triggers RCTLegacyViewManagerInteropComponentView crash

function TabIcon({ name, focused }) {
  let icon;
  if (name === 'Home') icon = require('../assets/home.png');
  else if (name === 'Explore') icon = require('../assets/feed.png');
  else if (name === 'Sell') icon = require('../assets/home.png');
  else if (name === 'Chat') icon = require('../assets/chat.png');
  else if (name === 'More') icon = require('../assets/profile.png');
  return <Image source={icon} resizeMode="contain" style={{ width: 18, height: 18, opacity: focused ? 1 : 0.5 }} />;
}

export default function AppTabbar({ navigation, route }) {
  const [active, setActive] = useState('Home');

  // Pass through navigation from JS stack
  const nav = navigation || { navigate: () => {}, goBack: () => {} };

  const renderTab = () => {
    switch (active) {
      case 'Home': return <Home navigation={nav} route={route} />;
      case 'Explore': return <explore navigation={nav} route={route} />;
      case 'Sell': {
        const Comp = appConstant.accountID.length == 0 ? shop : AddEvent;
        return <Comp navigation={nav} route={route} />;
      }
      case 'Chat': return <Home navigation={nav} route={route} />;
      case 'More': return <More navigation={nav} route={route} />;
      default: return <Home navigation={nav} route={route} />;
    }
  };

  const tabs = ['Home', 'Explore', 'Sell', 'Chat', 'More'];

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderTab()}</View>
      <View style={styles.tabBar}>
        {tabs.map(t => (
          <TouchableOpacity key={t} onPress={() => setActive(t)} style={styles.tab}>
            <TabIcon name={t} focused={active === t} />
            <Text style={[styles.label, { color: active === t ? colors.AppTheme : '#999' }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
  tabBar: { flexDirection: 'row', height: 60, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff', alignItems: 'center' },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10, marginTop: 2 },
});

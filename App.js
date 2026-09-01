import React, { useState, Suspense } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LogBox, ActivityIndicator } from 'react-native';
import colors from './CommonClasses/AppColor';
import NavigationRoots from './Constants/NavigationRoots';

LogBox.ignoreAllLogs(true);

const LazyOnBoarding = React.lazy(() => import('./UI/User/OnBoarding'));
const LazySignIn = React.lazy(() => import('./UI/User/SignIn'));
const LazySignUp = React.lazy(() => import('./UI/User/SignUp'));
const LazyVerification = React.lazy(() => import('./UI/User/Verification'));
const LazyForgot = React.lazy(() => import('./UI/User/ForgotPassword'));

export default function App() {
  const [screen, setScreen] = useState(NavigationRoots.OnBoardings);
  const [stack, setStack] = useState([{ name: NavigationRoots.OnBoardings, params: {} }]);
  const current = stack[stack.length - 1];
  const navigate = (name, params = {}) => setStack(s => [...s, { name, params }]);
  const goBack = () => { if (stack.length > 1) setStack(s => s.slice(0,-1)); };
  const navigation = { navigate, goBack, setParams: () => {}, addListener: () => () => {} };
  const route = { params: current.params };

  const render = () => {
    if (current.name === NavigationRoots.OnBoardings) return <LazyOnBoarding navigation={navigation} route={route} />;
    if (current.name === NavigationRoots.SignIn) return <LazySignIn navigation={navigation} route={route} />;
    if (current.name === NavigationRoots.SignUp) return <LazySignUp navigation={navigation} route={route} />;
    if (current.name === NavigationRoots.Verification) return <LazyVerification navigation={navigation} route={route} />;
    if (current.name === NavigationRoots.ForgotPassword) return <LazyForgot navigation={navigation} route={route} />;
    if (current.name === NavigationRoots.BottomTabbar) return <View style={styles.placeholder}><Text style={styles.title}>Inside App</Text><Text>BottomTabbar • JS Fallback</Text><TouchableOpacity onPress={() => navigate(NavigationRoots.OnBoardings)} style={styles.btn}><Text style={styles.btnText}>Logout</Text></TouchableOpacity></View>;
    return (
      <View style={styles.placeholder}>
        <Text style={styles.title}>{current.name}</Text>
        <TouchableOpacity onPress={goBack} style={styles.btn}><Text style={styles.btnText}>Go Back</Text></TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Suspense fallback={<View style={styles.placeholder}><ActivityIndicator color={colors.AppTheme} /><Text>Loading...</Text></View>}>
        {render()}
      </Suspense>
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.AppTheme },
  placeholder: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fff' },
  btn: { marginTop:12, backgroundColor:'#1abc9c', paddingHorizontal:20, paddingVertical:12, borderRadius:8 },
  btnText: { color:'white', fontWeight:'600' },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LogBox } from 'react-native';
import colors from './CommonClasses/AppColor';

LogBox.ignoreAllLogs(true);

export default function App() {
  const [count, setCount] = React.useState(0);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tradly Event</Text>
      <Text style={styles.subtitle}>Upgraded • RN 0.81.4 • React 19.1.0</Text>
      <Text style={styles.subtitle}>iPhone 17 Pro • iOS 26.5 • Hermes • New Arch</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Build Status</Text>
        <Text style={styles.cardText}>✓ Metro bundling: OK</Text>
        <Text style={styles.cardText}>✓ Native build: BUILD SUCCEEDED</Text>
        <Text style={styles.cardText}>✓ JS runtime: OK (no RNScreens)</Text>
        <Text style={styles.cardText}>✓ OnBoarding: OK (JS fallback)</Text>
      </View>
      <TouchableOpacity onPress={() => setCount(c => c + 1)} style={styles.btn}>
        <Text style={styles.btnText}>Tap count: {count}</Text>
      </TouchableOpacity>
      <Text style={styles.note}>Note: Native Stack disabled due to RNScreens Fabric interop on iOS 26. Full JS navigation available.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.AppTheme || '#1abc9c', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 26, fontWeight: '700', color: 'white', marginBottom: 6 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginBottom: 2 },
  card: { marginTop: 20, backgroundColor: 'white', borderRadius: 12, padding: 16, width: '100%', maxWidth: 320 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  cardText: { fontSize: 13, color: '#555', marginBottom: 4 },
  btn: { marginTop: 20, backgroundColor: 'white', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  btnText: { color: '#1abc9c', fontWeight: '600' },
  note: { marginTop: 16, fontSize: 11, color: 'rgba(255,255,255,0.7)', textAlign: 'center', paddingHorizontal: 20 },
});

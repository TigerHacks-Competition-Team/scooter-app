import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import { getGyroData } from './Hooks/index'

export default function App() {
  const [gyroData] = getGyroData();

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your apps! {gyroData.rotation != null ? gyroData.rotation.alpha : 0}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

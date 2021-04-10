import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { DeviceMotion } from "expo-sensors";
import { getGyroData, getLocation } from "./Hooks/index";
import * as Permissions from "expo-permissions";

export default function App() {
  const [gyroData] = getGyroData();
  const [location, updateLocation] = getLocation();

  return (
    <View style={styles.container}>
      <Text>
        Rotation: {gyroData.rotation != null ? gyroData.rotation.alpha : 0}
      </Text>
      <Text>{location}</Text>
      <Button
        title="Update Location"
        onPress={() => {
          updateLocation();
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
